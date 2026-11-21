"""
NutriSense — Milestone 2, Day 19-20
FastAPI prediction service.

Run locally:
    cd nutrisense-ml/app
    uvicorn main:app --reload --port 8000

Then POST to http://localhost:8000/predict with a body matching
PredictRequest (see /docs for interactive schema, or sample_request.json).
"""
import json
import datetime
import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, Optional

from data_prep import TARGETS, FEATURE_COLUMNS
from catalog import ALLERGENS, filter_recipes
from recommend import recommend_for_profile
from meal_planner import generate_plan, replace_meal
import storage

from pathlib import Path
MODELS = Path(__file__).resolve().parent.parent / "models"

app = FastAPI(
    title="NutriSense Deficiency Risk API",
    description="Predicts nutrient-deficiency risk from diet, symptoms and profile data (Milestone 2).",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

preprocessor = joblib.load(f"{MODELS}/preprocessor.joblib")
model = joblib.load(f"{MODELS}/model.joblib")
with open(f"{MODELS}/meta.json") as f:
    META = json.load(f)

FEATURE_NAMES = np.array(META["feature_names_transformed"])
EXPLAINERS = {label: shap.TreeExplainer(est) for label, est in zip(TARGETS, model.estimators_)}


class PredictRequest(BaseModel):
    age: int = Field(..., ge=10, le=100, example=24)
    gender: Literal["Female", "Male", "Non-binary", "Prefer not to say"] = "Prefer not to say"
    bmi: float = Field(..., ge=10, le=60, example=23.0)
    activity_level: Literal["Sedentary", "Light", "Moderate", "Active", "Very active"] = "Moderate"
    dietary_preference: Literal["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"] = "Vegetarian"

    avg_kcal: float = Field(2000, ge=800, le=5000)
    avg_protein_g: float = Field(60, ge=0, le=300)
    avg_fiber_g: Optional[float] = Field(20, ge=0, le=100)
    avg_iron_mg: float = Field(10, ge=0, le=60)
    avg_b12_mcg: float = Field(2.0, ge=0, le=20)
    avg_calcium_mg: float = Field(700, ge=0, le=3000)
    avg_vitamin_d_iu: float = Field(300, ge=0, le=3000)

    symptom_fatigue: int = Field(0, ge=0, le=3)
    symptom_hair_loss: int = Field(0, ge=0, le=3)
    symptom_skin: int = Field(0, ge=0, le=3)
    symptom_muscle_weakness: int = Field(0, ge=0, le=3)
    symptom_mood: Optional[int] = Field(0, ge=0, le=3)

    class Config:
        json_schema_extra = {
            "example": {
                "age": 24, "gender": "Female", "bmi": 22.9, "activity_level": "Moderate",
                "dietary_preference": "Vegetarian", "avg_kcal": 1800, "avg_protein_g": 45,
                "avg_fiber_g": 18, "avg_iron_mg": 7, "avg_b12_mcg": 0.8, "avg_calcium_mg": 520,
                "avg_vitamin_d_iu": 150, "symptom_fatigue": 2, "symptom_hair_loss": 2,
                "symptom_skin": 1, "symptom_muscle_weakness": 1, "symptom_mood": 1,
            }
        }


class LabelResult(BaseModel):
    label: str
    risk_probability: float
    risk_band: Literal["Low", "Moderate", "High"]
    top_factors: list


class PredictResponse(BaseModel):
    results: list[LabelResult]
    disclaimer: str


def risk_band(p: float) -> str:
    if p < 0.2:
        return "Low"
    if p < 0.5:
        return "Moderate"
    return "High"


def humanize(feature_name: str) -> str:
    name = feature_name.split("__", 1)[-1]
    return name.replace("_", " ").replace("avg ", "").strip().capitalize()


@app.get("/health")
def health():
    return {"status": "ok", "model_type": META["model_type"], "targets": TARGETS}


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    row = {col: getattr(req, col) for col in FEATURE_COLUMNS}
    # gender in the training schema only has Female/Male/Non-binary;
    # "Prefer not to say" is folded into Non-binary at inference time to stay in-distribution
    if row["gender"] == "Prefer not to say":
        row["gender"] = "Non-binary"
    X = pd.DataFrame([row])[FEATURE_COLUMNS]
    Xt = preprocessor.transform(X)
    Xt_dense = Xt.toarray() if hasattr(Xt, "toarray") else Xt

    results = []
    for i, label in enumerate(TARGETS):
        proba = float(model.estimators_[i].predict_proba(Xt_dense)[0, 1])
        sv = EXPLAINERS[label].shap_values(Xt_dense)
        if isinstance(sv, list):
            vals = sv[1][0]
        elif isinstance(sv, np.ndarray) and sv.ndim == 3:
            vals = sv[0, :, 1]
        else:
            vals = sv[0]
        vals = np.asarray(vals).ravel()
        order = np.argsort(np.abs(vals))[::-1][:3]
        factors = [
            {
                "feature": humanize(FEATURE_NAMES[j]),
                "direction": "increases risk" if vals[j] > 0 else "lowers risk",
                "impact": round(float(abs(vals[j])), 4),
            }
            for j in order
        ]
        results.append(LabelResult(
            label=label, risk_probability=round(proba, 3),
            risk_band=risk_band(proba), top_factors=factors,
        ))

    return PredictResponse(
        results=results,
        disclaimer=(
            "Estimated risk from a screening model trained on synthetic, clinically-grounded "
            "data — not a diagnosis. High risk means: consider getting the relevant blood test."
        ),
    )


# =====================================================================
# Milestone 3 — deficiency-to-food recommendations, meal planning,
# recipe catalog, and history/trend storage
# =====================================================================

class RiskResultIn(BaseModel):
    label: str
    risk_probability: float
    risk_band: Literal["Low", "Moderate", "High"]


class ProfileIn(BaseModel):
    dietary_preference: Literal["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"] = "Vegetarian"
    allergies: list[str] = []


class RecommendRequest(BaseModel):
    profile: ProfileIn
    risk_results: list[RiskResultIn]


@app.post("/recommend")
def recommend(req: RecommendRequest):
    results = [r.model_dump() for r in req.risk_results]
    recs = recommend_for_profile(results, req.profile.dietary_preference, req.profile.allergies)
    return {"recommendations": recs, "allergens_available": ALLERGENS}


class MealPlanRequest(BaseModel):
    profile: ProfileIn
    risk_results: list[RiskResultIn]
    days: int = Field(7, ge=1, le=14)
    seed: Optional[int] = None


@app.post("/meal-plan")
def meal_plan(req: MealPlanRequest):
    try:
        results = [r.model_dump() for r in req.risk_results]
        plan = generate_plan(
            req.profile.dietary_preference, req.profile.allergies, results,
            days=req.days, seed=req.seed,
        )
        return {"plan": plan}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


class MealReplaceRequest(BaseModel):
    profile: ProfileIn
    risk_results: list[RiskResultIn]
    plan: list  # the plan as previously returned by /meal-plan
    day: int
    slot: Literal["breakfast", "lunch", "snack", "dinner"]
    exclude_ids: list[str] = []
    seed: Optional[int] = None


@app.post("/meal-plan/replace")
def meal_plan_replace(req: MealReplaceRequest):
    try:
        results = [r.model_dump() for r in req.risk_results]
        new_meal, updated_plan = replace_meal(
            req.plan, req.day, req.slot, req.profile.dietary_preference,
            req.profile.allergies, results, exclude_ids=req.exclude_ids, seed=req.seed,
        )
        return {"meal": new_meal, "plan": updated_plan}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@app.get("/recipes")
def recipes(
    dietary_preference: Literal["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"] = "Vegetarian",
    allergies: str = "",
    meal_slot: Optional[str] = None,
    search: Optional[str] = None,
):
    allergy_list = [a for a in allergies.split(",") if a]
    return {"recipes": filter_recipes(dietary_preference, allergy_list, meal_slot=meal_slot, search=search)}


class DiarySnapshotRequest(BaseModel):
    user_id: str = "demo"
    date: Optional[str] = None
    totals: dict  # {kcal, protein, carbs, fat}
    micros: dict  # {iron, b12, calcium, vitamin_d}


@app.post("/diary/snapshot")
def diary_snapshot(req: DiarySnapshotRequest):
    date = req.date or datetime.date.today().isoformat()
    storage.save_diary_snapshot(req.user_id, date, req.totals, req.micros)
    return {"status": "saved", "date": date}


class RiskSnapshotRequest(BaseModel):
    user_id: str = "demo"
    date: Optional[str] = None
    results: list[RiskResultIn]


@app.post("/risk/snapshot")
def risk_snapshot(req: RiskSnapshotRequest):
    date = req.date or datetime.date.today().isoformat()
    storage.save_risk_snapshot(req.user_id, date, [r.model_dump() for r in req.results])
    return {"status": "saved", "date": date}


@app.get("/history")
def history(user_id: str = "demo", days: int = 30):
    data = storage.get_history(user_id, days=days)
    return {
        **data,
        "has_sufficient_history": len(data["diary"]) >= 3,
        "note": (
            "Model outputs are risk estimates, not diagnoses."
            if len(data["diary"]) >= 3 else
            "Not enough history yet to show reliable trends — log a few more days."
        ),
    }
