"""NutriSense — Milestone 3: recommendation engine."""
from catalog import DEFICIENCY_NUTRIENTS, filter_recipes


def recommend_for_profile(risk_results, dietary_preference, allergies):
    """risk_results: list of {label, risk_probability, risk_band}."""
    candidates_pool = filter_recipes(dietary_preference, allergies)
    at_risk = [r for r in risk_results if r.get("risk_band") in ("Moderate", "High")]
    at_risk.sort(key=lambda r: r["risk_probability"], reverse=True)

    recommendations = []
    for risk in at_risk:
        nutrients_needed = DEFICIENCY_NUTRIENTS.get(risk["label"], [])
        scored = []
        for recipe in candidates_pool:
            score = sum(recipe["nutrient_highlights"].get(n, 0) for n in nutrients_needed)
            if score > 0:
                scored.append((score, recipe))
        scored.sort(key=lambda x: -x[0])
        note = None
        if not scored:
            note = (
                f"No recipes in the current catalog target {', '.join(nutrients_needed)} "
                f"within this dietary/allergy profile — consider a fortified food or a supplement, "
                f"and discuss with a doctor or dietitian."
            )
        recommendations.append({
            "deficiency": risk["label"],
            "risk_band": risk["risk_band"],
            "risk_probability": risk["risk_probability"],
            "target_nutrients": nutrients_needed,
            "recommended_recipes": [c[1] for c in scored[:4]],
            "alternative_options": [c[1] for c in scored[4:8]],
            "note": note,
        })

    if not recommendations:
        recommendations.append({
            "deficiency": None, "risk_band": "Low", "risk_probability": 0.0,
            "target_nutrients": [], "recommended_recipes": candidates_pool[:6],
            "alternative_options": [], "note": None,
        })
    return recommendations
