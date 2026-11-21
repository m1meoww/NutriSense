"""
NutriSense — Milestone 3
Recipe/food catalog + deficiency-to-nutrient mapping.

diet_type is the MOST RESTRICTIVE category a recipe belongs to. A user's
dietary_preference determines which diet_types they can eat via ALLOWED_DIETS
(vegan food is eatable by everyone; non_vegetarian food only by non-veg eaters).

nutrient_highlights are 0-3 scores (0 = not a notable source, 3 = excellent
source) used to rank recipes against a detected deficiency. Values are
directional approximations for a demo recommender, not a certified nutrient
database.
"""

DEFICIENCY_NUTRIENTS = {
    "anemia_risk": ["iron", "vitamin_b12", "folate"],
    "iron_deficiency": ["iron", "vitamin_c"],  # vitamin C boosts iron absorption
    "vitamin_d_deficiency": ["vitamin_d"],
    "b12_deficiency": ["vitamin_b12"],
    "calcium_deficiency": ["calcium", "vitamin_d"],
}

ALLOWED_DIETS = {
    "Vegan": {"vegan"},
    "Vegetarian": {"vegan", "vegetarian"},
    "Eggetarian": {"vegan", "vegetarian", "eggetarian"},
    "Non-Vegetarian": {"vegan", "vegetarian", "eggetarian", "non_vegetarian"},
}

ALLERGENS = ["dairy", "gluten", "nuts", "egg", "soy", "fish"]
MEAL_SLOTS = ["breakfast", "lunch", "snack", "dinner"]

