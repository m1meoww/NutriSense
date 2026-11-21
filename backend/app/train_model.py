"""
Milestone 2, Day 16-18 — Baseline model, model comparison, SHAP explainability.
"""
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier
from sklearn.metrics import precision_recall_fscore_support, roc_auc_score
from xgboost import XGBClassifier
import shap

from data_prep import load_clean, build_preprocessor, split, TARGETS, FEATURE_COLUMNS

from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "models"
REPORTS = ROOT / "reports"
OUT.mkdir(exist_ok=True)
REPORTS.mkdir(exist_ok=True)


def evaluate(y_true, y_pred, y_proba, label_names):
    rows = []
    for i, name in enumerate(label_names):
        p, r, f1, _ = precision_recall_fscore_support(
            y_true.iloc[:, i], y_pred[:, i], average="binary", zero_division=0
        )
        try:
            auc = roc_auc_score(y_true.iloc[:, i], y_proba[:, i])
        except ValueError:
            auc = float("nan")
        rows.append({"label": name, "precision": round(p, 3), "recall": round(r, 3),
                      "f1": round(f1, 3), "roc_auc": round(auc, 3)})
    return pd.DataFrame(rows)


def main():
    df, clean_report = load_clean()
    X_train, X_val, X_test, y_train, y_val, y_test = split(df)

    pre = build_preprocessor()
    Xt_train = pre.fit_transform(X_train)
    Xt_val = pre.transform(X_val)
    Xt_test = pre.transform(X_test)
    feature_names = pre.get_feature_names_out()

    # ---------------- Day 16: baseline Random Forest ----------------
    rf = MultiOutputClassifier(
        RandomForestClassifier(n_estimators=300, max_depth=8, class_weight="balanced",
                                random_state=42, n_jobs=-1)
    )
    rf.fit(Xt_train, y_train)
    rf_pred = rf.predict(Xt_test)
    rf_proba = np.column_stack([est.predict_proba(Xt_test)[:, 1] for est in rf.estimators_])
    rf_eval = evaluate(y_test, rf_pred, rf_proba, TARGETS)
    rf_eval.insert(0, "model", "RandomForest")

    # ---------------- Day 17: XGBoost comparison ----------------
    pos_rates = y_train.mean()
    xgb = MultiOutputClassifier(
        XGBClassifier(
            n_estimators=300, max_depth=4, learning_rate=0.08,
            subsample=0.9, colsample_bytree=0.9, eval_metric="logloss",
            random_state=42, n_jobs=-1,
        )
    )
    # per-label scale_pos_weight via sample weighting isn't native to MultiOutputClassifier,
    # so approximate imbalance handling with XGBoost's own regularized defaults + more trees
    xgb.fit(Xt_train, y_train)
    xgb_pred = xgb.predict(Xt_test)
    xgb_proba = np.column_stack([est.predict_proba(Xt_test)[:, 1] for est in xgb.estimators_])
    xgb_eval = evaluate(y_test, xgb_pred, xgb_proba, TARGETS)
    xgb_eval.insert(0, "model", "XGBoost")

    comparison = pd.concat([rf_eval, xgb_eval], ignore_index=True)
    comparison.to_csv(REPORTS / "model_comparison.csv", index=False)

    # pick winner by mean ROC-AUC across labels (more informative than accuracy on imbalanced labels)
    rf_score = rf_eval["roc_auc"].mean()
    xgb_score = xgb_eval["roc_auc"].mean()
    winner_name = "xgboost" if xgb_score >= rf_score else "random_forest"
    winner_model = xgb if xgb_score >= rf_score else rf

    decision = (
        f"RandomForest mean ROC-AUC: {rf_score:.3f} | XGBoost mean ROC-AUC: {xgb_score:.3f}\n"
        f"Selected model: {winner_name}\n"
    )
    with open(REPORTS / "model_decision.txt", "w") as f:
        f.write(decision)
    print(decision)
    print(comparison.to_string(index=False))

    # ---------------- Day 18: SHAP explainability on the winning model ----------------
    # Use the per-label estimators directly (tree explainer works per binary classifier)
    explainers = {}
    shap_summary = {}
    Xt_val_dense = Xt_val.toarray() if hasattr(Xt_val, "toarray") else Xt_val
    for i, label in enumerate(TARGETS):
        est = winner_model.estimators_[i]
        explainer = shap.TreeExplainer(est)
        sv = explainer.shap_values(Xt_val_dense[:200])
        # binary classifiers: take the positive-class contributions.
        # Newer shap returns (n_samples, n_features, n_classes); older returns a list.
        if isinstance(sv, list):
            vals = sv[1]
        elif isinstance(sv, np.ndarray) and sv.ndim == 3:
            vals = sv[:, :, 1]
        else:
            vals = sv
        mean_abs = np.asarray(np.abs(vals).mean(axis=0)).ravel()
        top_idx = np.argsort(mean_abs)[::-1][:6]
        shap_summary[label] = [
            {"feature": feature_names[j], "mean_abs_shap": round(float(mean_abs[j]), 4)}
            for j in top_idx
        ]

    with open(REPORTS / "shap_top_features.json", "w") as f:
        json.dump(shap_summary, f, indent=2)

    # ---------------- save everything the API needs ----------------
    joblib.dump(pre, f"{OUT}/preprocessor.joblib")
    joblib.dump(winner_model, f"{OUT}/model.joblib")
    with open(f"{OUT}/meta.json", "w") as f:
        json.dump({
            "model_type": winner_name,
            "targets": TARGETS,
            "feature_columns": FEATURE_COLUMNS,
            "feature_names_transformed": feature_names.tolist(),
            "clean_report": clean_report,
            "mean_roc_auc": {"random_forest": round(rf_score, 3), "xgboost": round(xgb_score, 3)},
        }, f, indent=2)

    print("Saved model, preprocessor, meta, SHAP summary, comparison report.")


if __name__ == "__main__":
    main()
