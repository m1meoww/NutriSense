# NutriSense — Milestone 2 & 3: AI Deficiency-Risk + Recommendation Engine 🤖🍽️

Backend companion to the NutriSense frontend.
- **Milestone 2:** predicts nutrient-deficiency risk (anemia, iron, vitamin D, B12, calcium) from diet, symptoms and profile data, with SHAP-based explanations for each prediction.
- **Milestone 3:** turns that risk into action — maps deficiencies to nutrients to real food recommendations, generates a 7-day meal plan (respecting dietary preference and allergies), and stores daily snapshots for history/trend views.

## Project structure

```
nutrisense-ml/
├── data/
│   └── generate_dataset.py     # Day 11-12: synthetic, clinically-grounded dataset
│   └── nutrisense_dataset.csv  # generated dataset (4000 rows)
│   └── nutrisense.db           # SQLite history store (created on first snapshot save)
├── notebooks/
│   └── 01_eda.py               # Day 13: exploratory data analysis
├── app/
│   ├── data_prep.py            # Day 14-15: cleaning + feature engineering
│   ├── train_model.py          # Day 16-18: RF baseline, XGBoost comparison, SHAP
│   ├── main.py                 # Day 19-20 + Milestone 3: FastAPI service, all endpoints
│   ├── catalog.py              # Milestone 3: recipe/food catalog + deficiency→nutrient map
│   ├── recommend.py            # Milestone 3: deficiency-to-food recommendation engine
│   ├── meal_planner.py         # Milestone 3: 7-day meal-plan generator + meal replacement
│   ├── storage.py              # Milestone 3: SQLite history/trend persistence
│   └── sample_request.json
├── models/                     # saved preprocessor.joblib, model.joblib, meta.json
├── reports/                    # eda_report.md, eda_plots.png, model_comparison.csv,
│                                # model_decision.txt, shap_top_features.json
└── requirements.txt
```

## How to run it yourself

```bash
pip install -r requirements.txt

# 1. regenerate the dataset (optional — a copy is already included)
python data/generate_dataset.py

# 2. run EDA (writes reports/eda_report.md + eda_plots.png)
python notebooks/01_eda.py

# 3. train + compare models + run SHAP (writes models/ and reports/)
cd app && python train_model.py

# 4. serve the API
uvicorn main:app --reload --port 8000
```

Then either open `http://localhost:8000/docs` for the interactive Swagger UI,
or:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

## All API endpoints

| Endpoint | Milestone | What it does |
|---|---|---|
| `GET /health` | 2 | Confirms the service and model are loaded |
| `POST /predict` | 2 | Deficiency-risk prediction (5 labels) + SHAP top factors |
| `POST /recommend` | 3 | Maps risk results → nutrients → recommended + alternative recipes, filtered by diet/allergies |
| `POST /meal-plan` | 3 | Generates a 7-day breakfast/lunch/snack/dinner plan prioritizing detected deficiencies |
| `POST /meal-plan/replace` | 3 | Swaps one meal, re-applying diet/allergy filters |
| `GET /recipes` | 3 | Filtered recipe search (diet, allergies, meal slot, text search) |
| `POST /diary/snapshot` | 3 | Saves a day's nutrition totals to SQLite history |
| `POST /risk/snapshot` | 3 | Saves a day's risk results to SQLite history |
| `GET /history` | 3 | Returns diary + risk history for trend charts (flags insufficient history) |

Full interactive docs (with request/response schemas) are always at `/docs` once the server is running.

## What each day's deliverable is, and where it lives

| Days | Deliverable | File |
|---|---|---|
| 11-12 | Labeled dataset + documented labeling strategy | `data/generate_dataset.py` |
| 13 | EDA report | `reports/eda_report.md`, `reports/eda_plots.png` |
| 14-15 | Cleaning + feature engineering pipeline | `app/data_prep.py` |
| 16 | Baseline model (Random Forest) | `app/train_model.py` |
| 17 | Model comparison (XGBoost) + selection | `reports/model_comparison.csv`, `reports/model_decision.txt` |
| 18 | SHAP explainability | `reports/shap_top_features.json` |
| 19-20 | FastAPI prediction service, tested end-to-end | `app/main.py` |
| M3 | Deficiency→nutrient→food mapping, allergy/diet filtering | `app/catalog.py`, `app/recommend.py` |
| M3 | 7-day meal planner + meal replacement | `app/meal_planner.py` |
| M3 | Recipe catalog + filtered search | `app/catalog.py` (`filter_recipes`), `GET /recipes` |
| M3 | History/trend storage (SQLite) | `app/storage.py`, `POST /diary/snapshot`, `POST /risk/snapshot`, `GET /history` |
| M3 | Frontend wired to all of the above, tested for vegetarian/vegan/non-veg + allergy profiles | `NutriSense.jsx` (Recommendations, Meal Plan, History pages) |

## Key design decision: no real labeled dataset existed for this

A food-composition API (USDA/ICMR-NIN) gives nutrient content per food —
it does not give labeled deficiency outcomes for a person. Rather than fake
that, `data/generate_dataset.py` documents exactly how the training data was
built: diet intake and demographics drive a latent "true" nutrient status,
which drives both simulated lab values (used only to derive ground-truth
labels via WHO/NIH thresholds) and simulated symptom severities. The
deployed model is trained on **diet + symptoms + profile only** — deliberately
excluding lab values — because the real product use case is estimating risk
*before* someone has a lab test, and recommending one when risk is high.

**Before using this for real users**, swap `data/generate_dataset.py`'s
output for a real dataset with the same column schema (e.g. an NHANES
dietary-recall + lab-panel merge) — the rest of the pipeline (cleaning →
features → model → SHAP → API) does not need to change.

## Current model performance (on held-out test set)

See `reports/model_comparison.csv`. Random Forest was selected (mean
ROC-AUC ≈ 0.83 across the 5 labels, best recall on the rarer classes).
Precision on the rarest labels (e.g. calcium deficiency, ~4% prevalence)
is still modest — expected at this data volume/class imbalance, and the
main thing a larger, real dataset would improve.

## Limitations (stated explicitly, per milestone requirement)

- Training data is synthetic; real-world calibration will shift once a real
  dataset is substituted.
- This is a **screening** tool, not a diagnostic one — the API response
  says so, and the frontend should always frame results as "consider
  getting tested," never as a diagnosis.
- Multi-label class imbalance means recall/precision trade-offs differ per
  label; `risk_band` thresholds (Low <20%, Moderate 20-50%, High >50%) are
  a reasonable starting point, not clinically validated cutoffs.
