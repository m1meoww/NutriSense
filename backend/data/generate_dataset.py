"""
NutriSense — Milestone 2, Day 11-12
Synthetic-but-clinically-grounded dataset generator.

WHY SYNTHETIC DATA (documented, per milestone requirement to verify
labeling before modeling):
  A food-composition API (USDA/ICMR-NIN) gives nutrient content of foods,
  not labeled deficiency outcomes for a person. A real deficiency-labeled
  dataset that jointly covers diet intake + symptoms + lab values at the
  individual level (e.g. an NHANES dietary-recall + lab-panel merge) needs
  a separate data-engineering pass outside this sandbox. To keep Milestone 2
  end-to-end and testable now, this script generates a dataset whose
  *causal structure* is grounded in real clinical/nutrition-science
  directionality:
    - lower intake of a nutrient -> lower simulated lab value for it
    - lower lab value -> higher chance of the symptoms clinically
      associated with that deficiency
    - demographic risk modifiers follow published epidemiology
      (e.g. higher iron-deficiency prevalence in women of reproductive
      age, higher B12/iron/calcium risk on vegan diets, higher vitamin D
      risk with age and low sun/activity)
  Ground-truth labels are then thresholded on the simulated labs using
  standard WHO/NIH adult reference ranges (the same ranges already shown
  in the app's Symptoms & Labs screen), which is a defensible way to
  define "deficient" when you do have lab data.

  IMPORTANT: model features for training deliberately EXCLUDE the lab
  columns. The product's real use case is estimating risk from diet +
  symptoms *before* someone has a lab test, and recommending a test when
  risk is high — not re-deriving the label from the label. Labs are kept
  in the output only as an evaluation/debug column.

Replacing this generator with a real merged dataset (e.g. NHANES dietary
+ lab data) later only requires matching this same column schema.
"""

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)
N = 4000

# ---------------- demographics & lifestyle ----------------
age = RNG.integers(18, 66, N)
gender = RNG.choice(["Female", "Male", "Non-binary"], N, p=[0.5, 0.47, 0.03])
height = RNG.normal(165, 9, N).clip(145, 195)
weight = RNG.normal(65, 13, N).clip(40, 120)
bmi = weight / (height / 100) ** 2
activity = RNG.choice(
    ["Sedentary", "Light", "Moderate", "Active", "Very active"], N,
    p=[0.2, 0.25, 0.3, 0.17, 0.08],
)
diet_pref = RNG.choice(
    ["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"], N,
    p=[0.45, 0.1, 0.15, 0.3],
)

# ---------------- diet intake (avg daily, from food-diary style logs) ----------------
diet_penalty = {  # lower multiplier = lower nutrient intake typical of that diet
    "iron": {"Vegetarian": 0.85, "Vegan": 0.7, "Eggetarian": 0.9, "Non-Vegetarian": 1.05},
    "b12": {"Vegetarian": 0.55, "Vegan": 0.15, "Eggetarian": 0.65, "Non-Vegetarian": 1.05},
    "calcium": {"Vegetarian": 0.95, "Vegan": 0.7, "Eggetarian": 0.95, "Non-Vegetarian": 1.0},
    "vitd": {"Vegetarian": 0.85, "Vegan": 0.65, "Eggetarian": 0.9, "Non-Vegetarian": 1.0},
}
pref_arr = diet_pref

kcal = RNG.normal(2000, 350, N).clip(1100, 3200)
protein_g = RNG.normal(60, 18, N).clip(20, 150)
fiber_g = RNG.normal(22, 8, N).clip(5, 55)

iron_mg = (RNG.normal(12, 4.2, N) * np.array([diet_penalty["iron"][d] for d in pref_arr])).clip(2, 30)
b12_mcg = (RNG.normal(2.6, 1.5, N) * np.array([diet_penalty["b12"][d] for d in pref_arr])).clip(0.05, 9)
calcium_mg = (RNG.normal(750, 260, N) * np.array([diet_penalty["calcium"][d] for d in pref_arr])).clip(150, 1800)
vitd_iu = (RNG.normal(280, 170, N) * np.array([diet_penalty["vitd"][d] for d in pref_arr])).clip(20, 1200)

# activity nudges vitamin D up a bit (proxy for outdoor time)
activity_vitd_bonus = pd.Series(activity).map(
    {"Sedentary": -60, "Light": -20, "Moderate": 20, "Active": 60, "Very active": 90}
).to_numpy()
vitd_iu = (vitd_iu + activity_vitd_bonus).clip(20, 1400)

# ---------------- latent deficiency propensity (0..1, higher = more deficient) ----------------
def scale_risk(x, lo, hi):
    """Map an intake value to a 0..1 risk score: low intake -> high risk."""
    r = (hi - x) / (hi - lo)
    return np.clip(r, 0, 1)

