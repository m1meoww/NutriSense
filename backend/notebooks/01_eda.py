"""Milestone 2, Day 13 — Exploratory Data Analysis."""
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
df = pd.read_csv(ROOT / "data" / "nutrisense_dataset.csv")

report = []
report.append("# NutriSense — EDA Report (Milestone 2, Day 13)\n")
report.append(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}\n")

report.append("## Missing values\n")
miss = df.isna().mean().round(4) * 100
miss = miss[miss > 0]
report.append(miss.to_frame("% missing").to_markdown() if len(miss) else "_No missing values._")
report.append("\n")

report.append("## Target prevalence (class imbalance check)\n")
targets = ["anemia_risk", "iron_deficiency", "vitamin_d_deficiency", "b12_deficiency", "calcium_deficiency"]
prev = (df[targets].mean() * 100).round(2)
report.append(prev.to_frame("% positive").to_markdown())
report.append("\n_All targets are minority-class (imbalanced) — evaluation uses precision/recall/F1/ROC-AUC per label, not accuracy alone, and models use `class_weight='balanced'` / `scale_pos_weight`._\n")

report.append("## Numeric feature summary\n")
num_cols = ["age", "bmi", "avg_kcal", "avg_protein_g", "avg_fiber_g", "avg_iron_mg",
            "avg_b12_mcg", "avg_calcium_mg", "avg_vitamin_d_iu"]
report.append(df[num_cols].describe().round(2).to_markdown())
report.append("\n")

report.append("## Diet preference vs deficiency rate\n")
tab = df.groupby("dietary_preference")[targets].mean().round(3) * 100
report.append(tab.to_markdown())
report.append("\n")

(ROOT / "reports").mkdir(exist_ok=True)
with open(ROOT / "reports" / "eda_report.md", "w") as f:
    f.write("\n".join(report))

# ---- plots ----
fig, axes = plt.subplots(1, 2, figsize=(11, 4))
prev.plot(kind="bar", ax=axes[0], color="#8FAE8B")
axes[0].set_title("Deficiency label prevalence (%)")
axes[0].set_ylabel("% positive")
tab.plot(kind="bar", ax=axes[1])
axes[1].set_title("Deficiency rate by diet preference (%)")
axes[1].legend(fontsize=7)
plt.tight_layout()
plt.savefig(ROOT / "reports" / "eda_plots.png", dpi=130)
print("EDA report + plots saved.")
