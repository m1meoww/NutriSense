# NutriSense 🥑 — AI-Powered Nutrition Intelligence

NutriSense is a full-stack nutrition intelligence system built during an AI/ML internship.
It combines a health-tracking web app with a trained machine-learning model that predicts
nutrient-deficiency risk from a user's diet, symptoms, and profile — with explainable,
per-prediction reasoning.


## Overview

| | |
|---|---|
| **Frontend** | React + Tailwind CSS — health profile, food diary, symptom & lab tracking, ML risk dashboard |
| **Backend** | FastAPI (Python) — trained Random Forest model, SHAP explainability, `/predict` REST endpoint |
| **ML pipeline** | Clinically-grounded dataset generation → EDA → feature engineering → model comparison (Random Forest vs. XGBoost) → SHAP explainability |

## Features

**Health Profile**
- Captures age, gender, height, weight, activity level, medical conditions, dietary preference, and health goals

**Food Diary**
- Full CRUD meal logging (breakfast / lunch / snack / dinner)
- Food search against an Indian + USDA nutrient reference dataset
- Live daily calorie, macro, and micronutrient totals against a computed target (Mifflin-St Jeor)

**Symptoms & Labs**
- Symptom severity questionnaire (fatigue, hair loss, skin conditions, muscle weakness, mood)
- Structured blood-test input (hemoglobin, vitamin D, B12, iron, calcium) with automatic normal/low/high flags

**ML Risk Insights**
- Calls the trained multi-label model (anemia, iron, vitamin D, B12, calcium deficiency risk)
- SHAP-based explanations — every prediction shows *why*, not just a score
- Live frontend → FastAPI connection with a local explainable fallback for demonstrations

**Milestone 3 — Recommendation & Meal Planning**
- Deficiency → nutrient → food-source mapping
- Risk-prioritized food recommendations
- Hard filters for vegetarian / vegan / eggetarian / non-vegetarian profiles
- Allergy and food-exclusion filtering
- Preferred-food scoring without overriding safety rules
- Deficiency-specific alternatives and explainable match tags
- Breakfast / lunch / snack / dinner meal-selection rules
- Seven-day generator with a three-day repetition window
- One-click meal replacement with filters re-applied server-side
- Internal recipe API with search + risk relevance
- SQLite persistence for prediction snapshots and generated meal plans
- Historical risk/intake table and trend visualization
- Loading, error, empty and insufficient-history states
- Reusable dashboard cards and end-to-end user flow

## Tech stack

- **Frontend:** React, Tailwind CSS, lucide-react
- **Backend:** FastAPI, Pydantic, Uvicorn
- **ML:** scikit-learn (Random Forest), XGBoost, SHAP, pandas, NumPy
- **Data:** Synthetic dataset grounded in documented clinical/nutrition-science relationships (see `backend/README.md` for the full methodology)

## Repository structure

```
nutrisense/
├── frontend/            # React app (Vite)
│   ├── src/
│   └── package.json
├── backend/              # FastAPI service + ML pipeline
│   ├── data/             # dataset generator + generated CSV
│   ├── notebooks/        # EDA script
│   ├── app/               # data prep, training, FastAPI service
│   ├── models/            # trained model artifacts (.joblib)
│   ├── reports/           # EDA report, model comparison, SHAP summary
│   └── README.md          # detailed ML methodology & day-by-day deliverables
├── docs/
│   └── presentation-guide.md
├── .gitignore
└── README.md              # you are here
```

## Getting started

### 1. Backend (FastAPI + ML model)

```bash
cd backend
pip install -r requirements.txt
cd app
uvicorn main:app --reload --port 8000
```

Verify it's running: `http://localhost:8000/health`
Interactive API docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

Login with any email/password (demo mode) and walk through: **Health Profile → Food Diary →
Symptoms & Labs → ML Risk Insights → Run risk assessment**.

## Project status

| Milestone | Scope | Status |
|---|---|---|
| **Milestone 1** | Project setup, user profile, food diary, symptom & lab capture | ✅ Complete |
| **Milestone 2** | Deficiency-risk ML model, SHAP explainability, FastAPI service, live frontend integration | ✅ Complete |
| **Milestone 3** | Risk-to-food mapping, safety-aware recommendations, recipes, 7-day planning, snapshots, history, dashboard integration, QA flow | ✅ Complete |

## Limitations

- Training data for the ML model is synthetic, built on documented clinical thresholds and
  nutrition-science directionality — not real patient records. See `backend/README.md` for
  the full rationale and how to substitute a real dataset (e.g. an NHANES merge) without
  changing the modeling pipeline.
- This is a **screening** tool, not a diagnostic one. Predictions are framed as risk estimates
  that warrant a real blood test, never as a medical diagnosis.

## Author

Built by ## Mimansha Jha 🎀