iron_prop = 0.55 * scale_risk(iron_mg, 6, 18) + 0.25 * (pd.Series(gender) == "Female").to_numpy() + RNG.normal(0, 0.12, N)
b12_prop = 0.6 * scale_risk(b12_mcg, 1.0, 4.5) + 0.1 * (age > 50) + RNG.normal(0, 0.12, N)
calcium_prop = 0.5 * scale_risk(calcium_mg, 400, 1100) + 0.15 * (age > 45) + RNG.normal(0, 0.12, N)
vitd_prop = 0.5 * scale_risk(vitd_iu, 150, 700) + 0.2 * (pd.Series(activity).isin(["Sedentary", "Light"])).to_numpy() + RNG.normal(0, 0.12, N)
hb_prop = 0.6 * iron_prop + 0.2 * scale_risk(protein_g, 30, 80) + RNG.normal(0, 0.1, N)

for arr in (iron_prop, b12_prop, calcium_prop, vitd_prop, hb_prop):
    np.clip(arr, 0, 1, out=arr)

# ---------------- simulated lab values (noisy function of propensity) ----------------
lab_hemoglobin = (16 - hb_prop * 6 + RNG.normal(0, 0.7, N)).clip(7, 18)
lab_iron = (170 - iron_prop * 130 + RNG.normal(0, 12, N)).clip(15, 220)
lab_vitamin_d = (55 - vitd_prop * 45 + RNG.normal(0, 5, N)).clip(4, 90)
lab_vitamin_b12 = (700 - b12_prop * 620 + RNG.normal(0, 60, N)).clip(50, 1100)
lab_calcium = (10.4 - calcium_prop * 2.6 + RNG.normal(0, 0.25, N)).clip(6.5, 11.5)

# ---------------- symptom severities (0-3), probabilistically driven by propensity ----------------
def severity_from_prop(prop, extra=0.0):
    p = np.clip(prop + extra, 0, 1)
    # probability of each severity level increases with p
    out = np.zeros(N, dtype=int)
    r = RNG.random(N)
    out = np.where(r < p * 0.15, 3, out)
    out = np.where((r >= p * 0.15) & (r < p * 0.4), 2, out)
    out = np.where((r >= p * 0.4) & (r < p * 0.75), 1, out)
    return out

fatigue = severity_from_prop(0.5 * iron_prop + 0.3 * vitd_prop + 0.2 * b12_prop)
hair_loss = severity_from_prop(0.7 * iron_prop + 0.3 * b12_prop)
skin = severity_from_prop(0.5 * b12_prop + 0.5 * vitd_prop)
muscle_weakness = severity_from_prop(0.5 * calcium_prop + 0.3 * vitd_prop + 0.2 * hb_prop)
mood = severity_from_prop(0.5 * vitd_prop + 0.5 * b12_prop)

# ---------------- ground-truth labels: thresholded on simulated labs (WHO/NIH ranges) ----------------
anemia_risk = (lab_hemoglobin < 12).astype(int)
iron_deficiency = ((lab_iron < 60) | (lab_hemoglobin < 12)).astype(int)
vitamin_d_deficiency = (lab_vitamin_d < 20).astype(int)
b12_deficiency = (lab_vitamin_b12 < 200).astype(int)
calcium_deficiency = (lab_calcium < 8.5).astype(int)

df = pd.DataFrame({
    "age": age, "gender": gender, "height_cm": height.round(1), "weight_kg": weight.round(1),
    "bmi": bmi.round(1), "activity_level": activity, "dietary_preference": diet_pref,
    "avg_kcal": kcal.round(0), "avg_protein_g": protein_g.round(1), "avg_fiber_g": fiber_g.round(1),
    "avg_iron_mg": iron_mg.round(1), "avg_b12_mcg": b12_mcg.round(2),
    "avg_calcium_mg": calcium_mg.round(0), "avg_vitamin_d_iu": vitd_iu.round(0),
    "symptom_fatigue": fatigue, "symptom_hair_loss": hair_loss, "symptom_skin": skin,
    "symptom_muscle_weakness": muscle_weakness, "symptom_mood": mood,
    # kept for evaluation / the "I already have labs" fast path — NOT used as model features
    "lab_hemoglobin": lab_hemoglobin.round(1), "lab_iron": lab_iron.round(0),
    "lab_vitamin_d": lab_vitamin_d.round(1), "lab_vitamin_b12": lab_vitamin_b12.round(0),
    "lab_calcium": lab_calcium.round(2),
    # targets
    "anemia_risk": anemia_risk, "iron_deficiency": iron_deficiency,
    "vitamin_d_deficiency": vitamin_d_deficiency, "b12_deficiency": b12_deficiency,
    "calcium_deficiency": calcium_deficiency,
})

# inject a small amount of realistic missingness in optional fields
for col in ["avg_fiber_g", "symptom_mood"]:
    mask = RNG.random(N) < 0.03
    df.loc[mask, col] = np.nan

ROOT = __import__("pathlib").Path(__file__).resolve().parent
df.to_csv(ROOT / "nutrisense_dataset.csv", index=False)
print("Saved", df.shape, "rows/cols")
print(df[["anemia_risk", "iron_deficiency", "vitamin_d_deficiency", "b12_deficiency", "calcium_deficiency"]].mean().round(3))
