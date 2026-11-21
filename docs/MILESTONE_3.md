# NutriSense — Milestone 3 Documentation

## 1. Objective
Milestone 3 turns the Milestone 2 deficiency-risk output into an actionable, safety-aware nutrition workflow:

**Profile + Diary + Symptoms → ML Risk Estimates → Nutrient Mapping → Safe Foods → Recipes → 7-Day Meal Plan → Dashboard + History**

## 2. Deficiency-to-food mapping
The recommendation service maintains an explicit mapping for:
- Iron / anemia risk → iron-rich foods such as lentils, chickpeas, spinach, tofu and animal sources where allowed.
- Vitamin B12 risk → B12-containing or fortified foods.
- Vitamin D risk → fortified foods, egg, fish and mushrooms where allowed.
- Calcium risk → dairy, tofu, ragi, sesame and fortified alternatives where allowed.

The engine first identifies risk areas at **Moderate or High** probability, then scores foods against those areas.

## 3. Safety and personalization rules
The safety pipeline is intentionally ordered:
1. Check dietary profile.
2. Remove foods containing declared allergens.
3. Remove explicit food exclusions.
4. Score remaining foods against detected risk areas.
5. Add a small preference bonus only after safety/risk relevance.
6. Return explainable matched-risk tags.

A preference can never override a dietary, allergy or exclusion rule.

## 4. Meal-selection rules
Every generated day has:
- Breakfast
- Lunch
- Snack
- Dinner

The generator avoids the same recipe within the previous three selections where alternatives exist. Every selected meal also contains safe replacement options.

## 5. Meal replacement
Replacement is server-validated:
- meal type compatibility
- dietary compatibility
- allergy compatibility
- exclusion compatibility

If any rule fails, the API returns a safe error and the original meal remains unchanged.

## 6. Recipe integration
The project exposes an internal recipe-data API:
- `POST /api/recipes`
- accepts risk context, profile restrictions and a search query
- returns risk-relevant, filtered recipe records

This keeps the project fully demonstrable without requiring a third-party API key. A production integration can replace the data source while keeping the same recommendation contract.

## 7. Persistence and history
SQLite stores:
- prediction snapshots by date
- nutrient-intake summaries
- generated meal plans

The History screen handles insufficient historical data and displays stored risk/intake snapshots when available.

## 8. Dashboard
The dashboard contains:
- calorie progress
- macro summary
- micronutrient summary
- risk-area cards
- meal-plan status
- dietary/allergy restriction summary
- navigation into risk intelligence and planning

The History view provides a dated risk/intake table and a compact highest-risk trend chart.

## 9. API contract
### Risk
`POST /predict`

### Recommendations
`POST /api/recommendations`

### Meal plan
`POST /api/meal-plan`

### Meal replacement
`POST /api/meal-plan/replace`

### Recipes
`POST /api/recipes`

### Prediction snapshots
`POST /api/snapshots`
`GET /api/snapshots/{user_key}`

### Stored meal plans
`GET /api/meal-plans/{user_key}`

## 10. Test matrix
The Milestone 3 demonstration should cover:
- Vegetarian profile
- Vegan profile
- Eggetarian profile
- Non-vegetarian profile
- Milk allergy
- Egg allergy
- Multiple allergies
- Explicit food exclusion
- Preferred food
- High iron-risk output
- High B12-risk output
- High vitamin-D-risk output
- High calcium-risk output
- Empty diary
- Backend unavailable / local fallback
- No historical snapshots
- Meal replacement that is allowed
- Meal replacement that violates a restriction

## 11. Safety wording
The UI consistently labels ML results as **risk estimates** and states that the model is not a diagnosis. The existing Milestone 2 model is trained on synthetic, clinically-grounded data, so the project should not present a probability as a medical diagnosis or clinical certainty.

## 12. Demonstration flow
1. Login.
2. Complete Health Profile.
3. Select dietary preference, allergies, exclusions and preferred foods.
4. Add foods to the Food Diary.
5. Complete Symptoms & Labs.
6. Open Risk & Foods.
7. Run the assessment.
8. Generate personalized recommendations.
9. Generate the 7-day plan.
10. Replace one meal.
11. Open Recipes and search by nutrient/risk.
12. Open History to show persisted snapshots.
13. Explain the architecture: React → FastAPI → ML → recommendation engine → meal planner → SQLite → dashboard.
