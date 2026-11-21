"""
Milestone 2, Day 14-15 — Cleaning & feature engineering.

Deliberately excludes lab_* columns from the model's feature set (see
data/generate_dataset.py docstring): the product predicts risk from
DIET + SYMPTOMS + PROFILE, i.e. before a lab test exists. Lab columns
stay in the frame only so the *labels* can be derived / evaluated.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer

TARGETS = ["anemia_risk", "iron_deficiency", "vitamin_d_deficiency", "b12_deficiency", "calcium_deficiency"]

NUMERIC_FEATURES = [
    "age", "bmi", "avg_kcal", "avg_protein_g", "avg_fiber_g",
    "avg_iron_mg", "avg_b12_mcg", "avg_calcium_mg", "avg_vitamin_d_iu",
    "symptom_fatigue", "symptom_hair_loss", "symptom_skin",
    "symptom_muscle_weakness", "symptom_mood",
]
CATEGORICAL_FEATURES = ["gender", "activity_level", "dietary_preference"]
FEATURE_COLUMNS = NUMERIC_FEATURES + CATEGORICAL_FEATURES


from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent


def load_clean(path=None):
    if path is None:
        path = ROOT / "data" / "nutrisense_dataset.csv"
    df = pd.read_csv(path)

    before = len(df)
    df = df.drop_duplicates()
    dropped_dupes = before - len(df)

    # sanity-range validation (defensive cleaning, not just NaN handling)
    df = df[(df["age"].between(10, 100)) & (df["bmi"].between(10, 60))]
    for col in ["symptom_fatigue", "symptom_hair_loss", "symptom_skin", "symptom_muscle_weakness"]:
        df = df[df[col].between(0, 3)]

    report = {
        "rows_in": before,
        "duplicates_dropped": dropped_dupes,
        "rows_after_range_checks": len(df),
        "missing_before_impute": df[FEATURE_COLUMNS].isna().sum().to_dict(),
    }
    return df.reset_index(drop=True), report


def build_preprocessor():
    numeric_pipe = Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale", StandardScaler()),
    ])
    categorical_pipe = Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore")),
    ])
    return ColumnTransformer([
        ("num", numeric_pipe, NUMERIC_FEATURES),
        ("cat", categorical_pipe, CATEGORICAL_FEATURES),
    ])


def split(df, seed=42):
    X = df[FEATURE_COLUMNS]
    y = df[TARGETS]
    # stratify on the rarest label combo isn't practical for multi-label;
    # stratify on a composite "any deficiency" flag to keep class balance close
    strat = (y.sum(axis=1) > 0).astype(int)
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.3, random_state=seed, stratify=strat
    )
    strat_temp = (y_temp.sum(axis=1) > 0).astype(int)
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=seed, stratify=strat_temp
    )
    return X_train, X_val, X_test, y_train, y_val, y_test


if __name__ == "__main__":
    df, report = load_clean()
    print(report)
    X_train, X_val, X_test, y_train, y_val, y_test = split(df)
    print("train/val/test:", X_train.shape, X_val.shape, X_test.shape)