RECIPES = [
    {"id": "poha_peanut", "name": "Poha with peanuts", "emoji": "🍛", "diet_type": "vegan",
     "allergens": ["nuts"], "meal_slots": ["breakfast"], "kcal": 220, "protein": 5, "carbs": 34, "fat": 7,
     "nutrient_highlights": {"iron": 2, "folate": 1},
     "ingredients": ["Flattened rice", "Peanuts", "Onion", "Curry leaves", "Turmeric"],
     "instructions": "Rinse poha, sauté onion and peanuts in oil with mustard seeds and turmeric, fold in poha, steam 3 min."},
    {"id": "moong_khichdi", "name": "Moong dal khichdi", "emoji": "🥣", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["lunch", "dinner"], "kcal": 320, "protein": 12, "carbs": 52, "fat": 6,
     "nutrient_highlights": {"iron": 2, "folate": 2},
     "ingredients": ["Rice", "Moong dal", "Turmeric", "Ghee (omit for vegan)", "Cumin"],
     "instructions": "Pressure-cook rice and moong dal 1:1 with turmeric and cumin-tempered oil until soft."},
    {"id": "palak_paneer", "name": "Palak paneer", "emoji": "🥘", "diet_type": "vegetarian",
     "allergens": ["dairy"], "meal_slots": ["lunch", "dinner"], "kcal": 340, "protein": 16, "carbs": 12, "fat": 22,
     "nutrient_highlights": {"iron": 2, "calcium": 3, "folate": 1},
     "ingredients": ["Spinach", "Paneer", "Onion", "Tomato", "Garam masala"],
     "instructions": "Blanch and purée spinach, simmer with onion-tomato masala, fold in paneer cubes."},
    {"id": "rajma_chawal", "name": "Rajma chawal", "emoji": "🍚", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["lunch", "dinner"], "kcal": 380, "protein": 14, "carbs": 62, "fat": 6,
     "nutrient_highlights": {"iron": 3, "folate": 2},
     "ingredients": ["Kidney beans", "Rice", "Onion", "Tomato", "Cumin"],
     "instructions": "Simmer soaked kidney beans in onion-tomato gravy; serve over steamed rice."},
    {"id": "egg_bhurji_toast", "name": "Egg bhurji with toast", "emoji": "🍳", "diet_type": "eggetarian",
     "allergens": ["egg", "gluten"], "meal_slots": ["breakfast"], "kcal": 300, "protein": 16, "carbs": 22, "fat": 16,
     "nutrient_highlights": {"vitamin_b12": 2, "vitamin_d": 1},
     "ingredients": ["Eggs", "Onion", "Tomato", "Whole-wheat bread"],
     "instructions": "Scramble eggs with sautéed onion-tomato-chili; serve with toasted bread."},
    {"id": "chicken_curry_rice", "name": "Chicken curry with rice", "emoji": "🍗", "diet_type": "non_vegetarian",
     "allergens": [], "meal_slots": ["lunch", "dinner"], "kcal": 420, "protein": 28, "carbs": 46, "fat": 14,
     "nutrient_highlights": {"vitamin_b12": 3, "iron": 2},
     "ingredients": ["Chicken", "Onion", "Tomato", "Rice", "Spices"],
     "instructions": "Simmer chicken in onion-tomato-spice gravy until tender; serve with steamed rice."},
    {"id": "fish_curry_rice", "name": "Fish curry with rice", "emoji": "🐟", "diet_type": "non_vegetarian",
     "allergens": ["fish"], "meal_slots": ["lunch", "dinner"], "kcal": 380, "protein": 26, "carbs": 42, "fat": 12,
     "nutrient_highlights": {"vitamin_d": 3, "vitamin_b12": 2},
     "ingredients": ["Fish (e.g. rohu)", "Coconut", "Tamarind", "Mustard seeds", "Rice"],
     "instructions": "Simmer fish in tangy coconut-mustard gravy; serve with rice."},
    {"id": "curd_rice", "name": "Curd rice", "emoji": "🍚", "diet_type": "vegetarian",
     "allergens": ["dairy"], "meal_slots": ["lunch", "snack"], "kcal": 260, "protein": 8, "carbs": 40, "fat": 8,
     "nutrient_highlights": {"calcium": 2},
     "ingredients": ["Rice", "Curd", "Curry leaves", "Mustard seeds", "Pomegranate (optional)"],
     "instructions": "Mash cooked rice with curd and milk, temper with mustard seeds and curry leaves."},
    {"id": "ragi_dosa", "name": "Ragi (finger millet) dosa", "emoji": "🫓", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["breakfast"], "kcal": 210, "protein": 6, "carbs": 34, "fat": 5,
     "nutrient_highlights": {"calcium": 3, "iron": 1},
     "ingredients": ["Ragi flour", "Rice flour", "Buttermilk (omit for vegan)", "Cumin"],
     "instructions": "Mix ragi and rice flour into a thin batter, rest 15 min, cook thin dosas on a hot griddle."},
    {"id": "sprouts_salad", "name": "Sprouts salad", "emoji": "🥗", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["snack"], "kcal": 140, "protein": 8, "carbs": 20, "fat": 2,
     "nutrient_highlights": {"vitamin_c": 2, "folate": 2},
     "ingredients": ["Mixed sprouts", "Onion", "Tomato", "Lemon", "Coriander"],
     "instructions": "Toss steamed sprouts with chopped onion, tomato, lemon juice, and chaat masala."},
    {"id": "paneer_bhurji", "name": "Paneer bhurji", "emoji": "🧀", "diet_type": "vegetarian",
     "allergens": ["dairy"], "meal_slots": ["breakfast", "dinner"], "kcal": 280, "protein": 16, "carbs": 8, "fat": 20,
     "nutrient_highlights": {"calcium": 3},
     "ingredients": ["Paneer", "Onion", "Capsicum", "Tomato", "Turmeric"],
     "instructions": "Crumble paneer and sauté with onion, capsicum, tomato, and mild spices."},
    {"id": "oats_milk_banana", "name": "Oats with milk and banana", "emoji": "🥣", "diet_type": "vegetarian",
     "allergens": ["dairy", "gluten"], "meal_slots": ["breakfast"], "kcal": 260, "protein": 9, "carbs": 44, "fat": 6,
     "nutrient_highlights": {"calcium": 2, "folate": 1},
     "ingredients": ["Rolled oats", "Milk", "Banana", "Honey (optional)"],
     "instructions": "Cook oats in milk, top with sliced banana and a drizzle of honey."},
    {"id": "sattu_paratha", "name": "Sattu-stuffed paratha", "emoji": "🫓", "diet_type": "vegetarian",
     "allergens": ["gluten"], "meal_slots": ["breakfast", "lunch"], "kcal": 320, "protein": 11, "carbs": 46, "fat": 10,
     "nutrient_highlights": {"iron": 2, "folate": 1},
     "ingredients": ["Roasted gram flour (sattu)", "Whole-wheat flour", "Onion", "Spices"],
     "instructions": "Stuff spiced sattu filling into wheat dough, roll flat, and cook on a griddle with a little oil."},
    {"id": "chana_masala", "name": "Chana masala", "emoji": "🥘", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["lunch", "dinner"], "kcal": 300, "protein": 13, "carbs": 44, "fat": 8,
     "nutrient_highlights": {"iron": 2, "folate": 2},
     "ingredients": ["Chickpeas", "Onion", "Tomato", "Ginger-garlic", "Spices"],
     "instructions": "Simmer boiled chickpeas in a spiced onion-tomato gravy until thick."},
    {"id": "almond_smoothie", "name": "Almond milk smoothie", "emoji": "🥤", "diet_type": "vegan",
     "allergens": ["nuts"], "meal_slots": ["snack"], "kcal": 180, "protein": 5, "carbs": 22, "fat": 8,
     "nutrient_highlights": {"calcium": 2},
     "ingredients": ["Almond milk", "Banana", "Dates", "Almonds"],
     "instructions": "Blend almond milk, banana, soaked dates, and a few almonds until smooth."},
    {"id": "egg_orange_snack", "name": "Boiled egg with orange", "emoji": "🥚", "diet_type": "eggetarian",
     "allergens": ["egg"], "meal_slots": ["snack"], "kcal": 150, "protein": 8, "carbs": 14, "fat": 6,
     "nutrient_highlights": {"vitamin_b12": 1, "vitamin_c": 3},
     "ingredients": ["Egg", "Orange"],
     "instructions": "Boil an egg 8-10 min; pair with a fresh orange."},
    {"id": "grilled_fish_veg", "name": "Grilled fish with vegetables", "emoji": "🐠", "diet_type": "non_vegetarian",
     "allergens": ["fish"], "meal_slots": ["dinner"], "kcal": 340, "protein": 30, "carbs": 14, "fat": 16,
     "nutrient_highlights": {"vitamin_d": 3, "vitamin_b12": 2},
     "ingredients": ["Fish fillet", "Broccoli", "Bell pepper", "Olive oil", "Lemon"],
     "instructions": "Marinate fish in lemon and spices, grill; serve with pan-roasted vegetables."},
    {"id": "dahi_fruit", "name": "Dahi (curd) with fruit", "emoji": "🍇", "diet_type": "vegetarian",
     "allergens": ["dairy"], "meal_slots": ["snack"], "kcal": 160, "protein": 6, "carbs": 20, "fat": 5,
     "nutrient_highlights": {"calcium": 2},
     "ingredients": ["Curd", "Seasonal fruit", "Honey (optional)"],
     "instructions": "Top chilled curd with chopped seasonal fruit."},
    {"id": "trail_mix", "name": "Nuts & seeds trail mix", "emoji": "🌰", "diet_type": "vegan",
     "allergens": ["nuts"], "meal_slots": ["snack"], "kcal": 190, "protein": 6, "carbs": 12, "fat": 14,
     "nutrient_highlights": {"iron": 1, "calcium": 1},
     "ingredients": ["Almonds", "Walnuts", "Pumpkin seeds", "Raisins"],
     "instructions": "Mix roasted nuts, seeds, and raisins into a small snack portion."},
    {"id": "spinach_dal", "name": "Spinach dal", "emoji": "🥬", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["lunch", "dinner"], "kcal": 260, "protein": 12, "carbs": 32, "fat": 6,
     "nutrient_highlights": {"iron": 3, "folate": 2},
     "ingredients": ["Toor/moong dal", "Spinach", "Garlic", "Cumin", "Tomato"],
     "instructions": "Cook dal until soft, stir in chopped spinach, simmer 5 min with tempering."},
    {"id": "idli_sambar", "name": "Idli with sambar", "emoji": "⚪", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["breakfast"], "kcal": 240, "protein": 9, "carbs": 40, "fat": 4,
     "nutrient_highlights": {"iron": 1, "folate": 1},
     "ingredients": ["Idli batter", "Toor dal", "Mixed vegetables", "Tamarind", "Sambar spice"],
     "instructions": "Steam idlis; serve with vegetable sambar."},
    {"id": "paneer_tikka", "name": "Paneer tikka", "emoji": "🍢", "diet_type": "vegetarian",
     "allergens": ["dairy"], "meal_slots": ["snack", "dinner"], "kcal": 280, "protein": 15, "carbs": 10, "fat": 18,
     "nutrient_highlights": {"calcium": 3},
     "ingredients": ["Paneer", "Capsicum", "Onion", "Yogurt marinade", "Spices"],
     "instructions": "Marinate paneer and vegetables in spiced yogurt, skewer, and grill or pan-roast."},
    {"id": "amla_juice", "name": "Amla (gooseberry) juice", "emoji": "🧃", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["snack"], "kcal": 60, "protein": 1, "carbs": 14, "fat": 0,
     "nutrient_highlights": {"vitamin_c": 3},
     "ingredients": ["Amla", "Water", "Honey (optional)"],
     "instructions": "Blend amla with water, strain, sweeten lightly if desired."},
    {"id": "mutton_curry", "name": "Mutton curry", "emoji": "🍖", "diet_type": "non_vegetarian",
     "allergens": [], "meal_slots": ["dinner"], "kcal": 440, "protein": 30, "carbs": 16, "fat": 26,
     "nutrient_highlights": {"iron": 3, "vitamin_b12": 3},
     "ingredients": ["Mutton", "Onion", "Yogurt", "Whole spices"],
     "instructions": "Slow-cook mutton in a spiced onion-yogurt gravy until tender."},
    {"id": "soy_chunk_curry", "name": "Soy chunk curry", "emoji": "🥘", "diet_type": "vegan",
     "allergens": ["soy"], "meal_slots": ["lunch", "dinner"], "kcal": 290, "protein": 20, "carbs": 24, "fat": 10,
     "nutrient_highlights": {"iron": 2},
     "ingredients": ["Soy chunks", "Onion", "Tomato", "Spices"],
     "instructions": "Rehydrate soy chunks, simmer in onion-tomato gravy until well absorbed."},
    {"id": "haldi_doodh", "name": "Turmeric milk (haldi doodh)", "emoji": "🥛", "diet_type": "vegetarian",
     "allergens": ["dairy"], "meal_slots": ["snack", "dinner"], "kcal": 120, "protein": 6, "carbs": 12, "fat": 5,
     "nutrient_highlights": {"calcium": 2, "vitamin_d": 1},
     "ingredients": ["Milk", "Turmeric", "Black pepper"],
     "instructions": "Warm milk with a pinch of turmeric and black pepper."},
    {"id": "ragi_porridge", "name": "Ragi porridge", "emoji": "🥣", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["breakfast"], "kcal": 200, "protein": 6, "carbs": 34, "fat": 4,
     "nutrient_highlights": {"calcium": 2, "iron": 1},
     "ingredients": ["Ragi flour", "Water", "Jaggery (optional)"],
     "instructions": "Cook ragi flour in water into a smooth porridge, sweeten lightly if desired."},
    {"id": "veg_sandwich", "name": "Whole-wheat vegetable sandwich", "emoji": "🥪", "diet_type": "vegetarian",
     "allergens": ["gluten"], "meal_slots": ["lunch", "snack"], "kcal": 240, "protein": 8, "carbs": 36, "fat": 7,
     "nutrient_highlights": {"folate": 1, "vitamin_c": 1},
     "ingredients": ["Whole-wheat bread", "Cucumber", "Tomato", "Lettuce", "Chutney"],
     "instructions": "Layer fresh vegetables and chutney between toasted whole-wheat bread slices."},
    {"id": "pb_banana_toast", "name": "Peanut butter banana toast", "emoji": "🍌", "diet_type": "vegetarian",
     "allergens": ["nuts", "gluten"], "meal_slots": ["breakfast", "snack"], "kcal": 260, "protein": 8, "carbs": 30, "fat": 12,
     "nutrient_highlights": {"iron": 1},
     "ingredients": ["Whole-wheat bread", "Peanut butter", "Banana"],
     "instructions": "Spread peanut butter on toasted bread, top with banana slices."},
    {"id": "kidney_bean_salad", "name": "Kidney bean salad", "emoji": "🥗", "diet_type": "vegan",
     "allergens": [], "meal_slots": ["lunch", "snack"], "kcal": 220, "protein": 11, "carbs": 30, "fat": 5,
     "nutrient_highlights": {"iron": 2, "folate": 2},
     "ingredients": ["Kidney beans", "Onion", "Tomato", "Lemon", "Coriander"],
     "instructions": "Toss boiled kidney beans with chopped vegetables, lemon juice, and coriander."},
    {"id": "fortified_soy_milk_cereal", "name": "Fortified soy milk with cereal", "emoji": "🥛", "diet_type": "vegan",
     "allergens": ["soy", "gluten"], "meal_slots": ["breakfast"], "kcal": 240, "protein": 10, "carbs": 38, "fat": 5,
     "nutrient_highlights": {"vitamin_b12": 3, "calcium": 2, "vitamin_d": 1},
     "ingredients": ["B12-fortified soy milk", "Whole-grain cereal"],
     "instructions": "Pour chilled fortified soy milk over whole-grain cereal — a practical B12 source on a vegan diet, which has very few natural B12 foods."},
    {"id": "nutritional_yeast_toast", "name": "Nutritional yeast on avocado toast", "emoji": "🥑", "diet_type": "vegan",
     "allergens": ["gluten"], "meal_slots": ["breakfast", "snack"], "kcal": 230, "protein": 8, "carbs": 26, "fat": 12,
     "nutrient_highlights": {"vitamin_b12": 3, "folate": 1},
     "ingredients": ["Whole-wheat bread", "Avocado", "Fortified nutritional yeast", "Lemon"],
     "instructions": "Mash avocado on toast, sprinkle generously with B12-fortified nutritional yeast."},
]


def diet_allowed(recipe, dietary_preference):
    return recipe["diet_type"] in ALLOWED_DIETS.get(dietary_preference, ALLOWED_DIETS["Non-Vegetarian"])


def allergy_safe(recipe, user_allergens):
    return not (set(a.lower() for a in user_allergens) & set(recipe["allergens"]))


def filter_recipes(dietary_preference, allergies, meal_slot=None, search=None):
    out = []
    for r in RECIPES:
        if not diet_allowed(r, dietary_preference):
            continue
        if not allergy_safe(r, allergies or []):
            continue
        if meal_slot and meal_slot not in r["meal_slots"]:
            continue
        if search and search.lower() not in r["name"].lower():
            continue
        out.append(r)
    return out
