"""NutriSense — Milestone 3: 7-day meal-plan generator."""
import random
from catalog import DEFICIENCY_NUTRIENTS, MEAL_SLOTS, filter_recipes


def _pool_by_slot(dietary_preference, allergies):
    pool = {slot: filter_recipes(dietary_preference, allergies, meal_slot=slot) for slot in MEAL_SLOTS}
    empty = [slot for slot, items in pool.items() if not items]
    if empty:
        raise ValueError(
            f"No recipes available for: {', '.join(empty)} given the current dietary preference "
            f"and allergy restrictions. Try relaxing an allergy filter or add more recipes to the catalog."
        )
    return pool


def _at_risk_nutrients(risk_results):
    needed = set()
    for r in risk_results:
        if r.get("risk_band") in ("Moderate", "High"):
            needed.update(DEFICIENCY_NUTRIENTS.get(r["label"], []))
    return needed


def _weight(recipe, nutrients_needed):
    boost = sum(recipe["nutrient_highlights"].get(n, 0) for n in nutrients_needed)
    return 1 + boost * 2


def generate_plan(dietary_preference, allergies, risk_results, days=7, seed=None):
    rng = random.Random(seed)
    pool = _pool_by_slot(dietary_preference, allergies)
    nutrients_needed = _at_risk_nutrients(risk_results)

    recent = {slot: [] for slot in MEAL_SLOTS}  # avoid repeating within the last 2 uses of a slot
    plan = []
    for day in range(1, days + 1):
        meals = {}
        for slot in MEAL_SLOTS:
            avoid = set(recent[slot][-2:])
            candidates = [r for r in pool[slot] if r["id"] not in avoid] or pool[slot]
            weights = [_weight(r, nutrients_needed) for r in candidates]
            choice = rng.choices(candidates, weights=weights, k=1)[0]
            meals[slot] = choice
            recent[slot].append(choice["id"])
        plan.append({"day": day, "meals": meals})
    return plan


def replace_meal(plan, day, slot, dietary_preference, allergies, risk_results, exclude_ids=None, seed=None):
    rng = random.Random(seed)
    pool = _pool_by_slot(dietary_preference, allergies)[slot]
    exclude_ids = set(exclude_ids or [])

    target_day = next((d for d in plan if d["day"] == day), None)
    if target_day is None:
        raise ValueError(f"Day {day} not found in plan.")
    exclude_ids.add(target_day["meals"][slot]["id"])

    candidates = [r for r in pool if r["id"] not in exclude_ids] or pool
    nutrients_needed = _at_risk_nutrients(risk_results)
    weights = [_weight(r, nutrients_needed) for r in candidates]
    choice = rng.choices(candidates, weights=weights, k=1)[0]
    target_day["meals"][slot] = choice
    return choice, plan
