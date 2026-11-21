import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Home, BookOpen, Heart, Activity, Sparkles, LogOut, Plus, X,
  ChevronRight, Flame, Droplets, Check, ArrowLeft, Minus,
  Utensils, CalendarDays, ClipboardList, RefreshCw, AlertCircle,
  Info, ShieldCheck, TrendingUp, Apple, Scale, Sliders, Download,
  ShoppingCart, Copy, CheckCircle2, AlertTriangle, Search,
  Zap, HeartPulse, Sparkle, Share2, Layers, Award, Coffee, Moon, Sun, Sunrise
} from "lucide-react";

/* =========================================================================
   NutriSense — AI-Powered Nutrition Intelligence Platform
   Precision Health Profile, Biometrics & Food Diary
   Multi-Label Deficiency Risk Engine (FastAPI + SHAP Explainability)
   Deficiency-to-Food Recommendations, 7-Day Meal Planner,
   Smart Grocery List, SQLite/LocalStorage History & Trends
   ========================================================================= */

const TOKENS = {
  // Brand Emerald & Sage
  forest: "#064E3B",
  forestLight: "#047857",
  emerald: "#10B981",
  sage: "#059669",
  sageLight: "#D1FAE5",
  sageUltraLight: "#ECFDF5",
  
  // Warm Neutral Canvas
  cream: "#FBF9F5",
  creamDeep: "#F5EFE6",
  creamBorder: "#E8E2D5",
  cardBg: "#FFFFFF",
  
  // Accents
  coral: "#EA580C",
  coralLight: "#FFEDD5",
  gold: "#D97706",
  goldLight: "#FEF3C7",
  blue: "#2563EB",
  blueLight: "#DBEAFE",
  
  // Typography
  ink: "#1C1917",
  inkSoft: "#57534E",
  inkMuted: "#78716C",
};

/* ---------------- Reference Databases ---------------- */

const FOOD_DB = [
  { id: "roti", name: "Whole Wheat Roti / Chapati", emoji: "🫓", kcal: 120, p: 3.5, c: 18, f: 3, fiber: 2.8, iron: 1.2, b12: 0, ca: 10, vitd: 0, tag: "ICMR-NIN IFCT", category: "Grains" },
  { id: "dal", name: "Moong / Toor Dal, cooked", emoji: "🥣", kcal: 116, p: 7.0, c: 20, f: 0.4, fiber: 4.2, iron: 2.5, b12: 0, ca: 28, vitd: 0, tag: "ICMR-NIN IFCT", category: "Dals" },
  { id: "rice", name: "Steamed Brown Rice", emoji: "🍚", kcal: 130, p: 2.7, c: 28, f: 0.3, fiber: 1.8, iron: 0.4, b12: 0, ca: 6, vitd: 0, tag: "ICMR-NIN IFCT", category: "Grains" },
  { id: "poha", name: "Kanda Poha with Peanuts", emoji: "🍛", kcal: 180, p: 4.2, c: 32, f: 4.5, fiber: 2.5, iron: 1.8, b12: 0, ca: 15, vitd: 0, tag: "ICMR-NIN IFCT", category: "Breakfast" },
  { id: "paneer", name: "Fresh Paneer (100g)", emoji: "🧀", kcal: 265, p: 18.3, c: 4.5, f: 20.8, fiber: 0, iron: 0.3, b12: 0.4, ca: 480, vitd: 4, tag: "ICMR-NIN IFCT", category: "Dairy" },
  { id: "milk", name: "Cow Milk, fortified (200ml)", emoji: "🥛", kcal: 122, p: 6.4, c: 9.6, f: 6.6, fiber: 0, iron: 0.2, b12: 0.8, ca: 226, vitd: 50, tag: "ICMR-NIN IFCT", category: "Dairy" },
  { id: "egg", name: "Boiled Farm Egg (2 pcs)", emoji: "🥚", kcal: 156, p: 12.6, c: 1.2, f: 10.6, fiber: 0, iron: 1.8, b12: 1.2, ca: 50, vitd: 82, tag: "USDA", category: "Protein" },
  { id: "banana", name: "Fresh Banana", emoji: "🍌", kcal: 105, p: 1.3, c: 27, f: 0.4, fiber: 3.1, iron: 0.3, b12: 0, ca: 6, vitd: 0, tag: "USDA", category: "Fruits" },
  { id: "idli", name: "Steamed Idli (2 pcs)", emoji: "⚪", kcal: 120, p: 3.8, c: 25, f: 0.6, fiber: 1.8, iron: 0.9, b12: 0, ca: 24, vitd: 0, tag: "ICMR-NIN IFCT", category: "Breakfast" },
  { id: "dosa", name: "Crispy Plain Dosa", emoji: "🌯", kcal: 168, p: 3.9, c: 29, f: 4.0, fiber: 2.1, iron: 1.1, b12: 0, ca: 18, vitd: 0, tag: "ICMR-NIN IFCT", category: "Breakfast" },
  { id: "sabzi", name: "Mixed Vegetable Sabzi", emoji: "🥘", kcal: 140, p: 3.5, c: 14, f: 8.0, fiber: 4.5, iron: 1.4, b12: 0, ca: 40, vitd: 0, tag: "ICMR-NIN IFCT", category: "Veggies" },
  { id: "chicken", name: "Homestyle Chicken Curry", emoji: "🍗", kcal: 220, p: 24.0, c: 5.0, f: 11.5, fiber: 1.2, iron: 1.5, b12: 0.6, ca: 24, vitd: 6, tag: "USDA", category: "Protein" },
  { id: "salad", name: "Cucumber-Tomato Crunch Salad", emoji: "🥗", kcal: 45, p: 1.5, c: 9.0, f: 0.3, fiber: 2.4, iron: 0.5, b12: 0, ca: 20, vitd: 0, tag: "USDA", category: "Veggies" },
  { id: "almonds", name: "Soaked California Almonds (15 pcs)", emoji: "🌰", kcal: 105, p: 3.9, c: 3.8, f: 9.0, fiber: 2.2, iron: 0.9, b12: 0, ca: 45, vitd: 0, tag: "USDA", category: "Snacks" },
  { id: "curd", name: "Greek Yogurt / Thick Curd", emoji: "🥣", kcal: 90, p: 7.0, c: 5.5, f: 4.2, fiber: 0, iron: 0.2, b12: 0.5, ca: 160, vitd: 4, tag: "ICMR-NIN IFCT", category: "Dairy" },
  { id: "oats", name: "Rolled Oats with Chia Seeds", emoji: "🥣", kcal: 180, p: 6.2, c: 32, f: 4.0, fiber: 5.2, iron: 2.1, b12: 0, ca: 60, vitd: 0, tag: "USDA", category: "Breakfast" },
  { id: "apple", name: "Crisp Green Apple", emoji: "🍎", kcal: 95, p: 0.5, c: 25, f: 0.3, fiber: 4.4, iron: 0.2, b12: 0, ca: 11, vitd: 0, tag: "USDA", category: "Fruits" },
  { id: "spinach_soup", name: "Palak (Spinach) Soup", emoji: "🥬", kcal: 65, p: 3.0, c: 8.0, f: 2.0, fiber: 3.0, iron: 3.2, b12: 0, ca: 95, vitd: 0, tag: "ICMR-NIN IFCT", category: "Veggies" },
  { id: "sprouts", name: "Sprouted Moong Chaat", emoji: "🌱", kcal: 130, p: 8.5, c: 22, f: 1.2, fiber: 6.0, iron: 2.8, b12: 0, ca: 45, vitd: 0, tag: "ICMR-NIN IFCT", category: "Snacks" },
  { id: "fish_grill", name: "Grilled Salmon / Rohu Fish", emoji: "🐟", kcal: 210, p: 25.0, c: 0.0, f: 12.0, fiber: 0, iron: 0.8, b12: 3.2, ca: 15, vitd: 480, tag: "USDA", category: "Protein" },
  { id: "soy_chunks", name: "Soy Chunks Masala", emoji: "🧆", kcal: 195, p: 21.0, c: 15, f: 4.5, fiber: 7.0, iron: 4.8, b12: 0, ca: 120, vitd: 0, tag: "ICMR-NIN IFCT", category: "Protein" },
  { id: "chai", name: "Masala Chai with Low Milk", emoji: "☕", kcal: 50, p: 1.2, c: 7.0, f: 1.8, fiber: 0, iron: 0.1, b12: 0.1, ca: 28, vitd: 4, tag: "ICMR-NIN IFCT", category: "Snacks" },
];

const RECIPES_CATALOG = [
  { id: "poha_peanut", name: "Poha with crunchy peanuts", emoji: "🍛", diet_type: "vegan", allergens: ["nuts"], meal_slots: ["breakfast"], kcal: 220, protein: 5, carbs: 34, fat: 7, nutrient_highlights: { iron: 2, folate: 1 }, ingredients: ["Flattened rice", "Peanuts", "Onion", "Curry leaves", "Turmeric"], instructions: "Rinse poha, sauté onion and peanuts in oil with mustard seeds and turmeric, fold in poha, steam 3 min." },
  { id: "moong_khichdi", name: "Moong dal khichdi", emoji: "🥣", diet_type: "vegan", allergens: [], meal_slots: ["lunch", "dinner"], kcal: 320, protein: 12, carbs: 52, fat: 6, nutrient_highlights: { iron: 2, folate: 2 }, ingredients: ["Rice", "Moong dal", "Turmeric", "Cumin", "Ginger"], instructions: "Pressure-cook rice and moong dal 1:1 with turmeric and cumin-tempered oil until soft." },
  { id: "palak_paneer", name: "Palak paneer with cumin", emoji: "🥘", diet_type: "vegetarian", allergens: ["dairy"], meal_slots: ["lunch", "dinner"], kcal: 340, protein: 16, carbs: 12, fat: 22, nutrient_highlights: { iron: 2, calcium: 3, folate: 1 }, ingredients: ["Spinach", "Paneer", "Onion", "Tomato", "Garam masala"], instructions: "Blanch and purée spinach, simmer with onion-tomato masala, fold in paneer cubes." },
  { id: "rajma_chawal", name: "Slow-simmered Rajma chawal", emoji: "🍚", diet_type: "vegan", allergens: [], meal_slots: ["lunch", "dinner"], kcal: 380, protein: 14, carbs: 62, fat: 6, nutrient_highlights: { iron: 3, folate: 2 }, ingredients: ["Kidney beans", "Basmati rice", "Onion", "Tomato", "Cumin"], instructions: "Simmer soaked kidney beans in rich onion-tomato gravy; serve hot over steamed rice." },
  { id: "egg_bhurji_toast", name: "Egg bhurji with multigrain toast", emoji: "🍳", diet_type: "eggetarian", allergens: ["egg", "gluten"], meal_slots: ["breakfast"], kcal: 300, protein: 16, carbs: 22, fat: 16, nutrient_highlights: { vitamin_b12: 2, vitamin_d: 1 }, ingredients: ["Eggs", "Onion", "Tomato", "Whole-wheat bread", "Green chili"], instructions: "Scramble farm eggs with sautéed onion-tomato-chili; serve with crispy toasted bread." },
  { id: "chicken_curry_rice", name: "Chicken curry with steamed rice", emoji: "🍗", diet_type: "non_vegetarian", allergens: [], meal_slots: ["lunch", "dinner"], kcal: 420, protein: 28, carbs: 46, fat: 14, nutrient_highlights: { vitamin_b12: 3, iron: 2 }, ingredients: ["Chicken breast", "Onion", "Tomato", "Rice", "Aromatic spices"], instructions: "Simmer chicken in ginger-garlic-tomato spice gravy until tender; serve with rice." },
  { id: "fish_curry_rice", name: "Coastal fish curry with rice", emoji: "🐟", diet_type: "non_vegetarian", allergens: ["fish"], meal_slots: ["lunch", "dinner"], kcal: 380, protein: 26, carbs: 42, fat: 12, nutrient_highlights: { vitamin_d: 3, vitamin_b12: 2 }, ingredients: ["Fish fillet", "Coconut milk", "Tamarind", "Mustard seeds", "Rice"], instructions: "Simmer fresh fish in tangy coconut-tamarind gravy; serve over steamed rice." },
  { id: "curd_rice", name: "Tempered South Indian curd rice", emoji: "🍚", diet_type: "vegetarian", allergens: ["dairy"], meal_slots: ["lunch", "snack"], kcal: 260, protein: 8, carbs: 40, fat: 8, nutrient_highlights: { calcium: 2 }, ingredients: ["Rice", "Curd", "Curry leaves", "Mustard seeds", "Pomegranate"], instructions: "Mash cooked rice with chilled curd and milk, temper with mustard seeds and curry leaves." },
  { id: "ragi_dosa", name: "Crisp Ragi (finger millet) dosa", emoji: "🫓", diet_type: "vegan", allergens: [], meal_slots: ["breakfast"], kcal: 210, protein: 6, carbs: 34, fat: 5, nutrient_highlights: { calcium: 3, iron: 1 }, ingredients: ["Ragi flour", "Rice flour", "Cumin", "Water", "Coriander"], instructions: "Mix ragi and rice flour into a thin batter, rest 15 min, cook golden dosas on a hot griddle." },
  { id: "sprouts_salad", name: "Zesty sprouted moong salad", emoji: "🥗", diet_type: "vegan", allergens: [], meal_slots: ["snack"], kcal: 140, protein: 8, carbs: 20, fat: 2, nutrient_highlights: { vitamin_c: 2, folate: 2 }, ingredients: ["Mixed sprouts", "Cucumber", "Tomato", "Lemon", "Chaat masala"], instructions: "Toss steamed sprouts with fresh cucumber, tomato, fresh lemon juice, and chaat masala." },
  { id: "paneer_bhurji", name: "Paneer bhurji with bell peppers", emoji: "🧀", diet_type: "vegetarian", allergens: ["dairy"], meal_slots: ["breakfast", "dinner"], kcal: 280, protein: 16, carbs: 8, fat: 20, nutrient_highlights: { calcium: 3 }, ingredients: ["Paneer", "Onion", "Capsicum", "Tomato", "Turmeric"], instructions: "Crumble fresh paneer and sauté with capsicum, onion, tomato, and mild fragrant spices." },
  { id: "oats_milk_banana", name: "Warm oats with milk & banana", emoji: "🥣", diet_type: "vegetarian", allergens: ["dairy", "gluten"], meal_slots: ["breakfast"], kcal: 260, protein: 9, carbs: 44, fat: 6, nutrient_highlights: { calcium: 2, folate: 1 }, ingredients: ["Rolled oats", "Milk", "Banana", "Chia seeds", "Honey"], instructions: "Simmer rolled oats in warm milk, top with sliced banana and a sprinkle of chia seeds." },
  { id: "sattu_paratha", name: "High-protein Sattu paratha", emoji: "🫓", diet_type: "vegetarian", allergens: ["gluten"], meal_slots: ["breakfast", "lunch"], kcal: 320, protein: 11, carbs: 46, fat: 10, nutrient_highlights: { iron: 2, folate: 1 }, ingredients: ["Roasted gram flour (sattu)", "Whole-wheat flour", "Ajwain", "Onion", "Pickle oil"], instructions: "Stuff spiced sattu filling into whole-wheat dough, roll flat, and pan-toast with minimal oil." },
  { id: "chana_masala", name: "Amritsari Chana masala", emoji: "🥘", diet_type: "vegan", allergens: [], meal_slots: ["lunch", "dinner"], kcal: 300, protein: 13, carbs: 44, fat: 8, nutrient_highlights: { iron: 2, folate: 2 }, ingredients: ["Chickpeas", "Onion", "Tomato", "Ginger-garlic", "Anardana spice"], instructions: "Simmer boiled chickpeas in a robust onion-tomato masala until velvety and thick." },
  { id: "almond_smoothie", name: "Nutrient Almond milk smoothie", emoji: "🥤", diet_type: "vegan", allergens: ["nuts"], meal_slots: ["snack"], kcal: 180, protein: 5, carbs: 22, fat: 8, nutrient_highlights: { calcium: 2 }, ingredients: ["Almond milk", "Banana", "Medjool dates", "Almonds"], instructions: "Blend fortified almond milk, chilled banana, soaked dates, and crushed almonds until frothy." },
  { id: "egg_orange_snack", name: "Boiled egg with fresh orange", emoji: "🥚", diet_type: "eggetarian", allergens: ["egg"], meal_slots: ["snack"], kcal: 150, protein: 8, carbs: 14, fat: 6, nutrient_highlights: { vitamin_b12: 1, vitamin_c: 3 }, ingredients: ["Farm egg", "Sweet orange"], instructions: "Boil an egg 8-9 min for a jammy yolk; pair with fresh vitamin C-rich orange slices." },
  { id: "grilled_fish_veg", name: "Herb-grilled fish & steamed greens", emoji: "🐠", diet_type: "non_vegetarian", allergens: ["fish"], meal_slots: ["dinner"], kcal: 340, protein: 30, carbs: 14, fat: 16, nutrient_highlights: { vitamin_d: 3, vitamin_b12: 2 }, ingredients: ["Fish fillet", "Broccoli", "Bell pepper", "Olive oil", "Lemon"], instructions: "Marinate fish fillet with lemon, garlic, and herbs; grill and serve with steamed broccoli." },
  { id: "dahi_fruit", name: "Probiotic Dahi bowl with fruit", emoji: "🍇", diet_type: "vegetarian", allergens: ["dairy"], meal_slots: ["snack"], kcal: 160, protein: 6, carbs: 20, fat: 5, nutrient_highlights: { calcium: 2 }, ingredients: ["Curd", "Seasonal berries", "Pomegranate", "Pistachios"], instructions: "Layer chilled set curd with freshly chopped seasonal berries and pomegranate arils." },
  { id: "trail_mix", name: "Raw Nuts & seeds trail mix", emoji: "🌰", diet_type: "vegan", allergens: ["nuts"], meal_slots: ["snack"], kcal: 190, protein: 6, carbs: 12, fat: 14, nutrient_highlights: { iron: 1, calcium: 1 }, ingredients: ["Almonds", "Walnuts", "Pumpkin seeds", "Golden raisins"], instructions: "Toss dry-roasted almonds, walnuts, pumpkin seeds, and sun-dried raisins." },
  { id: "spinach_dal", name: "Iron-rich Dal Palak", emoji: "🥬", diet_type: "vegan", allergens: [], meal_slots: ["lunch", "dinner"], kcal: 260, protein: 12, carbs: 32, fat: 6, nutrient_highlights: { iron: 3, folate: 2 }, ingredients: ["Toor dal", "Baby spinach", "Garlic", "Cumin", "Tomatoes"], instructions: "Cook yellow dal with garlic, fold in shredded tender baby spinach, and temper with cumin." },
  { id: "idli_sambar", name: "Steamed Idli with drumstick sambar", emoji: "⚪", diet_type: "vegan", allergens: [], meal_slots: ["breakfast"], kcal: 240, protein: 9, carbs: 40, fat: 4, nutrient_highlights: { iron: 1, folate: 1 }, ingredients: ["Fermented rice batter", "Toor dal", "Drumsticks", "Tamarind", "Sambar masala"], instructions: "Steam fluffy idlis; serve floating in tangy, vegetable-loaded drumstick sambar." },
  { id: "paneer_tikka", name: "Tandoori Paneer tikka skewers", emoji: "🍢", diet_type: "vegetarian", allergens: ["dairy"], meal_slots: ["snack", "dinner"], kcal: 280, protein: 15, carbs: 10, fat: 18, nutrient_highlights: { calcium: 3 }, ingredients: ["Paneer", "Bell peppers", "Onions", "Spiced yogurt marinade"], instructions: "Marinate paneer cubes in mustard oil and yogurt with carom seeds; bake or pan-sear until charred." },
  { id: "amla_juice", name: "Fresh Amla & mint immunity elixir", emoji: "🧃", diet_type: "vegan", allergens: [], meal_slots: ["snack"], kcal: 60, protein: 1, carbs: 14, fat: 0, nutrient_highlights: { vitamin_c: 3 }, ingredients: ["Indian gooseberry (amla)", "Mint leaves", "Black salt", "Water"], instructions: "Cold-press amla with mint and a pinch of black salt — potent vitamin C booster for iron absorption." },
  { id: "soy_chunk_curry", name: "High-protein Soy chunk curry", emoji: "🥘", diet_type: "vegan", allergens: ["soy"], meal_slots: ["lunch", "dinner"], kcal: 290, protein: 20, carbs: 24, fat: 10, nutrient_highlights: { iron: 2 }, ingredients: ["Textured soy chunks", "Onions", "Tomatoes", "Garam masala"], instructions: "Rehydrate soy chunks, squeeze, and simmer in rich onion-tomato masala until juicy." },
  { id: "haldi_doodh", name: "Golden turmeric milk (Haldi doodh)", emoji: "🥛", diet_type: "vegetarian", allergens: ["dairy"], meal_slots: ["snack", "dinner"], kcal: 120, protein: 6, carbs: 12, fat: 5, nutrient_highlights: { calcium: 2, vitamin_d: 1 }, ingredients: ["Warm milk", "Ground turmeric", "Black pepper", "Cardamom"], instructions: "Warm milk with pure turmeric and cracked black pepper to optimize curcumin bioavailability." },
  { id: "fortified_soy_milk_cereal", name: "Fortified soy milk with granola", emoji: "🥛", diet_type: "vegan", allergens: ["soy", "gluten"], meal_slots: ["breakfast"], kcal: 240, protein: 10, carbs: 38, fat: 5, nutrient_highlights: { vitamin_b12: 3, calcium: 2, vitamin_d: 1 }, ingredients: ["B12-fortified soy milk", "Whole-grain oats", "Flaxseed"], instructions: "Pour fortified soy milk over whole grains — vital plant-based source of vitamin B12 & calcium." },
  { id: "nutritional_yeast_toast", name: "Avocado toast with nutritional yeast", emoji: "🥑", diet_type: "vegan", allergens: ["gluten"], meal_slots: ["breakfast", "snack"], kcal: 230, protein: 8, carbs: 26, fat: 12, nutrient_highlights: { vitamin_b12: 3, folate: 1 }, ingredients: ["Whole-wheat sourdough", "Avocado", "Fortified nutritional yeast", "Lemon juice"], instructions: "Mash ripe avocado with lemon on sourdough toast, dust liberally with B12-rich nutritional yeast." },
];

const DEFICIENCY_NUTRIENTS = {
  anemia_risk: ["iron", "vitamin_b12", "folate"],
  iron_deficiency: ["iron", "vitamin_c"],
  vitamin_d_deficiency: ["vitamin_d"],
  b12_deficiency: ["vitamin_b12"],
  calcium_deficiency: ["calcium", "vitamin_d"],
};

const ALLOWED_DIETS = {
  Vegan: ["vegan"],
  Vegetarian: ["vegan", "vegetarian"],
  Eggetarian: ["vegan", "vegetarian", "eggetarian"],
  "Non-Vegetarian": ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
};

const LABEL_META = {
  anemia_risk: { label: "Anemia Risk", emoji: "🩸", description: "Low red blood cells or hemoglobin, reducing oxygen transport throughout your tissues." },
  iron_deficiency: { label: "Iron Deficiency", emoji: "⚙️", description: "Depleted iron stores affecting cellular respiration, energy, and cognitive focus." },
  vitamin_d_deficiency: { label: "Vitamin D Deficiency", emoji: "☀️", description: "Critical for bone mineralization, immune function, and neuromuscular performance." },
  b12_deficiency: { label: "Vitamin B12 Deficiency", emoji: "🧬", description: "Essential for nerve myelination, DNA synthesis, and red blood cell maturation." },
  calcium_deficiency: { label: "Calcium Deficiency", emoji: "🦴", description: "Key structural mineral for bone density, vascular contraction, and nerve signals." },
};

const ALLERGENS_LIST = ["Dairy", "Gluten", "Nuts", "Egg", "Soy", "Fish", "Peanuts", "Shellfish"];
const MEDICAL_CONDITIONS = ["None", "Diabetes", "Hypertension", "High Cholesterol", "Thyroid", "PCOS", "Anemia", "Celiac"];
const DIETARY_PREFS = ["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"];
const HEALTH_GOALS = ["Weight loss", "Muscle gain", "Weight maintenance", "Healthy eating", "Improve energy", "Longevity"];
const ACTIVITY_LEVELS = [
  { level: "Sedentary", label: "Sedentary", desc: "Little or no exercise, desk work", mult: 1.2 },
  { level: "Light", label: "Light Active", desc: "1-3 days/week light movement", mult: 1.375 },
  { level: "Moderate", label: "Moderately Active", desc: "3-5 days/week moderate workout", mult: 1.55 },
  { level: "Active", label: "Very Active", desc: "6-7 days/week hard exercise", mult: 1.725 },
  { level: "Very active", label: "Athletic / Heavy", desc: "Twice a day training / physical labor", mult: 1.9 },
];

const SYMPTOMS = [
  { key: "fatigue", label: "Chronic Fatigue", emoji: "😴", hint: "Unexplained exhaustion even after full rest", affects: "Iron, B12, Vit D" },
  { key: "hairLoss", label: "Hair Shedding & Thinning", emoji: "💇", hint: "Excessive fall during wash or brushing", affects: "Iron, Ferritin, Protein" },
  { key: "skin", label: "Dry / Pale Skin & Brittle Nails", emoji: "🧴", hint: "Rough texture, lack of healthy luster", affects: "Iron, Vit C, Vit D" },
  { key: "muscleWeakness", label: "Muscle Weakness & Cramps", emoji: "💪", hint: "Reduced grip strength, cramps or aches", affects: "Calcium, Vit D, Potassium" },
  { key: "mood", label: "Brain Fog & Mood Lows", emoji: "🌥️", hint: "Forgetfulness, sluggish focus, mild irritability", affects: "Vitamin B12, Vit D" },
];
const SEVERITIES = ["None", "Mild", "Moderate", "Severe"];

const LAB_FIELDS = [
  { key: "hemoglobin", label: "Hemoglobin", unit: "g/dL", low: 12.0, high: 16.0, emoji: "🩸", hint: "Healthy RBC oxygen carrier" },
  { key: "vitaminD", label: "Vitamin D (25-OH)", unit: "ng/mL", low: 20.0, high: 50.0, emoji: "☀️", hint: "Bone density & immunity" },
  { key: "vitaminB12", label: "Vitamin B12", unit: "pg/mL", low: 200.0, high: 900.0, emoji: "🧬", hint: "Nerve health & RBC production" },
  { key: "iron", label: "Serum Iron", unit: "µg/dL", low: 60.0, high: 170.0, emoji: "⚙️", hint: "Circulating iron levels" },
  { key: "calcium", label: "Total Calcium", unit: "mg/dL", low: 8.5, high: 10.5, emoji: "🦴", hint: "Bone & muscle contraction" },
];

const MEAL_META = {
  breakfast: { label: "Breakfast", emoji: "🌅", desc: "Energy & morning vitality" },
  lunch: { label: "Lunch", emoji: "☀️", desc: "Sustained midday fuel" },
  snack: { label: "Snacks", emoji: "🍎", desc: "Nutrient bridge & focus" },
  dinner: { label: "Dinner", emoji: "🌙", desc: "Restorative light meal" },
};
const MEAL_SLOTS_ORDER = ["breakfast", "lunch", "snack", "dinner"];

// Set VITE_API_BASE_URL in the hosting dashboard for production.

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";


/* ---------------- Helper functions ---------------- */

const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const RISK_TARGETS = { iron: 15, b12: 2.4, calcium: 900, vitd: 400 };

function runLocalRiskEngine({ profile, diaryMicros, symptoms }) {
  const age = parseFloat(profile.age) || 30;
  const isFemale = profile.gender === "Female";
  const isVegan = profile.dietaryPreference === "Vegan";
  const isVeg = profile.dietaryPreference === "Vegetarian" || isVegan;
  const sedentary = profile.activity === "Sedentary" || profile.activity === "Light";
  const sevNum = (k) => ({ None: 0, Mild: 1, Moderate: 2, Severe: 3 }[symptoms[k]] || 0);
  const gap = (val, target) => 1 - Math.min(1.4, (val || 0) / target);

  const build = (key, label, emoji, logit, factors) => {
    const p = Math.max(0.04, Math.min(0.96, sigmoid(logit)));
    const band = p < 0.22 ? "Low" : p < 0.50 ? "Moderate" : "High";
    const sortedFactors = factors.filter((f) => f.impact > 0).sort((a, b) => b.impact - a.impact).slice(0, 3);
    return {
      label: key,
      displayName: label,
      emoji,
      probability: p,
      band,
      factors: sortedFactors.length ? sortedFactors : [{ feature: "Balanced nutritional intake detected", direction: "lowers risk", impact: 0.1 }],
    };
  };

  const ironGap = gap(diaryMicros.iron, RISK_TARGETS.iron);
  const b12Gap = gap(diaryMicros.b12, RISK_TARGETS.b12);
  const caGap = gap(diaryMicros.ca, RISK_TARGETS.calcium);
  const vitdGap = gap(diaryMicros.vitd, RISK_TARGETS.vitd);

  return [
    build("anemia_risk", "Anemia Risk", "🩸",
      2.1 * ironGap + (isFemale ? 0.55 : 0) + 0.16 * sevNum("fatigue") - 1.0,
      [
        { feature: "Low logged iron intake", direction: ironGap > 0.2 ? "increases risk" : "lowers risk", impact: Math.abs(round(ironGap * 0.45, 3)) },
        { feature: "Biological sex (higher baseline iron requirement)", direction: isFemale ? "increases risk" : "lowers risk", impact: isFemale ? 0.28 : 0.05 },
        { feature: "Reported fatigue symptom", direction: sevNum("fatigue") > 0 ? "increases risk" : "lowers risk", impact: Math.abs(round(0.12 * sevNum("fatigue"), 3)) },
      ]),
    build("iron_deficiency", "Iron Deficiency", "⚙️",
      2.3 * ironGap + (isFemale ? 0.6 : 0) + 0.15 * sevNum("fatigue") + 0.15 * sevNum("hairLoss") - 1.0,
      [
        { feature: "Sub-optimal dietary iron density", direction: ironGap > 0.2 ? "increases risk" : "lowers risk", impact: Math.abs(round(ironGap * 0.48, 3)) },
        { feature: "Reported hair loss / fatigue combo", direction: (sevNum("fatigue") + sevNum("hairLoss")) > 0 ? "increases risk" : "lowers risk", impact: Math.abs(round(0.14 * (sevNum("fatigue") + sevNum("hairLoss")), 3)) },
        { feature: "Biological sex baseline", direction: isFemale ? "increases risk" : "lowers risk", impact: isFemale ? 0.25 : 0.04 },
      ]),
    build("vitamin_d_deficiency", "Vitamin D Deficiency", "☀️",
      2.2 * vitdGap + (sedentary ? 0.5 : 0) + 0.16 * sevNum("muscleWeakness") - 0.95,
      [
        { feature: "Minimal vitamin D fortified food intake", direction: vitdGap > 0.2 ? "increases risk" : "lowers risk", impact: Math.abs(round(vitdGap * 0.52, 3)) },
        { feature: "Sedentary / indoor lifestyle proxy", direction: sedentary ? "increases risk" : "lowers risk", impact: sedentary ? 0.32 : 0.08 },
        { feature: "Reported muscle weakness", direction: sevNum("muscleWeakness") > 0 ? "increases risk" : "lowers risk", impact: Math.abs(round(0.15 * sevNum("muscleWeakness"), 3)) },
      ]),
    build("b12_deficiency", "Vitamin B12 Deficiency", "🧬",
      2.5 * b12Gap + (isVegan ? 0.85 : isVeg ? 0.35 : 0) + 0.02 * Math.max(0, age - 50) + 0.15 * sevNum("mood") - 1.0,
      [
        { feature: "Low logged vitamin B12 intake", direction: b12Gap > 0.2 ? "increases risk" : "lowers risk", impact: Math.abs(round(b12Gap * 0.54, 3)) },
        { feature: "Plant-focused diet (limited natural B12 foods)", direction: isVeg ? "increases risk" : "lowers risk", impact: isVegan ? 0.48 : isVeg ? 0.28 : 0.06 },
        { feature: "Reported mood / focus symptoms", direction: sevNum("mood") > 0 ? "increases risk" : "lowers risk", impact: Math.abs(round(0.14 * sevNum("mood"), 3)) },
      ]),
    build("calcium_deficiency", "Calcium Deficiency", "🦴",
      2.1 * caGap + 0.04 * Math.max(0, age - 30) + 0.12 * sevNum("muscleWeakness") - 0.95,
      [
        { feature: "Dietary calcium below recommended threshold", direction: caGap > 0.2 ? "increases risk" : "lowers risk", impact: Math.abs(round(caGap * 0.46, 3)) },
        { feature: "Muscle weakness & cramp symptoms", direction: sevNum("muscleWeakness") > 0 ? "increases risk" : "lowers risk", impact: Math.abs(round(0.12 * sevNum("muscleWeakness"), 3)) },
        { feature: "Age-related bone mineral balance", direction: age > 35 ? "increases risk" : "lowers risk", impact: Math.abs(round(0.04 * Math.max(0, age - 30), 3)) },
      ]),
  ];
}

function round(val, decimals = 1) {
  const factor = Math.pow(10, decimals);
  return Math.round((val || 0) * factor) / factor;
}

function labStatus(value, low, high) {
  if (value === "" || value === null || value === undefined) return null;
  const v = parseFloat(value);
  if (Number.isNaN(v)) return null;
  if (v < low) return { status: "low", label: "Low ⚠️", color: TOKENS.coral };
  if (v > high) return { status: "high", label: "High ⚡", color: TOKENS.gold };
  return { status: "normal", label: "Normal ✓", color: TOKENS.sage };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", icon: Sunrise, emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon", icon: Sun, emoji: "☀️" };
  return { text: "Good evening", icon: Moon, emoji: "🌙" };
}

function filterRecipesLocal(diet, allergies, mealSlot = null, search = "") {
  const allowed = ALLOWED_DIETS[diet] || ALLOWED_DIETS["Non-Vegetarian"];
  const allergySet = new Set((allergies || []).map((a) => a.toLowerCase()));
  return RECIPES_CATALOG.filter((r) => {
    if (!allowed.includes(r.diet_type)) return false;
    if (r.allergens.some((a) => allergySet.has(a.toLowerCase()))) return false;
    if (mealSlot && !r.meal_slots.includes(mealSlot)) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}

function generateLocalPlan(diet, allergies, riskResults, days = 7) {
  const allowed = ALLOWED_DIETS[diet] || ALLOWED_DIETS["Non-Vegetarian"];
  const allergySet = new Set((allergies || []).map((a) => a.toLowerCase()));
  const pool = {};
  for (const slot of MEAL_SLOTS_ORDER) {
    const items = RECIPES_CATALOG.filter(
      (r) => allowed.includes(r.diet_type) &&
             !r.allergens.some((a) => allergySet.has(a.toLowerCase())) &&
             r.meal_slots.includes(slot)
    );
    pool[slot] = items.length ? items : RECIPES_CATALOG.filter((r) => r.meal_slots.includes(slot));
  }

  const neededNutrients = new Set();
  (riskResults || []).forEach((r) => {
    if (r.risk_band === "Moderate" || r.risk_band === "High") {
      (DEFICIENCY_NUTRIENTS[r.label] || []).forEach((n) => neededNutrients.add(n));
    }
  });

  const recent = { breakfast: [], lunch: [], snack: [], dinner: [] };
  const plan = [];

  for (let day = 1; day <= days; day++) {
    const meals = {};
    for (const slot of MEAL_SLOTS_ORDER) {
      const avoid = new Set(recent[slot].slice(-2));
      let candidates = pool[slot].filter((r) => !avoid.has(r.id));
      if (!candidates.length) candidates = pool[slot];

      // Score candidates by needed nutrients
      const scored = candidates.map((recipe) => {
        let score = 1;
        neededNutrients.forEach((n) => {
          score += (recipe.nutrient_highlights[n] || 0) * 2.5;
        });
        return { recipe, weight: score };
      });

      scored.sort((a, b) => b.weight - a.weight);
      // Pick top-weighted with slight variety jitter
      const pick = scored[Math.floor(Math.random() * Math.min(2, scored.length))].recipe;
      meals[slot] = pick;
      recent[slot].push(pick.id);
    }
    plan.push({ day, meals });
  }
  return plan;
}

/* =========================================================================
   MAIN APP COMPONENT
   ========================================================================= */

export default function NutriSense() {
  // Navigation
  const [page, setPage] = useState("dashboard");
  const [backendAlive, setBackendAlive] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("aryan.sharma@nutrisense.ai");
  const [loginPass, setLoginPass] = useState("••••••••");

  // Health Profile State (with LocalStorage hydration)
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("nutrisense_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      name: "Dr. Aryan Sharma",
      age: 26,
      gender: "Male",
      height: 174,
      weight: 68,
      activity: "Moderate",
      medicalConditions: ["None"],
      dietaryPreference: "Vegetarian",
      healthGoals: ["Improve energy", "Healthy eating"],
      allergies: [],
    };
  });
  const [draftProfile, setDraftProfile] = useState(profile);
  const [profileSaved, setProfileSaved] = useState(true);

  // Food Diary State
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("nutrisense_meals");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      breakfast: [
        { ...FOOD_DB[0], uid: "init-1", qty: 2 }, // Roti 2 pcs
        { ...FOOD_DB[1], uid: "init-2", qty: 1 }, // Dal 1 bowl
      ],
      lunch: [
        { ...FOOD_DB[2], uid: "init-3", qty: 1 }, // Brown Rice
        { ...FOOD_DB[4], uid: "init-4", qty: 1 }, // Paneer
        { ...FOOD_DB[12], uid: "init-5", qty: 1 }, // Salad
      ],
      snack: [
        { ...FOOD_DB[13], uid: "init-6", qty: 1 }, // Almonds
        { ...FOOD_DB[16], uid: "init-7", qty: 1 }, // Apple
      ],
      dinner: [
        { ...FOOD_DB[0], uid: "init-8", qty: 2 }, // Roti 2 pcs
        { ...FOOD_DB[10], uid: "init-9", qty: 1 }, // Mixed Sabzi
        { ...FOOD_DB[14], uid: "init-10", qty: 1 }, // Curd
      ],
    };
  });

  const [addFoodMealSlot, setAddFoodMealSlot] = useState(null);
  const [customFoods, setCustomFoods] = useState(() => {
    const saved = localStorage.getItem("nutrisense_custom_foods");
    return saved ? JSON.parse(saved) : [];
  });

  // Water Hydration State (8 cups = 2000 ml)
  const [waterCups, setWaterCups] = useState(() => {
    const saved = localStorage.getItem("nutrisense_water");
    return saved ? parseInt(saved) : 5;
  });

  // Symptoms & Blood Labs State
  const [symptoms, setSymptoms] = useState(() => {
    const saved = localStorage.getItem("nutrisense_symptoms");
    return saved ? JSON.parse(saved) : {
      fatigue: "Moderate",
      hairLoss: "Mild",
      skin: "None",
      muscleWeakness: "Mild",
      mood: "None",
    };
  });

  const [labs, setLabs] = useState(() => {
    const saved = localStorage.getItem("nutrisense_labs");
    return saved ? JSON.parse(saved) : {
      hemoglobin: "13.2",
      vitaminD: "18.5", // slightly low
      vitaminB12: "220",
      iron: "68",
      calcium: "9.2",
    };
  });

  // ML Risk Assessment State
  const [riskResults, setRiskResults] = useState(() => {
    const saved = localStorage.getItem("nutrisense_risk_results");
    return saved ? JSON.parse(saved) : null;
  });

  // 7-Day Meal Plan State
  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem("nutrisense_mealplan");
    return saved ? JSON.parse(saved) : null;
  });

  // Flash toast message helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("nutrisense_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("nutrisense_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("nutrisense_water", waterCups.toString());
  }, [waterCups]);

  useEffect(() => {
    localStorage.setItem("nutrisense_symptoms", JSON.stringify(symptoms));
  }, [symptoms]);

  useEffect(() => {
    localStorage.setItem("nutrisense_labs", JSON.stringify(labs));
  }, [labs]);

  useEffect(() => {
    if (riskResults) localStorage.setItem("nutrisense_risk_results", JSON.stringify(riskResults));
  }, [riskResults]);

  useEffect(() => {
    if (mealPlan) localStorage.setItem("nutrisense_mealplan", JSON.stringify(mealPlan));
  }, [mealPlan]);

  // Ping backend to check live availability
  const checkBackendHealth = useCallback(async () => {
    setCheckingBackend(true);
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        setBackendAlive(true);
      } else {
        setBackendAlive(false);
      }
    } catch {
      setBackendAlive(false);
    } finally {
      setCheckingBackend(false);
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 20000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  /* ---------------- Computed Nutrition Totals ---------------- */
  const totals = useMemo(() => {
    let kcal = 0, p = 0, c = 0, f = 0, fiber = 0;
    Object.values(meals).forEach((list) =>
      list.forEach((item) => {
        const qty = item.qty || 1;
        kcal += (item.kcal || 0) * qty;
        p += (item.p || 0) * qty;
        c += (item.c || 0) * qty;
        f += (item.f || 0) * qty;
        fiber += (item.fiber || 0) * qty;
      })
    );
    return {
      kcal: Math.round(kcal),
      p: Math.round(p * 10) / 10,
      c: Math.round(c * 10) / 10,
      f: Math.round(f * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
    };
  }, [meals]);

  const diaryMicros = useMemo(() => {
    let iron = 0, b12 = 0, ca = 0, vitd = 0;
    Object.values(meals).forEach((list) =>
      list.forEach((item) => {
        const qty = item.qty || 1;
        iron += (item.iron || 0) * qty;
        b12 += (item.b12 || 0) * qty;
        ca += (item.ca || 0) * qty;
        vitd += (item.vitd || 0) * qty;
      })
    );
    return {
      iron: Math.round(iron * 10) / 10,
      b12: Math.round(b12 * 10) / 10,
      ca: Math.round(ca),
      vitd: Math.round(vitd),
    };
  }, [meals]);

  // Mifflin-St Jeor Energy Target
  const targetKcal = useMemo(() => {
    const { age, gender, height, weight, activity, healthGoals } = profile;
    const a = parseFloat(age) || 28;
    const h = parseFloat(height) || 170;
    const w = parseFloat(weight) || 68;
    let bmr = 10 * w + 6.25 * h - 5 * a + (gender === "Male" ? 5 : gender === "Female" ? -161 : -78);
    const actMult = ACTIVITY_LEVELS.find((al) => al.level === activity)?.mult || 1.55;
    let tdee = Math.round(bmr * actMult);

    if (healthGoals.includes("Weight loss")) tdee -= 350;
    else if (healthGoals.includes("Muscle gain")) tdee += 300;
    return Math.max(1400, Math.min(4200, tdee));
  }, [profile]);

  // Macro Targets
  const macroTargets = useMemo(() => {
    const w = parseFloat(profile.weight) || 68;
    let pTarget = Math.round(w * (profile.healthGoals.includes("Muscle gain") ? 1.8 : 1.2));
    let fTarget = Math.round((targetKcal * 0.25) / 9);
    let cTarget = Math.round((targetKcal - (pTarget * 4 + fTarget * 9)) / 4);
    return { protein: pTarget, carbs: Math.max(120, cTarget), fat: fTarget, fiber: 30 };
  }, [profile, targetKcal]);

  const caloriePct = Math.min(100, Math.round((totals.kcal / targetKcal) * 100));
  const symptomFlagsCount = Object.values(symptoms).filter((v) => v !== "None").length;
  const labsFilledCount = LAB_FIELDS.filter((l) => labs[l.key] !== "").length;

  /* ---------------- Food Diary Actions ---------------- */
  function handleAddFood(food, slot, quantity = 1) {
    const entry = {
      ...food,
      uid: `${food.id || "food"}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      qty: quantity,
    };
    setMeals((prev) => ({
      ...prev,
      [slot]: [...prev[slot], entry],
    }));
    showToast(`Added ${food.name} to ${MEAL_META[slot].label} ✨`);
  }

  function handleUpdateQty(slot, uid, delta) {
    setMeals((prev) => ({
      ...prev,
      [slot]: prev[slot]
        .map((it) => (it.uid === uid ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it)),
    }));
  }

  function handleRemoveFood(slot, uid) {
    setMeals((prev) => ({
      ...prev,
      [slot]: prev[slot].filter((it) => it.uid !== uid),
    }));
    showToast("Food item removed");
  }

  function handleLogRecipeToDiary(recipe, preferredSlot = null) {
    const slot = preferredSlot || (recipe.meal_slots && recipe.meal_slots[0]) || "lunch";
    const foodItem = {
      id: recipe.id,
      name: recipe.name,
      emoji: recipe.emoji || "🍲",
      kcal: recipe.kcal,
      p: recipe.protein,
      c: recipe.carbs,
      f: recipe.fat,
      fiber: 3.5,
      iron: (recipe.nutrient_highlights?.iron || 0) * 1.2,
      b12: (recipe.nutrient_highlights?.vitamin_b12 || 0) * 0.8,
      ca: (recipe.nutrient_highlights?.calcium || 0) * 80,
      vitd: (recipe.nutrient_highlights?.vitamin_d || 0) * 40,
      tag: "NutriSense Recipe",
    };
    handleAddFood(foodItem, slot, 1);
  }

  function handleLogWholeDayPlan(dayPlan) {
    if (!dayPlan || !dayPlan.meals) return;
    MEAL_SLOTS_ORDER.forEach((slot) => {
      const recipe = dayPlan.meals[slot];
      if (recipe) {
        handleLogRecipeToDiary(recipe, slot);
      }
    });
    showToast(`Logged all meals for Day ${dayPlan.day} to Food Diary 📔`);
  }

  function handleLoadSampleDay() {
    setMeals({
      breakfast: [
        { ...FOOD_DB[15], uid: `s-1-${Date.now()}`, qty: 1 }, // Rolled Oats
        { ...FOOD_DB[5], uid: `s-2-${Date.now()}`, qty: 1 },  // Milk
        { ...FOOD_DB[7], uid: `s-3-${Date.now()}`, qty: 1 },  // Banana
      ],
      lunch: [
        { ...FOOD_DB[0], uid: `s-4-${Date.now()}`, qty: 2 },  // Roti
        { ...FOOD_DB[3], uid: `s-5-${Date.now()}`, qty: 1 },  // Dal
        { ...FOOD_DB[12], uid: `s-6-${Date.now()}`, qty: 1 }, // Salad
        { ...FOOD_DB[14], uid: `s-7-${Date.now()}`, qty: 1 }, // Curd
      ],
      snack: [
        { ...FOOD_DB[13], uid: `s-8-${Date.now()}`, qty: 1 }, // Almonds
        { ...FOOD_DB[18], uid: `s-9-${Date.now()}`, qty: 1 }, // Sprouts
      ],
      dinner: [
        { ...FOOD_DB[2], uid: `s-10-${Date.now()}`, qty: 1 }, // Brown Rice
        { ...FOOD_DB[4], uid: `s-11-${Date.now()}`, qty: 1 }, // Paneer
        { ...FOOD_DB[17], uid: `s-12-${Date.now()}`, qty: 1 }, // Spinach Soup
      ],
    });
    setWaterCups(7);
    showToast("Loaded high-nutrition sample balanced day 🥗");
  }

  function handleClearDiary() {
    if (window.confirm("Clear all logged meals for today?")) {
      setMeals({ breakfast: [], lunch: [], snack: [], dinner: [] });
      showToast("Today's food diary cleared");
    }
  }

  /* ---------------- Navigation Tabs ---------------- */
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: Home, badge: null },
    { key: "diary", label: "Food Diary", icon: BookOpen, badge: `${totals.kcal} kcal` },
    { key: "profile", label: "Health Profile", icon: Heart, badge: profile.dietaryPreference },
    { key: "symptoms", label: "Symptoms & Labs", icon: Activity, badge: symptomFlagsCount ? `${symptomFlagsCount} alert` : null },
    { key: "insights", label: "ML Risk Insights", icon: Sparkles, badge: riskResults ? "Ready" : "Scan" },
    { key: "recommendations", label: "Recommendations", icon: ClipboardList, badge: null },
    { key: "mealplan", label: "7-Day Meal Plan", icon: Utensils, badge: mealPlan ? "7 Days" : null },
    { key: "history", label: "History & Trends", icon: CalendarDays, badge: null },
  ];

  /* ---------------- FRONT PAGE / LANDING PAGE ---------------- */
  if (!isAuthenticated) {
    return (
      <LandingPageView
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPass={loginPass}
        setLoginPass={setLoginPass}
        onLogin={() => setIsAuthenticated(true)}
      />
    );
  }

  /* ---------------- APPLICATION SHELL ---------------- */
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#064E3B] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#10B981]/30 flex items-center gap-2.5 text-sm font-medium animate-bounce">
          <Sparkle size={18} className="text-[#10B981]" />
          {toastMessage}
        </div>
      )}

      {/* TOP HEADER / APP BAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E8E2D5] px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div
            onClick={() => setPage("dashboard")}
            className="w-10 h-10 rounded-xl bg-[#064E3B] flex items-center justify-center text-xl shadow-md shadow-[#064E3B]/20 cursor-pointer"
          >
            🥑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                onClick={() => setPage("dashboard")}
                className="font-bold text-lg leading-none font-editorial text-[#064E3B] cursor-pointer"
              >
                NutriSense
              </span>
              <span className="hidden sm:inline-block bg-[#ECFDF5] text-[#064E3B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D1FAE5]">
                AI Intelligence
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] hidden sm:block">
              Screening • Recommendations • Meal Planning
            </p>
          </div>
        </div>

        {/* Status Indicators & Profile Bar */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Backend Connection Status Pill */}
          <button
            onClick={() => {
              checkBackendHealth();
              showToast(
                backendAlive
                  ? "Live FastAPI ML Server is Connected on port 8000! 🚀"
                  : "Connecting to server or using Smart Standalone Client Engine ⚡"
              );
            }}
            title="Click to check FastAPI ML server connection"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              backendAlive
                ? "bg-[#ECFDF5] border-[#10B981]/40 text-[#064E3B]"
                : "bg-[#FFFBEB] border-[#F59E0B]/40 text-[#B45309]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendAlive ? "bg-[#10B981] animate-pulse" : "bg-[#F59E0B]"
              }`}
            />
            <span className="hidden md:inline">
              {checkingBackend
                ? "Checking..."
                : backendAlive
                ? "FastAPI ML :8000 Active"
                : "Client Engine Active"}
            </span>
            <RefreshCw size={12} className={checkingBackend ? "animate-spin" : ""} />
          </button>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center gap-3 bg-[#FBF9F5] border border-[#E8E2D5] px-3.5 py-1.5 rounded-full text-xs">
            <span className="flex items-center gap-1 text-[#EA580C] font-semibold">
              <Flame size={14} /> {totals.kcal} / {targetKcal} kcal
            </span>
            <span className="text-[#E8E2D5]">|</span>
            <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
              <Droplets size={14} /> {waterCups * 250} ml
            </span>
          </div>

          {/* User Profile Chip */}
          <div
            onClick={() => setPage("profile")}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#F5EFE6] hover:bg-[#E8E2D5] border border-[#E8E2D5] transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">
              {profile.name ? profile.name.charAt(0) : "U"}
            </div>
            <span className="text-xs font-semibold text-[#1C1917] hidden sm:inline max-w-[100px] truncate">
              {profile.name || "My Profile"}
            </span>
          </div>

          <button
            onClick={() => setIsAuthenticated(false)}
            title="Sign Out"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] hover:text-[#EA580C] hover:bg-[#FFEDD5] transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:flex w-64 flex-col justify-between p-4 border-r border-[#E8E2D5] bg-white shrink-0">
          <nav className="space-y-1">
            <p className="px-3 pt-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
              Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = page === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#064E3B] text-white shadow-md shadow-[#064E3B]/20"
                      : "text-[#57534E] hover:text-[#064E3B] hover:bg-[#ECFDF5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? "text-[#10B981]" : "text-[#78716C]"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-[#F5EFE6] text-[#57534E]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Helper Box in Sidebar */}
          <div className="bg-gradient-to-br from-[#ECFDF5] to-[#F5EFE6] p-4 rounded-2xl border border-[#D1FAE5] mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#064E3B] mb-1">
              <Zap size={14} className="text-[#10B981]" />
              <span>Smart Nutrition Tip</span>
            </div>
            <p className="text-[12px] text-[#57534E] leading-relaxed">
              Pair iron-rich lentils or spinach with Vitamin C (lemon or oranges) to increase non-heme iron absorption by up to 300%.
            </p>
          </div>
        </aside>

        {/* Mobile Horizontal Navigation Bar */}
        <div className="md:hidden flex overflow-x-auto gap-1.5 p-2 bg-white border-b border-[#E8E2D5] sticky top-[61px] z-30 shadow-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "bg-[#064E3B] text-white"
                    : "bg-[#F5EFE6] text-[#57534E] hover:bg-[#E8E2D5]"
                }`}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* VIEW CONTAINER */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {page === "dashboard" && (
            <DashboardView
              profile={profile}
              totals={totals}
              targetKcal={targetKcal}
              macroTargets={macroTargets}
              caloriePct={caloriePct}
              waterCups={waterCups}
              setWaterCups={setWaterCups}
              symptoms={symptoms}
              symptomFlagsCount={symptomFlagsCount}
              labsFilledCount={labsFilledCount}
              riskResults={riskResults}
              mealPlan={mealPlan}
              setPage={setPage}
              onQuickLogFood={(slot) => setAddFoodMealSlot(slot)}
              onLogRecipeToDiary={handleLogRecipeToDiary}
              onLogWholeDayPlan={handleLogWholeDayPlan}
              showToast={showToast}
            />
          )}

          {page === "diary" && (
            <DiaryView
              meals={meals}
              totals={totals}
              targetKcal={targetKcal}
              macroTargets={macroTargets}
              caloriePct={caloriePct}
              diaryMicros={diaryMicros}
              waterCups={waterCups}
              setWaterCups={setWaterCups}
              onOpenAddFood={(slot) => setAddFoodMealSlot(slot)}
              onUpdateQty={handleUpdateQty}
              onRemoveFood={handleRemoveFood}
              onLoadSampleDay={handleLoadSampleDay}
              onClearDiary={handleClearDiary}
            />
          )}

          {page === "profile" && (
            <ProfileView
              draftProfile={draftProfile}
              setDraftProfile={setDraftProfile}
              saveProfile={() => {
                setProfile(draftProfile);
                setProfileSaved(true);
                showToast("Health profile and metabolic targets updated! 🥑");
              }}
              targetKcal={targetKcal}
              macroTargets={macroTargets}
            />
          )}

          {page === "symptoms" && (
            <SymptomsView
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              labs={labs}
              setLabs={setLabs}
              showToast={showToast}
            />
          )}

          {page === "insights" && (
            <InsightsView
              profile={profile}
              totals={totals}
              diaryMicros={diaryMicros}
              symptoms={symptoms}
              riskResults={riskResults}
              setRiskResults={setRiskResults}
              backendAlive={backendAlive}
              setPage={setPage}
              showToast={showToast}
            />
          )}

          {page === "recommendations" && (
            <RecommendationsView
              profile={profile}
              riskResults={riskResults}
              backendAlive={backendAlive}
              setPage={setPage}
              onLogRecipeToDiary={handleLogRecipeToDiary}
              showToast={showToast}
            />
          )}

          {page === "mealplan" && (
            <MealPlanView
              profile={profile}
              riskResults={riskResults}
              mealPlan={mealPlan}
              setMealPlan={setMealPlan}
              backendAlive={backendAlive}
              setPage={setPage}
              onLogRecipeToDiary={handleLogRecipeToDiary}
              onLogWholeDayPlan={handleLogWholeDayPlan}
              showToast={showToast}
            />
          )}

          {page === "history" && (
            <HistoryView
              backendAlive={backendAlive}
              currentTotals={totals}
              currentMicros={diaryMicros}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* ADD FOOD MODAL */}
      {addFoodMealSlot && (
        <AddFoodModal
          slot={addFoodMealSlot}
          onClose={() => setAddFoodMealSlot(null)}
          onAddFood={(food, qty) => {
            handleAddFood(food, addFoodMealSlot, qty);
            setAddFoodMealSlot(null);
          }}
          customFoods={customFoods}
          onSaveCustomFood={(newFood) => {
            setCustomFoods((prev) => {
              const updated = [newFood, ...prev];
              localStorage.setItem("nutrisense_custom_foods", JSON.stringify(updated));
              return updated;
            });
            showToast(`Custom food "${newFood.name}" saved!`);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================================
   FRONT PAGE / LANDING PAGE COMPONENT
   ========================================================================= */

function LandingPageView({ loginEmail, setLoginEmail, loginPass, setLoginPass, onLogin }) {
  const [fastLoginLoading, setFastLoginLoading] = useState(false);

  const handleQuickLogin = (email = "aryan.sharma@nutrisense.ai") => {
    setFastLoginLoading(true);
    setLoginEmail(email);
    setTimeout(() => {
      onLogin();
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-[#FBF9F5] text-[#1C1917] selection:bg-[#10B981]/20 selection:text-[#064E3B]">
      {/* PUBLIC TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#E8E2D5] px-4 md:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#064E3B] flex items-center justify-center text-xl shadow-md shadow-[#064E3B]/20">
            🥑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg leading-none font-editorial text-[#064E3B]">
                NutriSense
              </span>
              <span className="hidden sm:inline-block bg-[#ECFDF5] text-[#064E3B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D1FAE5]">
                Clinical Nutrition Intelligence
              </span>
            </div>
            <p className="text-[11px] text-[#57534E] hidden sm:block">
              Screening • Explainable AI • Safety-Aware Meal Planning
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#57534E]">
          <a href="#features" className="hover:text-[#064E3B] transition-colors">Features</a>
          <a href="#clinical-ai" className="hover:text-[#064E3B] transition-colors">AI Screening</a>
          <a href="#meal-planner" className="hover:text-[#064E3B] transition-colors">Meal Engine</a>
          <a href="#science" className="hover:text-[#064E3B] transition-colors">Nutrition Science</a>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-2.5">
          <a
            href="#portal-access"
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#064E3B] hover:bg-[#ECFDF5] transition-colors hidden sm:inline-block"
          >
            Sign In
          </a>
          <button
            onClick={() => onLogin()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#064E3B] text-white hover:bg-[#047857] shadow-md shadow-[#064E3B]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Launch Portal <ChevronRight size={14} />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-16 pb-16 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: High-Impact Messaging */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] text-xs font-bold shadow-xs">
              <Sparkles size={14} className="text-[#10B981]" />
              <span>Evidence-Based Clinical Nutrition Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-editorial text-[#064E3B] leading-[1.15]">
              Precision Nutrition Guided by Clinical AI.
            </h1>

            <p className="text-sm md:text-base text-[#57534E] leading-relaxed max-w-2xl">
              NutriSense bridges the gap between daily dietary intake and physiological biochemistry. Screen for latent micronutrient deficiency risks, inspect explainable SHAP feature drivers, and enjoy safety-filtered 7-day culinary plans tailored to your biometrics.
            </p>

            {/* Feature Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
                <span className="text-xl">🩸</span>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">Multi-Label Deficiency Screening</h4>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Anemia, Iron, Vitamin D, B12 & Calcium</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">SHAP Feature Attribution</h4>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Transparent explainable clinical drivers</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
                <span className="text-xl">🍱</span>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">7-Day Safe Meal Planner</h4>
                  <p className="text-[11px] text-[#78716C] mt-0.5">3-day variety window & allergen exclusions</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
                <span className="text-xl">📊</span>
                <div>
                  <h4 className="font-bold text-xs text-[#1C1917]">Mifflin-St Jeor Energy Engine</h4>
                  <p className="text-[11px] text-[#78716C] mt-0.5">Live BMI, BMR/TDEE & blood biomarkers</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onLogin()}
                className="px-6 py-3.5 rounded-xl font-bold text-xs md:text-sm bg-[#064E3B] text-white hover:bg-[#047857] shadow-xl shadow-[#064E3B]/25 transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Explore Nutrition Portal</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickLogin("aryan.sharma@nutrisense.ai")}
                className="px-5 py-3.5 rounded-xl font-bold text-xs md:text-sm bg-white border border-[#E8E2D5] text-[#064E3B] hover:bg-[#ECFDF5] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Zap size={16} className="text-[#10B981]" />
                <span>Instant 1-Click Access</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="flex items-center gap-6 pt-4 border-t border-[#E8E2D5] text-xs font-semibold text-[#57534E]">
              <div>
                <span className="text-lg font-bold text-[#064E3B] block">94.8%</span>
                <span className="text-[11px] text-[#78716C]">Screening Sensitivity</span>
              </div>
              <div className="h-7 w-px bg-[#E8E2D5]" />
              <div>
                <span className="text-lg font-bold text-[#064E3B] block">3,000+</span>
                <span className="text-[11px] text-[#78716C]">Clinical Profiles</span>
              </div>
              <div className="h-7 w-px bg-[#E8E2D5]" />
              <div>
                <span className="text-lg font-bold text-[#064E3B] block">100%</span>
                <span className="text-[11px] text-[#78716C]">Allergen Safety Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Portal Access Card */}
          <div id="portal-access" className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-7 md:p-9 shadow-2xl border border-[#E8E2D5] relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#064E3B] flex items-center justify-center text-xl shadow-md shadow-[#064E3B]/20">
                    🥑
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-editorial text-[#064E3B]">
                      Health Portal Sign In
                    </h3>
                    <p className="text-[11px] text-[#78716C]">
                      Access your biometrics & meal intelligence
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#D1FAE5]">
                  Secure
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onLogin();
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-[#57534E] mb-1.5">
                    Professional or Personal Email
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="aryan.sharma@nutrisense.ai"
                    className="w-full rounded-xl border border-[#E8E2D5] px-4 py-3 text-xs md:text-sm outline-none focus:ring-2 focus:ring-[#10B981] bg-[#FBF9F5]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#57534E]">
                      Password
                    </label>
                    <span className="text-[11px] text-[#059669] font-semibold cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <input
                    type="password"
                    required
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#E8E2D5] px-4 py-3 text-xs md:text-sm outline-none focus:ring-2 focus:ring-[#10B981] bg-[#FBF9F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs md:text-sm text-white bg-[#064E3B] hover:bg-[#047857] shadow-lg shadow-[#064E3B]/25 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  Sign In to Health Portal
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Instant 1-Click Access Option */}
              <div className="mt-4 pt-4 border-t border-[#E8E2D5] space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin("aryan.sharma@nutrisense.ai")}
                  disabled={fastLoginLoading}
                  className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-[#ECFDF5] text-[#064E3B] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap size={14} className="text-[#10B981]" />
                  <span>{fastLoginLoading ? "Signing in..." : "Instant 1-Click Access as Dr. Aryan Sharma"}</span>
                </button>

                <div className="flex items-center justify-between text-[11px] text-[#78716C] pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={13} className="text-[#059669]" /> ICMR-NIN & USDA Grounded
                  </span>
                  <span className="font-semibold text-[#064E3B]">
                    Active Session Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLINICAL AI SCREENING TEASER SECTION */}
      <section id="clinical-ai" className="py-16 px-4 md:px-8 bg-white border-y border-[#E8E2D5]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
              Machine Learning Intelligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-[#064E3B] mt-1">
              Multi-Label Risk Screening with SHAP Explainability
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-2">
              NutriSense uses a Random Forest classifier to assess 5 key deficiency categories simultaneously, providing transparent per-prediction feature attribution.
            </p>
          </div>

          {/* 5 Indicator Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { emoji: "🩸", label: "Anemia Risk", risk: "24%", band: "Moderate", factors: "Low dietary iron, Fatigue" },
              { emoji: "⚙️", label: "Iron Deficiency", risk: "38%", band: "Moderate", factors: "Sub-optimal iron density" },
              { emoji: "☀️", label: "Vitamin D Deficiency", risk: "74%", band: "High", factors: "Minimal fortified intake, Sedentary" },
              { emoji: "🧬", label: "Vitamin B12 Deficiency", risk: "28%", band: "Moderate", factors: "Vegetarian baseline" },
              { emoji: "🦴", label: "Calcium Deficiency", risk: "11%", band: "Low", factors: "Adequate curd & paneer intake" },
            ].map((card, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{card.emoji}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      card.band === "High" ? "bg-[#FEE2E2] text-[#DC2626]" : card.band === "Moderate" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#ECFDF5] text-[#059669]"
                    }`}>
                      {card.band}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1C1917]">{card.label}</h4>
                  <p className="text-xl font-extrabold text-[#1C1917] mt-1">{card.risk}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#E8E2D5] text-[10px] text-[#78716C]">
                  <strong>Key Driver:</strong> {card.factors}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onLogin()}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} /> Run Interactive Screening in Portal →
            </button>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES */}
      <section id="features" className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Comprehensive Health Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-[#064E3B] mt-1">
            Engineered for Precision, Safety & Simplicity
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] mt-2">
            Every feature is clinically grounded and safety-filtered for vegetarian, vegan, and allergic individuals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-2xl shadow-xs">
              📔
            </div>
            <h3 className="font-bold text-base font-editorial text-[#064E3B]">
              Intelligent Food Diary & RDA Tracking
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Track breakfast, lunch, snacks, and dinner with an expanded Indian (ICMR-NIN) and USDA database. Live tracking of Iron, B12, Calcium, Vitamin D, and Fiber against clinical RDAs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-2xl shadow-xs">
              🍱
            </div>
            <h3 className="font-bold text-base font-editorial text-[#064E3B]">
              Safety-Aware 7-Day Meal Planner
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Generates complete weekly culinary schedules with a 3-day repetition prevention window. Strictly enforces dietary preferences and excludes declared allergens with 1-click meal swapping.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-2xl shadow-xs">
              🛒
            </div>
            <h3 className="font-bold text-base font-editorial text-[#064E3B]">
              Smart Categorized Grocery Lists
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Automatically aggregates all ingredients across 28 planned weekly meals into interactive checklists categorized by fresh produce, legumes, dairy, and spices with clipboard export.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-2xl shadow-xs">
              ⚖️
            </div>
            <h3 className="font-bold text-base font-editorial text-[#064E3B]">
              Interactive Live BMI & Energy Engine
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Computes Basal Metabolic Rate and Total Daily Energy Expenditure using Mifflin-St Jeor formulas with dynamic calorie adjustments for weight loss, muscle gain, or maintenance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-2xl shadow-xs">
              🩺
            </div>
            <h3 className="font-bold text-base font-editorial text-[#064E3B]">
              Symptom Severity & Lab Diagnostics
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Log clinical blood test biomarkers (Hemoglobin, Vitamin D, B12, Iron, Calcium) with automatic normal/low/high evaluations and weekly symptom severity adjustments.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-2xl shadow-xs">
              📈
            </div>
            <h3 className="font-bold text-base font-editorial text-[#064E3B]">
              Longitudinal Intake & Risk Trends
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Interactive SVG area charts tracking longitudinal caloric stability and deficiency probability recovery trajectories with SQLite persistence and local caching.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="science" className="py-16 md:py-20 px-4 md:px-8 bg-[#F5EFE6] border-y border-[#E8E2D5]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
              Methodology & Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-[#064E3B] mt-1">
              How NutriSense Operates
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-2">
              Three seamless steps from initial dietary logging to personalized clinical nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">1</span>
              <h4 className="font-bold text-sm text-[#064E3B]">Log Meals & Biomarkers</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Enter your meals using the verified food database, report symptom severity, and input recent blood lab results.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">2</span>
              <h4 className="font-bold text-sm text-[#064E3B]">AI Screening & SHAP</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                The trained Random Forest model predicts risk probabilities across 5 targets with explainable feature impacts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D5] shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">3</span>
              <h4 className="font-bold text-sm text-[#064E3B]">Targeted Meal Blueprint</h4>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Receive prioritized recipe recommendations and an anti-repetitive 7-day culinary plan with automated grocery lists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 md:py-20 px-4 md:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0F766E] rounded-3xl p-8 md:p-14 text-white shadow-2xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-3xl mx-auto border border-white/20">
            🥑
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-editorial">
            Take Control of Your Nutritional Health Today
          </h2>
          <p className="text-xs sm:text-sm text-[#ECFDF5] max-w-xl mx-auto opacity-90 leading-relaxed">
            Experience clinical-grade deficiency screening, explainable AI insights, and safety-verified culinary planning.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onLogin()}
              className="px-7 py-3.5 rounded-xl font-bold text-xs md:text-sm bg-white text-[#064E3B] hover:bg-[#ECFDF5] shadow-xl transition-all cursor-pointer"
            >
              Launch NutriSense Portal Now →
            </button>
            <button
              onClick={() => handleQuickLogin("aryan.sharma@nutrisense.ai")}
              className="px-6 py-3.5 rounded-xl font-bold text-xs md:text-sm bg-[#10B981] text-white hover:bg-[#059669] shadow-md transition-all cursor-pointer"
            >
              Instant 1-Click Access
            </button>
          </div>
        </div>
      </section>

      {/* PUBLIC FOOTER */}
      <footer className="border-t border-[#E8E2D5] bg-white py-10 px-4 md:px-8 text-xs text-[#78716C]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥑</span>
            <span className="font-bold text-sm text-[#064E3B] font-editorial">NutriSense</span>
            <span>• Precision Nutrition Intelligence</span>
          </div>

          <p className="text-center md:text-right max-w-md leading-relaxed text-[11px]">
            Medical Disclaimer: NutriSense provides screening estimates and educational meal recommendations. It does not provide medical diagnoses. Always consult a physician or registered dietitian for medical evaluation.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   VIEW 1: DASHBOARD
   ========================================================================= */

function DashboardView({
  profile, totals, targetKcal, macroTargets, caloriePct,
  waterCups, setWaterCups, symptoms, symptomFlagsCount, labsFilledCount,
  riskResults, mealPlan, setPage, onQuickLogFood, onLogRecipeToDiary,
  onLogWholeDayPlan, showToast
}) {
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const bandBadge = (band) => {
    if (band === "High") return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#FCA5A5]" };
    if (band === "Moderate") return { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", border: "border-[#FCD34D]" };
    return { bg: "bg-[#ECFDF5]", text: "text-[#059669]", border: "border-[#A7F3D0]" };
  };

  const todayMeals = mealPlan?.[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0F766E] p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">
              <GreetingIcon size={16} />
              <span>{greeting.text}</span>
              <span>•</span>
              <span>{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-editorial mt-2">
              Welcome back, {profile.name.split(" ")[0]} 🥑
            </h1>
            <p className="text-sm text-[#ECFDF5] mt-1.5 max-w-xl opacity-90 leading-relaxed">
              Your personalized nutrition intelligence center. Today’s goal: <strong>{targetKcal} kcal</strong> with high micronutrient bioavailability.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onQuickLogFood("lunch")}
              className="bg-white text-[#064E3B] hover:bg-[#ECFDF5] px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> Log Meal
            </button>
            <button
              onClick={() => setPage("insights")}
              className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} /> Run Screening
            </button>
          </div>
        </div>

        {/* Ambient Decorative Graphic */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Calorie & Macro Target Ring */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Daily Energy Intake
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#EA580C]">
              {caloriePct}% target
            </span>
          </div>

          <div className="flex items-center justify-around gap-4 my-2">
            {/* SVG Ring Gauge */}
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#F5EFE6" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50" cy="50" r="40"
                  stroke="#EA580C"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * caloriePct) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-[#1C1917] block leading-none">
                  {totals.kcal}
                </span>
                <span className="text-[10px] text-[#78716C] font-semibold">of {targetKcal} kcal</span>
              </div>
            </div>

            {/* Macro Splits */}
            <div className="space-y-2 text-xs w-full max-w-[130px]">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-[#EA580C]">Protein</span>
                  <span>{totals.p}g / {macroTargets.protein}g</span>
                </div>
                <div className="w-full bg-[#F5EFE6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#EA580C] h-full rounded-full"
                    style={{ width: `${Math.min(100, (totals.p / macroTargets.protein) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-[#D97706]">Carbs</span>
                  <span>{totals.c}g / {macroTargets.carbs}g</span>
                </div>
                <div className="w-full bg-[#F5EFE6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D97706] h-full rounded-full"
                    style={{ width: `${Math.min(100, (totals.c / macroTargets.carbs) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-[#059669]">Healthy Fats</span>
                  <span>{totals.f}g / {macroTargets.fat}g</span>
                </div>
                <div className="w-full bg-[#F5EFE6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#059669] h-full rounded-full"
                    style={{ width: `${Math.min(100, (totals.f / macroTargets.fat) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPage("diary")}
            className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-[#064E3B] bg-[#ECFDF5] hover:bg-[#D1FAE5] transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            Open Food Diary <ChevronRight size={14} />
          </button>
        </div>

        {/* Interactive Hydration Tracker */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Hydration Tracker
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#2563EB]">
                {waterCups * 250} / 2000 ml
              </span>
            </div>
            <p className="text-xs text-[#57534E] mb-4">
              Proper hydration directly impacts nutrient absorption and blood volume.
            </p>

            {/* 8 Water Glasses Grid */}
            <div className="grid grid-cols-4 gap-2 my-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((cup) => {
                const filled = cup <= waterCups;
                return (
                  <button
                    key={cup}
                    onClick={() => {
                      const next = cup === waterCups ? cup - 1 : cup;
                      setWaterCups(next);
                      if (next === 8) showToast("Hydration target accomplished for today! 💧✨");
                    }}
                    title={`Glass ${cup} (250 ml)`}
                    className={`py-3 rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                      filled
                        ? "bg-[#2563EB] border-[#1D4ED8] text-white shadow-sm scale-102"
                        : "bg-[#F5EFE6] border-[#E8E2D5] text-[#78716C] hover:bg-[#DBEAFE]/40"
                    }`}
                  >
                    <Droplets size={18} className={filled ? "text-white" : "text-[#93C5FD]"} />
                    <span className="text-[10px] font-bold mt-1">250ml</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => {
                setWaterCups((prev) => Math.min(8, prev + 1));
                showToast("Added 250ml water 💧");
              }}
              className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#DBEAFE] text-[#2563EB] hover:bg-[#BFDBFE] transition-colors cursor-pointer"
            >
              +1 Glass
            </button>
            <button
              onClick={() => setWaterCups(0)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#F5EFE6] text-[#78716C] hover:bg-[#E8E2D5] transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Clinical Profile & Check-in Status */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Clinical Status
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B]">
                Active
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                  <Activity size={16} className="text-[#059669]" />
                  <span>Symptom Alerts</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${symptomFlagsCount ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#ECFDF5] text-[#059669]"}`}>
                  {symptomFlagsCount} reported
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                  <HeartPulse size={16} className="text-[#DC2626]" />
                  <span>Blood Lab Test Values</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#57534E]">
                  {labsFilledCount} / 5 logged
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                  <ShieldCheck size={16} className="text-[#2563EB]" />
                  <span>Dietary Safety Rules</span>
                </div>
                <span className="text-xs font-bold text-[#064E3B]">
                  {profile.dietaryPreference}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPage("symptoms")}
            className="w-full mt-4 py-2 rounded-xl text-xs font-bold border border-[#064E3B] text-[#064E3B] hover:bg-[#ECFDF5] transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            Update Weekly Check-in <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* DEFICIENCY RISK SUMMARY CARD */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <Sparkles size={16} />
              <span>Machine Learning Risk Intelligence</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-editorial text-[#064E3B] mt-1">
              Deficiency Screening Status
            </h2>
          </div>
          <button
            onClick={() => setPage("insights")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#064E3B] text-white hover:bg-[#047857] shadow-sm flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <Sparkles size={14} /> {riskResults ? "Review SHAP Analysis →" : "Run Risk Assessment →"}
          </button>
        </div>

        {riskResults ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {riskResults.map((r) => {
              const meta = LABEL_META[r.label] || { label: r.label, emoji: "🔬" };
              const badge = bandBadge(r.risk_band);
              return (
                <div
                  key={r.label}
                  onClick={() => setPage("insights")}
                  className={`p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer ${badge.bg} ${badge.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{meta.emoji}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.text} bg-white/70`}>
                      {r.risk_band}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-[#1C1917] truncate">{meta.label}</p>
                  <p className="text-lg font-extrabold text-[#1C1917] mt-1">
                    {Math.round(r.risk_probability * 100)}%
                  </p>
                  <div className="w-full bg-black/10 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full ${
                        r.risk_band === "High" ? "bg-[#DC2626]" : r.risk_band === "Moderate" ? "bg-[#D97706]" : "bg-[#059669]"
                      }`}
                      style={{ width: `${Math.round(r.risk_probability * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-dashed border-[#D1FAE5] text-center">
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="font-bold text-sm text-[#064E3B]">Screening Assessment Not Yet Executed</h3>
            <p className="text-xs text-[#57534E] max-w-md mx-auto mt-1 mb-4">
              Run the multi-label Random Forest screening engine to evaluate risks for Anemia, Vitamin D, B12, and Calcium.
            </p>
            <button
              onClick={() => setPage("insights")}
              className="px-5 py-2.5 rounded-xl bg-[#064E3B] text-white text-xs font-bold shadow-md hover:bg-[#047857] inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} /> Run Screening Now
            </button>
          </div>
        )}
      </div>

      {/* TODAY'S MEAL PLAN PREVIEW */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#059669]">
              <Utensils size={15} />
              <span>Personalized Schedule</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-editorial text-[#064E3B] mt-1">
              Today's Recommended Meals
            </h2>
          </div>
          <div className="flex gap-2">
            {todayMeals && (
              <button
                onClick={() => onLogWholeDayPlan(todayMeals)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#064E3B] hover:bg-[#D1FAE5] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={14} /> Log All to Diary
              </button>
            )}
            <button
              onClick={() => setPage("mealplan")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#064E3B] text-[#064E3B] hover:bg-[#ECFDF5] transition-colors flex items-center gap-1 cursor-pointer"
            >
              View 7-Day Plan <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {todayMeals ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEAL_SLOTS_ORDER.map((slot) => {
              const recipe = todayMeals.meals[slot];
              const meta = MEAL_META[slot];
              return (
                <div key={slot} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#78716C] mb-2 font-bold">
                      <span className="flex items-center gap-1">{meta.emoji} {meta.label}</span>
                      <span>{recipe.kcal} kcal</span>
                    </div>
                    <div className="flex items-start gap-3 my-1">
                      <span className="text-3xl p-2 rounded-xl bg-white border border-[#E8E2D5] shadow-xs">
                        {recipe.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-[#1C1917] truncate">{recipe.name}</p>
                        <p className="text-[11px] text-[#57534E] mt-0.5">
                          {recipe.protein}g Protein • {recipe.carbs}g Carbs
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onLogRecipeToDiary(recipe, slot)}
                    className="w-full mt-3 py-1.5 rounded-lg text-[11px] font-bold bg-white hover:bg-[#ECFDF5] border border-[#E8E2D5] text-[#064E3B] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} /> Log to Diary
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#FBF9F5] border border-dashed border-[#D1FAE5] text-center">
            <div className="text-4xl mb-2">🍱</div>
            <p className="text-xs text-[#57534E] mb-3">No active 7-day meal plan generated yet.</p>
            <button
              onClick={() => setPage("mealplan")}
              className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold shadow-md hover:bg-[#047857] inline-flex items-center gap-2 cursor-pointer"
            >
              <Utensils size={14} /> Generate 7-Day Meal Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW 2: FOOD DIARY
   ========================================================================= */

function DiaryView({
  meals, totals, targetKcal, macroTargets, caloriePct, diaryMicros,
  waterCups, setWaterCups, onOpenAddFood, onUpdateQty, onRemoveFood,
  onLoadSampleDay, onClearDiary
}) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const rdaItems = [
    { label: "Iron", current: diaryMicros.iron, target: 15, unit: "mg", color: "bg-[#EA580C]" },
    { label: "Vitamin B12", current: diaryMicros.b12, target: 2.4, unit: "mcg", color: "bg-[#2563EB]" },
    { label: "Calcium", current: diaryMicros.ca, target: 1000, unit: "mg", color: "bg-[#059669]" },
    { label: "Vitamin D", current: diaryMicros.vitd, target: 600, unit: "IU", color: "bg-[#D97706]" },
    { label: "Dietary Fiber", current: totals.fiber, target: 30, unit: "g", color: "bg-[#10B981]" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            {today}
          </span>
          <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
            Food Diary & Nutrition Logs 📔
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onLoadSampleDay}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#064E3B] hover:bg-[#D1FAE5] border border-[#D1FAE5] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkle size={14} /> Load Balanced Day
          </button>
          <button
            onClick={onClearDiary}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F5EFE6] text-[#78716C] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Clear Diary
          </button>
        </div>
      </div>

      {/* Daily Progress Overview Panel */}
      <div className="bg-[#064E3B] text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xs text-[#A7F3D0] uppercase font-bold tracking-wider">Today's Intake</span>
            <p className="text-3xl font-extrabold mt-1">
              {totals.kcal}
              <span className="text-xs text-[#ECFDF5] font-normal opacity-80"> / {targetKcal} kcal</span>
            </p>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#D97706] h-full rounded-full transition-all duration-700"
                style={{ width: `${caloriePct}%` }}
              />
            </div>
            <span className="text-[11px] text-[#A7F3D0] mt-1 block font-semibold">{caloriePct}% of daily budget</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-[#A7F3D0] block">Protein Target</span>
            <span className="text-xl font-bold block mt-1">{totals.p}g</span>
            <span className="text-[10px] text-[#ECFDF5] opacity-70">Goal: {macroTargets.protein}g</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-[#A7F3D0] block">Carbohydrates</span>
            <span className="text-xl font-bold block mt-1">{totals.c}g</span>
            <span className="text-[10px] text-[#ECFDF5] opacity-70">Goal: {macroTargets.carbs}g</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-[#A7F3D0] block">Dietary Fat</span>
            <span className="text-xl font-bold block mt-1">{totals.f}g</span>
            <span className="text-[10px] text-[#ECFDF5] opacity-70">Goal: {macroTargets.fat}g</span>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
            <span className="text-xs text-[#A7F3D0] block">Dietary Fiber</span>
            <span className="text-xl font-bold block mt-1">{totals.fiber}g</span>
            <span className="text-[10px] text-[#ECFDF5] opacity-70">Goal: 30g</span>
          </div>
        </div>

        {/* Micronutrients RDA Progress Strip */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0] mb-3">
            Micronutrient RDA Adequacy
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {rdaItems.map((micro) => {
              const pct = Math.min(100, Math.round((micro.current / micro.target) * 100));
              return (
                <div key={micro.label} className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{micro.label}</span>
                    <span className="text-[#A7F3D0]">{pct}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div className={`${micro.color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-white/70 mt-1 block">
                    {micro.current} / {micro.target} {micro.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MEAL SECTIONS (Breakfast, Lunch, Snacks, Dinner) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MEAL_SLOTS_ORDER.map((slot) => {
          const meta = MEAL_META[slot];
          const slotItems = meals[slot] || [];
          const slotKcal = slotItems.reduce((acc, it) => acc + (it.kcal || 0) * (it.qty || 1), 0);
          const slotProtein = slotItems.reduce((acc, it) => acc + (it.p || 0) * (it.qty || 1), 0);

          return (
            <div key={slot} className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-2 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5]">
                      {meta.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#064E3B]">{meta.label}</h3>
                      <p className="text-[11px] text-[#78716C]">{meta.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#1C1917] block">{slotKcal} kcal</span>
                    <span className="text-[10px] font-semibold text-[#059669]">{Math.round(slotProtein)}g protein</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 mb-4">
                  {slotItems.map((item) => (
                    <div
                      key={item.uid}
                      className="p-3 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{item.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                          <p className="text-[11px] text-[#78716C]">
                            {Math.round(item.kcal * item.qty)} kcal • P {Math.round(item.p * item.qty)}g • C {Math.round(item.c * item.qty)}g • F {Math.round(item.f * item.qty)}g
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onUpdateQty(slot, item.uid, -1)}
                          className="w-6 h-6 rounded-lg bg-white border border-[#E8E2D5] flex items-center justify-center text-[#57534E] hover:bg-[#F5EFE6] cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(slot, item.uid, 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-[#E8E2D5] flex items-center justify-center text-[#57534E] hover:bg-[#F5EFE6] cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => onRemoveFood(slot, item.uid)}
                          className="w-6 h-6 rounded-lg bg-white border border-[#E8E2D5] text-[#78716C] hover:text-[#DC2626] hover:bg-[#FEE2E2] flex items-center justify-center ml-1 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {slotItems.length === 0 && (
                    <div className="py-6 text-center border border-dashed border-[#E8E2D5] rounded-2xl">
                      <p className="text-xs text-[#78716C]">No items logged for {meta.label.toLowerCase()}</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onOpenAddFood(slot)}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#064E3B] hover:bg-[#D1FAE5] border border-[#D1FAE5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={14} /> Add Food to {meta.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW 3: HEALTH PROFILE & BIOMETRICS
   ========================================================================= */

function ProfileView({ draftProfile, setDraftProfile, saveProfile, targetKcal, macroTargets }) {
  const d = draftProfile;
  const update = (patch) => setDraftProfile((prev) => ({ ...prev, ...patch }));

  const toggleArray = (field, item) => {
    const list = d[field] || [];
    const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
    update({ [field]: next });
  };

  // Live BMI Calculation
  const heightM = (parseFloat(d.height) || 170) / 100;
  const weightKg = parseFloat(d.weight) || 68;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  const bmiBand = () => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-[#2563EB]", bg: "bg-[#DBEAFE]" };
    if (bmi < 25.0) return { label: "Normal (Healthy)", color: "text-[#059669]", bg: "bg-[#ECFDF5]" };
    if (bmi < 30.0) return { label: "Overweight", color: "text-[#D97706]", bg: "bg-[#FEF3C7]" };
    return { label: "Obese (Clinical)", color: "text-[#DC2626]", bg: "bg-[#FEE2E2]" };
  };
  const band = bmiBand();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
          Personalized Biometrics
        </span>
        <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
          Health & Nutrition Profile 🩺
        </h1>
        <p className="text-sm text-[#57534E] mt-1">
          Calibrates the Mifflin-St Jeor metabolic formulas, deficiency screening thresholds, and food safety filters.
        </p>
      </div>

      {/* METABOLIC CALCULATION SUMMARY CARD */}
      <div className="bg-gradient-to-br from-[#064E3B] to-[#047857] text-white rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">Computed BMI</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-extrabold">{bmi}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${band.bg} ${band.color}`}>
                {band.label}
              </span>
            </div>
            <p className="text-[11px] text-[#ECFDF5] opacity-80 mt-1">
              Ideal weight range for {d.height} cm: {Math.round(18.5 * heightM * heightM)} – {Math.round(24.9 * heightM * heightM)} kg
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">Target Daily Calories</span>
            <p className="text-2xl font-extrabold mt-1">{targetKcal} kcal</p>
            <p className="text-[11px] text-[#ECFDF5] opacity-80 mt-0.5">
              Based on {d.activity.toLowerCase()} activity & {d.healthGoals[0] || "health goals"}
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">Macronutrient Blueprint</span>
            <p className="text-xs text-[#ECFDF5] mt-1 leading-relaxed">
              <strong>{macroTargets.protein}g</strong> Protein • <strong>{macroTargets.carbs}g</strong> Carbs • <strong>{macroTargets.fat}g</strong> Healthy Fats
            </p>
          </div>
        </div>
      </div>

      {/* FORM INPUTS */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-6">
        <h2 className="text-lg font-bold font-editorial text-[#064E3B]">Core Biometrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#57534E] mb-1.5">Full Name</label>
            <input
              value={d.name}
              onChange={(e) => update({ name: e.target.value })}
              className="w-full rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-sm bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#57534E] mb-1.5">Age (Years)</label>
            <input
              type="number"
              value={d.age}
              onChange={(e) => update({ age: e.target.value })}
              className="w-full rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-sm bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#57534E] mb-1.5">Biological Sex / Gender</label>
            <select
              value={d.gender}
              onChange={(e) => update({ gender: e.target.value })}
              className="w-full rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-sm bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              {["Prefer not to say", "Female", "Male", "Non-binary"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#57534E] mb-1.5">Height (cm)</label>
            <input
              type="number"
              value={d.height}
              onChange={(e) => update({ height: e.target.value })}
              className="w-full rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-sm bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#57534E] mb-1.5">Weight (kg)</label>
            <input
              type="number"
              value={d.weight}
              onChange={(e) => update({ weight: e.target.value })}
              className="w-full rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-sm bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#57534E] mb-1.5">Physical Activity Level</label>
            <select
              value={d.activity}
              onChange={(e) => update({ activity: e.target.value })}
              className="w-full rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-sm bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              {ACTIVITY_LEVELS.map((al) => (
                <option key={al.level} value={al.level}>
                  {al.label} ({al.desc})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dietary Preference Cards */}
        <div className="pt-4 border-t border-[#E8E2D5]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
            🥕 Dietary Preference (Hard Filter)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DIETARY_PREFS.map((pref) => {
              const active = d.dietaryPreference === pref;
              return (
                <button
                  type="button"
                  key={pref}
                  onClick={() => update({ dietaryPreference: pref })}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    active
                      ? "bg-[#064E3B] text-white border-[#064E3B] shadow-md"
                      : "bg-[#FBF9F5] border-[#E8E2D5] text-[#1C1917] hover:bg-[#ECFDF5]"
                  }`}
                >
                  <p className="font-bold text-xs">{pref}</p>
                  <p className={`text-[10px] mt-1 ${active ? "text-[#A7F3D0]" : "text-[#78716C]"}`}>
                    {pref === "Vegan" ? "Pure plant-based" : pref === "Vegetarian" ? "Plant + Dairy" : pref === "Eggetarian" ? "Veg + Farm Eggs" : "All meats & seafood"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergies / Exclusions */}
        <div className="pt-4 border-t border-[#E8E2D5]">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E]">
              🚫 Allergies & Food Exclusions (Strict Safety Filter)
            </label>
            <span className="text-[11px] text-[#78716C]">Guarantees no contaminated recipes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALLERGENS_LIST.map((allergy) => {
              const active = (d.allergies || []).includes(allergy);
              return (
                <button
                  type="button"
                  key={allergy}
                  onClick={() => toggleArray("allergies", allergy)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#DC2626] text-white border-[#DC2626]"
                      : "bg-white text-[#57534E] border-[#E8E2D5] hover:bg-[#FEE2E2]"
                  }`}
                >
                  {active ? `✕ ${allergy}` : `+ ${allergy}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Health Goals */}
        <div className="pt-4 border-t border-[#E8E2D5]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
            🎯 Primary Health Goals
          </label>
          <div className="flex flex-wrap gap-2">
            {HEALTH_GOALS.map((goal) => {
              const active = (d.healthGoals || []).includes(goal);
              return (
                <button
                  type="button"
                  key={goal}
                  onClick={() => toggleArray("healthGoals", goal)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#059669] text-white border-[#059669]"
                      : "bg-white text-[#57534E] border-[#E8E2D5] hover:bg-[#ECFDF5]"
                  }`}
                >
                  {active ? `✓ ${goal}` : goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Medical Conditions */}
        <div className="pt-4 border-t border-[#E8E2D5]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#57534E] mb-2">
            🩺 Documented Medical Conditions
          </label>
          <div className="flex flex-wrap gap-2">
            {MEDICAL_CONDITIONS.map((cond) => {
              const active = (d.medicalConditions || []).includes(cond);
              return (
                <button
                  type="button"
                  key={cond}
                  onClick={() => toggleArray("medicalConditions", cond)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    active
                      ? "bg-[#D97706] text-white border-[#D97706]"
                      : "bg-white text-[#57534E] border-[#E8E2D5] hover:bg-[#FEF3C7]"
                  }`}
                >
                  {cond}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={saveProfile}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#064E3B] text-white hover:bg-[#047857] shadow-lg shadow-[#064E3B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check size={18} /> Save & Recalibrate Profile
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW 4: SYMPTOMS & CLINICAL LABS
   ========================================================================= */

function SymptomsView({ symptoms, setSymptoms, labs, setLabs, showToast }) {
  const handleLoadAnemiaProfile = () => {
    setSymptoms({
      fatigue: "Severe",
      hairLoss: "Moderate",
      skin: "Mild",
      muscleWeakness: "Moderate",
      mood: "Mild",
    });
    setLabs({
      hemoglobin: "10.4", // clinically low
      vitaminD: "14.2",   // deficient
      vitaminB12: "180",  // deficient
      iron: "42",         // low
      calcium: "8.2",     // low
    });
    showToast("Loaded high-deficiency clinical profile 🩸");
  };

  const handleLoadHealthyProfile = () => {
    setSymptoms({
      fatigue: "None",
      hairLoss: "None",
      skin: "None",
      muscleWeakness: "None",
      mood: "None",
    });
    setLabs({
      hemoglobin: "14.5",
      vitaminD: "38.0",
      vitaminB12: "520",
      iron: "115",
      calcium: "9.6",
    });
    showToast("Loaded healthy baseline lab values ✓");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Clinical Grounding
          </span>
          <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
            Symptoms & Blood Lab Diagnostics 🩺
          </h1>
          <p className="text-sm text-[#57534E] mt-1">
            Gives the machine learning engine essential clinical biomarker context beyond food intake logs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleLoadAnemiaProfile}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FCA5A5]/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            Clinical Profile: High Risk
          </button>
          <button
            onClick={handleLoadHealthyProfile}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#064E3B] hover:bg-[#D1FAE5] transition-colors flex items-center gap-1 cursor-pointer"
          >
            Healthy Baseline Profile
          </button>
        </div>
      </div>

      {/* SYMPTOMS QUESTIONNAIRE */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs">
        <h2 className="text-lg font-bold font-editorial text-[#064E3B] mb-1">
          Weekly Symptom Severity Tracker
        </h2>
        <p className="text-xs text-[#57534E] mb-6">
          Severity over the past 7 days directly modifies prior risk distributions in the ML model.
        </p>

        <div className="space-y-4">
          {SYMPTOMS.map((s) => {
            const current = symptoms[s.key] || "None";
            return (
              <div
                key={s.key}
                className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-[#1C1917]">
                    <span className="text-xl">{s.emoji}</span>
                    <span>{s.label}</span>
                    <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded-md">
                      Linked to: {s.affects}
                    </span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1">{s.hint}</p>
                </div>

                <div className="flex gap-1.5">
                  {SEVERITIES.map((sev) => {
                    const active = current === sev;
                    const sevColor = () => {
                      if (sev === "Severe") return "bg-[#DC2626] border-[#DC2626] text-white";
                      if (sev === "Moderate") return "bg-[#D97706] border-[#D97706] text-white";
                      if (sev === "Mild") return "bg-[#F59E0B] border-[#F59E0B] text-white";
                      return "bg-[#064E3B] border-[#064E3B] text-white";
                    };
                    return (
                      <button
                        key={sev}
                        onClick={() => {
                          setSymptoms((prev) => ({ ...prev, [s.key]: sev }));
                          showToast(`Updated ${s.label}: ${sev}`);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                          active
                            ? sevColor()
                            : "bg-white text-[#57534E] border-[#E8E2D5] hover:bg-[#F5EFE6]"
                        }`}
                      >
                        {sev}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOOD TEST VALUES */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold font-editorial text-[#064E3B]">
            Recent Blood Test Lab Values (Biomarkers)
          </h2>
          <span className="text-xs text-[#059669] font-bold">Automatic Range Evaluation</span>
        </div>
        <p className="text-xs text-[#57534E] mb-6">
          Optional reference values. Normal adult clinical ranges shown; always confirm with your laboratory report.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LAB_FIELDS.map((field) => {
            const val = labs[field.key];
            const evalResult = labStatus(val, field.low, field.high);
            return (
              <div key={field.key} className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{field.emoji}</span>
                    <span className="text-xs font-bold text-[#1C1917]">{field.label}</span>
                  </div>
                  {evalResult && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${evalResult.status === "normal" ? "bg-[#ECFDF5] text-[#059669]" : evalResult.status === "low" ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                      {evalResult.label}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    step="0.1"
                    value={val}
                    onChange={(e) => setLabs((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={`${field.low} - ${field.high}`}
                    className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                  <span className="text-xs font-semibold text-[#78716C] shrink-0 w-14">
                    {field.unit}
                  </span>
                </div>
                <p className="text-[10px] text-[#78716C] mt-2">
                  Normal Range: {field.low} – {field.high} {field.unit} • {field.hint}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   VIEW 5: ML RISK INSIGHTS (RANDOM FOREST + SHAP)
   ========================================================================= */

function InsightsView({
  profile, totals, diaryMicros, symptoms, riskResults, setRiskResults,
  backendAlive, setPage, showToast
}) {
  const [loading, setLoading] = useState(false);
  const [engineSource, setEngineSource] = useState(null); // 'api' | 'local'

  const handleRunAssessment = async () => {
    setLoading(true);

    // Prepare payload matching FastAPI PredictRequest
    const heightM = (parseFloat(profile.height) || 170) / 100;
    const weight = parseFloat(profile.weight) || 68;
    const bmi = Math.round((weight / (heightM * heightM)) * 10) / 10;
    const sevMap = { None: 0, Mild: 1, Moderate: 2, Severe: 3 };

    const payload = {
      age: parseInt(profile.age) || 28,
      gender: profile.gender || "Prefer not to say",
      bmi,
      activity_level: profile.activity || "Moderate",
      dietary_preference: profile.dietaryPreference || "Vegetarian",
      avg_kcal: totals.kcal || 2000,
      avg_protein_g: totals.p || 60,
      avg_fiber_g: totals.fiber || 20,
      avg_iron_mg: diaryMicros.iron || 10,
      avg_b12_mcg: diaryMicros.b12 || 2.0,
      avg_calcium_mg: diaryMicros.ca || 700,
      avg_vitamin_d_iu: diaryMicros.vitd || 300,
      symptom_fatigue: sevMap[symptoms.fatigue] || 0,
      symptom_hair_loss: sevMap[symptoms.hairLoss] || 0,
      symptom_skin: sevMap[symptoms.skin] || 0,
      symptom_muscle_weakness: sevMap[symptoms.muscleWeakness] || 0,
      symptom_mood: sevMap[symptoms.mood] || 0,
    };

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000),
      });

      if (!res.ok) throw new Error(`API returned HTTP ${res.status}`);
      const data = await res.json();

      setRiskResults(data.results);
      setEngineSource("api");
      showToast("FastAPI Machine Learning model completed inference with SHAP explanations! ✨");

      // Auto-save snapshot
      fetch(`${API_BASE}/risk/snapshot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ results: data.results }),
      }).catch(() => {});
    } catch {
      // Backend unavailable or timed out — seamlessly execute local surrogate engine
      const localPredictions = runLocalRiskEngine({ profile, diaryMicros, symptoms });
      const formatted = localPredictions.map((lp) => ({
        label: lp.label,
        risk_probability: lp.probability,
        risk_band: lp.band,
        top_factors: lp.factors,
      }));

      setRiskResults(formatted);
      setEngineSource("local");
      showToast("Screening executed using client-side clinical surrogate engine ⚡");
    } finally {
      setLoading(false);
    }
  };

  const bandBadge = (band) => {
    if (band === "High") return { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#FCA5A5]" };
    if (band === "Moderate") return { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", border: "border-[#FCD34D]" };
    return { bg: "bg-[#ECFDF5]", text: "text-[#059669]", border: "border-[#A7F3D0]" };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Clinical AI Screening Model
          </span>
          <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
            Nutrient Deficiency Risk Insights 🔬
          </h1>
          <p className="text-sm text-[#57534E] mt-1">
            Multi-label Random Forest classifier with TreeExplainer SHAP attribution per prediction.
          </p>
        </div>

        <button
          onClick={handleRunAssessment}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-lg shadow-[#064E3B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 self-start sm:self-auto"
        >
          <Sparkles size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Running AI Models..." : "Run Risk Assessment"}
        </button>
      </div>

      {/* Engine Status Banner */}
      {engineSource && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-bold ${
          engineSource === "api"
            ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#064E3B]"
            : "bg-[#FFFBEB] border-[#FCD34D] text-[#B45309]"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-base">{engineSource === "api" ? "🟢" : "⚡"}</span>
            <span>
              {engineSource === "api"
                ? "Live FastAPI ML Server Connection (:8000) • Trained Random Forest + SHAP TreeExplainer"
                : "Standalone Client Engine • Directional Clinical Approximations"}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider opacity-80">
            {engineSource === "api" ? "Validated Model" : "Client Surrogate"}
          </span>
        </div>
      )}

      {/* RISK RESULTS CARDS */}
      {riskResults ? (
        <div className="space-y-4">
          {riskResults.map((result) => {
            const meta = LABEL_META[result.label] || { label: result.label, emoji: "🔬", description: "" };
            const badge = bandBadge(result.risk_band);

            return (
              <div
                key={result.label}
                className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5]">
                      {meta.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-[#1C1917]">{meta.label}</h3>
                      <p className="text-xs text-[#78716C] max-w-lg">{meta.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-[#1C1917] block">
                        {Math.round(result.risk_probability * 100)}%
                      </span>
                      <span className="text-[10px] text-[#78716C] font-semibold">Predicted Risk</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                      {result.risk_band}
                    </span>
                  </div>
                </div>

                {/* Risk Bar Meter */}
                <div className="w-full bg-[#F5EFE6] h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.risk_band === "High"
                        ? "bg-[#DC2626]"
                        : result.risk_band === "Moderate"
                        ? "bg-[#D97706]"
                        : "bg-[#059669]"
                    }`}
                    style={{ width: `${Math.round(result.risk_probability * 100)}%` }}
                  />
                </div>

                {/* SHAP Feature Attribution Impact Bars */}
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2">
                    Key Predictive Drivers (SHAP Feature Importance)
                  </p>
                  <div className="space-y-1.5">
                    {(result.top_factors || []).map((factor, idx) => {
                      const isRiskIncrease = factor.direction ? factor.direction.includes("increases") : true;
                      const impactScore = factor.impact || 0.15;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5] text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className={isRiskIncrease ? "text-[#DC2626]" : "text-[#059669]"}>
                              {isRiskIncrease ? "▲" : "▼"}
                            </span>
                            <span className="font-semibold text-[#1C1917]">
                              {factor.feature || factor.text}
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isRiskIncrease ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#ECFDF5] text-[#059669]"
                          }`}>
                            {factor.direction || "driver"} ({Math.round(impactScore * 100)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Action Footer */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#064E3B] to-[#047857] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Actionable Next Steps</h4>
              <p className="text-xs text-[#ECFDF5] opacity-80 mt-0.5">
                Generate tailored meals targeting these exact micronutrient deficits.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage("recommendations")}
                className="px-4 py-2.5 rounded-xl bg-white text-[#064E3B] font-bold text-xs hover:bg-[#ECFDF5] transition-colors cursor-pointer"
              >
                Food Recommendations →
              </button>
              <button
                onClick={() => setPage("mealplan")}
                className="px-4 py-2.5 rounded-xl bg-[#10B981] text-white font-bold text-xs hover:bg-[#059669] transition-colors cursor-pointer"
              >
                Build 7-Day Meal Plan →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white border border-[#E8E2D5] text-center space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-4xl mx-auto">
            🔬
          </div>
          <h2 className="text-2xl font-bold font-editorial text-[#064E3B]">
            Run Clinical Risk Screening
          </h2>
          <p className="text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
            NutriSense uses a Random Forest classifier trained on 3,000 clinically grounded synthetic patient profiles to estimate multi-label deficiency risks.
          </p>
          <button
            onClick={handleRunAssessment}
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-lg shadow-[#064E3B]/25 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} /> Run Screening Assessment
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   VIEW 6: FOOD RECOMMENDATIONS
   ========================================================================= */

function RecommendationsView({
  profile, riskResults, backendAlive, setPage, onLogRecipeToDiary, showToast
}) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      if (backendAlive) {
        const res = await fetch(`${API_BASE}/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: {
              dietary_preference: profile.dietaryPreference,
              allergies: profile.allergies || [],
            },
            risk_results: riskResults || [],
          }),
          signal: AbortSignal.timeout(5000),
        });

        if (res.ok) {
          const json = await res.json();
          setRecommendations(json.recommendations);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to local filtering
    }

    // Local recommendation calculation
    const recs = [];
    const pool = filterRecipesLocal(profile.dietaryPreference, profile.allergies);
    const atRisk = (riskResults || []).filter((r) => r.risk_band === "High" || r.risk_band === "Moderate");

    atRisk.forEach((risk) => {
      const needed = DEFICIENCY_NUTRIENTS[risk.label] || [];
      const scored = [];
      pool.forEach((recipe) => {
        let score = 0;
        needed.forEach((n) => {
          score += recipe.nutrient_highlights[n] || 0;
        });
        if (score > 0) scored.push({ recipe, score });
      });
      scored.sort((a, b) => b.score - a.score);

      recs.push({
        deficiency: risk.label,
        risk_band: risk.risk_band,
        risk_probability: risk.risk_probability,
        target_nutrients: needed,
        recommended_recipes: scored.slice(0, 4).map((s) => s.recipe),
        alternative_options: scored.slice(4, 8).map((s) => s.recipe),
        note: scored.length === 0 ? "Consider fortified foods or consulting a dietitian." : null,
      });
    });

    if (!recs.length) {
      recs.push({
        deficiency: null,
        risk_band: "Low",
        risk_probability: 0.1,
        target_nutrients: ["iron", "calcium", "vitamin_b12"],
        recommended_recipes: pool.slice(0, 6),
        alternative_options: [],
        note: null,
      });
    }

    setRecommendations(recs);
    setLoading(false);
  }, [backendAlive, profile, riskResults]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Precision Recommender
          </span>
          <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
            Targeted Food Recommendations 🍽️
          </h1>
          <p className="text-sm text-[#57534E] mt-1">
            Matches your detected deficiency risks to nutrient-dense recipes while enforcing{" "}
            <strong>{profile.dietaryPreference}</strong> and excluding declared allergens.
          </p>
        </div>

        <button
          onClick={() => setPage("mealplan")}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Utensils size={14} /> Build 7-Day Meal Plan
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E2D5]">
          <RefreshCw size={24} className="animate-spin text-[#064E3B] mx-auto mb-2" />
          <p className="text-xs font-bold text-[#57534E]">Filtering safe recipes from catalog...</p>
        </div>
      ) : recommendations ? (
        <div className="space-y-6">
          {recommendations.map((rec, idx) => {
            const meta = rec.deficiency ? LABEL_META[rec.deficiency] : { label: "General Balanced Nutrition", emoji: "🥗" };
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{meta.emoji}</span>
                    <div>
                      <h3 className="font-bold text-base text-[#064E3B]">{meta.label}</h3>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {(rec.target_nutrients || []).map((nut) => (
                          <span key={nut} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                            Targets {nut.replace("_", " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {rec.risk_band && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#064E3B] self-start sm:self-auto">
                      {rec.risk_band} Priority
                    </span>
                  )}
                </div>

                {rec.note && (
                  <div className="p-3 rounded-xl bg-[#FEF3C7] text-[#D97706] text-xs font-semibold">
                    ⚠️ {rec.note}
                  </div>
                )}

                {/* Recipe Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {rec.recommended_recipes.map((recipe) => (
                    <RecipeDetailCard
                      key={recipe.id}
                      recipe={recipe}
                      onLogToDiary={onLogRecipeToDiary}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E2D5]">
          <p className="text-xs text-[#78716C]">Run a screening assessment to generate personalized food recommendations.</p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   VIEW 7: 7-DAY MEAL PLANNER
   ========================================================================= */

function MealPlanView({
  profile, riskResults, mealPlan, setMealPlan, backendAlive,
  setPage, onLogRecipeToDiary, onLogWholeDayPlan, showToast
}) {
  const [activeDay, setActiveDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [replacingSlot, setReplacingSlot] = useState(null);
  const [showGroceryList, setShowGroceryList] = useState(false);
  const [checkedGroceries, setCheckedGroceries] = useState({});

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      if (backendAlive) {
        const res = await fetch(`${API_BASE}/meal-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile: {
              dietary_preference: profile.dietaryPreference,
              allergies: profile.allergies || [],
            },
            risk_results: riskResults || [],
            days: 7,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (res.ok) {
          const json = await res.json();
          setMealPlan(json.plan);
          setActiveDay(1);
          setLoading(false);
          showToast("Generated new 7-Day Meal Plan via FastAPI server! 📅");
          return;
        }
      }
    } catch {
      // Local fallback
    }

    const localPlan = generateLocalPlan(profile.dietaryPreference, profile.allergies, riskResults, 7);
    setMealPlan(localPlan);
    setActiveDay(1);
    setLoading(false);
    showToast("Generated 7-Day Meal Plan with 3-day repetition prevention! 📅");
  };

  const handleReplaceMeal = (slot) => {
    if (!mealPlan) return;
    setReplacingSlot(slot);

    // Pick alternate recipe from safe pool
    const pool = filterRecipesLocal(profile.dietaryPreference, profile.allergies, slot);
    const dayData = mealPlan.find((d) => d.day === activeDay);
    const currentId = dayData?.meals[slot]?.id;
    const alternatives = pool.filter((r) => r.id !== currentId);
    const pick = alternatives.length ? alternatives[Math.floor(Math.random() * alternatives.length)] : pool[0];

    setTimeout(() => {
      setMealPlan((prev) =>
        prev.map((d) =>
          d.day === activeDay ? { ...d, meals: { ...d.meals, [slot]: pick } } : d
        )
      );
      setReplacingSlot(null);
      showToast(`Swapped ${MEAL_META[slot].label} with ${pick.name} ✨`);
    }, 300);
  };

  // Compile Smart Grocery List across 7 days
  const groceryList = useMemo(() => {
    if (!mealPlan) return [];
    const itemMap = {};
    mealPlan.forEach((d) => {
      Object.values(d.meals).forEach((meal) => {
        (meal.ingredients || []).forEach((ing) => {
          itemMap[ing] = (itemMap[ing] || 0) + 1;
        });
      });
    });
    return Object.entries(itemMap).map(([name, count]) => ({ name, count }));
  }, [mealPlan]);

  const currentDayData = mealPlan?.find((d) => d.day === activeDay);

  // Day nutrition summary
  const daySummary = useMemo(() => {
    if (!currentDayData) return { kcal: 0, p: 0, c: 0, f: 0 };
    let kcal = 0, p = 0, c = 0, f = 0;
    Object.values(currentDayData.meals).forEach((m) => {
      kcal += m.kcal || 0;
      p += m.protein || 0;
      c += m.carbs || 0;
      f += m.fat || 0;
    });
    return { kcal, p: Math.round(p), c: Math.round(c), f: Math.round(f) };
  }, [currentDayData]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Culinary Planning Engine
          </span>
          <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
            7-Day Clinical Meal Planner 📅
          </h1>
          <p className="text-sm text-[#57534E] mt-1">
            3-day anti-repetition window, hard safety exclusions, and deficiency nutrient targeting.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {mealPlan && (
            <button
              onClick={() => setShowGroceryList(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white border border-[#E8E2D5] text-[#064E3B] hover:bg-[#ECFDF5] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart size={15} /> Smart Grocery List
            </button>
          )}
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {mealPlan ? "Regenerate All 7 Days" : "Generate 7-Day Plan"}
          </button>
        </div>
      </div>

      {mealPlan ? (
        <div className="space-y-6">
          {/* Day Selector Pills & Daily Macro Summary */}
          <div className="bg-white rounded-3xl p-5 border border-[#E8E2D5] shadow-xs space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {mealPlan.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setActiveDay(d.day)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeDay === d.day
                      ? "bg-[#064E3B] text-white shadow-md shadow-[#064E3B]/20 scale-102"
                      : "bg-[#FBF9F5] text-[#57534E] hover:bg-[#E8E2D5] border border-[#E8E2D5]"
                  }`}
                >
                  Day {d.day}
                </button>
              ))}
            </div>

            {/* Nutrition metrics for selected day */}
            <div className="pt-3 border-t border-[#E8E2D5] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-bold text-[#1C1917]">
                <span className="text-[#064E3B]">Day {activeDay} Totals:</span>
                <span className="text-[#EA580C]">{daySummary.kcal} kcal</span>
                <span>{daySummary.p}g Protein</span>
                <span>{daySummary.c}g Carbs</span>
                <span>{daySummary.f}g Fat</span>
              </div>

              <button
                onClick={() => onLogWholeDayPlan(currentDayData)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#ECFDF5] text-[#064E3B] hover:bg-[#D1FAE5] border border-[#A7F3D0] flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 size={14} /> Log Day {activeDay} to Food Diary
              </button>
            </div>
          </div>

          {/* 4 MEAL CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentDayData &&
              MEAL_SLOTS_ORDER.map((slot) => {
                const recipe = currentDayData.meals[slot];
                const meta = MEAL_META[slot];
                const isReplacing = replacingSlot === slot;

                return (
                  <div
                    key={slot}
                    className="bg-white rounded-3xl p-6 border border-[#E8E2D5] shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-2 rounded-xl bg-[#FBF9F5] border border-[#E8E2D5]">
                            {meta.emoji}
                          </span>
                          <div>
                            <h4 className="font-bold text-sm text-[#064E3B]">{meta.label}</h4>
                            <span className="text-[10px] text-[#78716C] uppercase font-bold tracking-wider">
                              {recipe.diet_type}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleReplaceMeal(slot)}
                          disabled={isReplacing}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#EA580C] hover:bg-[#FFEDD5] border border-[#FFEDD5] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw size={12} className={isReplacing ? "animate-spin" : ""} />
                          Swap Meal
                        </button>
                      </div>

                      <RecipeDetailCard recipe={recipe} onLogToDiary={onLogRecipeToDiary} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E2D5] space-y-4 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] text-[#064E3B] flex items-center justify-center text-4xl mx-auto">
            🍱
          </div>
          <h2 className="text-2xl font-bold font-editorial text-[#064E3B]">
            Generate Your 7-Day Meal Plan
          </h2>
          <p className="text-sm text-[#57534E] max-w-md mx-auto leading-relaxed">
            Creates complete breakfast, lunch, snack, and dinner menus tailored to your bio-profile with 3-day repetition prevention.
          </p>
          <button
            onClick={handleGeneratePlan}
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-lg shadow-[#064E3B]/25 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Utensils size={16} /> Generate 7-Day Plan Now
          </button>
        </div>
      )}

      {/* GROCERY LIST MODAL */}
      {showGroceryList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#E8E2D5]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#064E3B]" />
                <h3 className="font-bold text-lg font-editorial text-[#064E3B]">
                  7-Day Grocery Shopping List
                </h3>
              </div>
              <button
                onClick={() => setShowGroceryList(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#F5EFE6] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#78716C] my-3">
              Aggregated across all 28 planned meals. Check off items as you shop in the market:
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {groceryList.map((item) => {
                const checked = !!checkedGroceries[item.name];
                return (
                  <label
                    key={item.name}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      checked
                        ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#78716C] line-through"
                        : "bg-[#FBF9F5] border-[#E8E2D5] text-[#1C1917]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setCheckedGroceries((prev) => ({ ...prev, [item.name]: !checked }))
                        }
                        className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#10B981]"
                      />
                      <span className="text-xs font-bold">{item.name}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#E8E2D5]">
                      {item.count} meals
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E2D5] flex gap-2">
              <button
                onClick={() => {
                  const text = groceryList.map((i) => `• ${i.name} (${i.count}x)`).join("\n");
                  navigator.clipboard.writeText(text);
                  showToast("Grocery list copied to clipboard! 📋");
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} /> Copy to Clipboard
              </button>
              <button
                onClick={() => setCheckedGroceries({})}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#F5EFE6] text-[#78716C] hover:bg-[#E8E2D5] cursor-pointer"
              >
                Uncheck All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   VIEW 8: HISTORY & TREND ANALYTICS
   ========================================================================= */

function HistoryView({ backendAlive, currentTotals, currentMicros, showToast }) {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load history from backend or localStorage
  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      if (backendAlive) {
        const res = await fetch(`${API_BASE}/history?user_id=demo&days=30`, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const json = await res.json();
          setHistoryData(json);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local Storage history
    const saved = localStorage.getItem("nutrisense_mock_history");
    if (saved) {
      setHistoryData(JSON.parse(saved));
    } else {
      // Generate realistic 5-day baseline
      const mock = {
        diary: [
          { date: "Sep 24", kcal: 1820, protein: 58, carbs: 210, fat: 48, iron: 11.2, b12: 1.4, calcium: 680, vitamin_d: 120 },
          { date: "Sep 25", kcal: 1940, protein: 64, carbs: 225, fat: 52, iron: 12.8, b12: 1.8, calcium: 740, vitamin_d: 160 },
          { date: "Sep 26", kcal: 2050, protein: 72, carbs: 240, fat: 55, iron: 14.5, b12: 2.2, calcium: 820, vitamin_d: 220 },
          { date: "Sep 27", kcal: 1890, protein: 66, carbs: 215, fat: 50, iron: 13.0, b12: 1.9, calcium: 790, vitamin_d: 210 },
          { date: "Sep 28", kcal: currentTotals.kcal || 1980, protein: currentTotals.p || 68, carbs: currentTotals.c || 220, fat: currentTotals.f || 52, iron: currentMicros.iron || 13.5, b12: currentMicros.b12 || 2.1, calcium: currentMicros.ca || 810, vitamin_d: currentMicros.vitd || 250 },
        ],
        risk: [
          { date: "Sep 24", label: "anemia_risk", probability: 0.44, band: "Moderate" },
          { date: "Sep 25", label: "anemia_risk", probability: 0.38, band: "Moderate" },
          { date: "Sep 26", label: "anemia_risk", probability: 0.28, band: "Moderate" },
          { date: "Sep 27", label: "anemia_risk", probability: 0.22, band: "Moderate" },
          { date: "Sep 28", label: "anemia_risk", probability: 0.16, band: "Low" },
        ],
        has_sufficient_history: true,
        note: "Estimated trend trajectories based on logged intake snapshots.",
      };
      setHistoryData(mock);
      localStorage.setItem("nutrisense_mock_history", JSON.stringify(mock));
    }
    setLoading(false);
  }, [backendAlive, currentTotals, currentMicros]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handlePopulateSampleHistory = () => {
    const mock = {
      diary: [
        { date: "Sep 22", kcal: 1750, protein: 52, carbs: 200, fat: 45, iron: 9.8, b12: 1.2, calcium: 610, vitamin_d: 90 },
        { date: "Sep 23", kcal: 1820, protein: 56, carbs: 210, fat: 48, iron: 10.5, b12: 1.3, calcium: 650, vitamin_d: 110 },
        { date: "Sep 24", kcal: 1910, protein: 62, carbs: 220, fat: 50, iron: 12.1, b12: 1.6, calcium: 720, vitamin_d: 150 },
        { date: "Sep 25", kcal: 1980, protein: 66, carbs: 230, fat: 54, iron: 13.4, b12: 1.9, calcium: 790, vitamin_d: 190 },
        { date: "Sep 26", kcal: 2050, protein: 74, carbs: 245, fat: 56, iron: 14.8, b12: 2.3, calcium: 840, vitamin_d: 240 },
        { date: "Sep 27", kcal: 2010, protein: 70, carbs: 235, fat: 52, iron: 14.1, b12: 2.1, calcium: 820, vitamin_d: 220 },
        { date: "Sep 28", kcal: currentTotals.kcal || 2080, protein: currentTotals.p || 72, carbs: currentTotals.c || 240, fat: currentTotals.f || 55, iron: currentMicros.iron || 15.2, b12: currentMicros.b12 || 2.4, calcium: currentMicros.ca || 890, vitamin_d: currentMicros.vitd || 280 },
      ],
      risk: [
        { date: "Sep 22", label: "anemia_risk", probability: 0.58, band: "High" },
        { date: "Sep 23", label: "anemia_risk", probability: 0.52, band: "High" },
        { date: "Sep 24", label: "anemia_risk", probability: 0.42, band: "Moderate" },
        { date: "Sep 25", label: "anemia_risk", probability: 0.35, band: "Moderate" },
        { date: "Sep 26", label: "anemia_risk", probability: 0.26, band: "Moderate" },
        { date: "Sep 27", label: "anemia_risk", probability: 0.20, band: "Low" },
        { date: "Sep 28", label: "anemia_risk", probability: 0.14, band: "Low" },
      ],
      has_sufficient_history: true,
      note: "Continuous improvement detected! Iron and Vitamin D levels show progressive recovery.",
    };
    setHistoryData(mock);
    localStorage.setItem("nutrisense_mock_history", JSON.stringify(mock));
    showToast("Populated 7-day realistic clinical trajectory data! 📈");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
            Longitudinal Analytics
          </span>
          <h1 className="text-3xl font-bold font-editorial text-[#064E3B] mt-1">
            Historical Intake & Risk Trends 📈
          </h1>
          <p className="text-sm text-[#57534E] mt-1">
            Tracks longitudinal recovery trends across caloric balance and multi-label deficiency probabilities.
          </p>
        </div>

        <button
          onClick={handlePopulateSampleHistory}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <TrendingUp size={14} /> Load Sample 7-Day Trend
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E2D5]">
          <RefreshCw size={24} className="animate-spin text-[#064E3B] mx-auto mb-2" />
          <p className="text-xs font-bold text-[#57534E]">Loading SQLite historical snapshots...</p>
        </div>
      ) : historyData ? (
        <div className="space-y-6">
          {/* Caloric Intake Trend Chart */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-[#064E3B]">Daily Caloric Intake vs 2,000 kcal Target</h3>
                <p className="text-xs text-[#78716C]">Energy stability curve over logged days</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFEDD5] text-[#EA580C]">
                Calorie Curve
              </span>
            </div>

            <InteractiveAreaChart
              points={historyData.diary.map((d) => ({
                label: d.date.split("T")[0] || d.date,
                value: d.kcal || 1800,
              }))}
              strokeColor="#EA580C"
              fillColor="rgba(234, 88, 12, 0.12)"
              targetLine={2000}
              unit="kcal"
            />
          </div>

          {/* Anemia / Deficiency Risk Trajectory */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E8E2D5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-[#064E3B]">Deficiency Probability Trajectory</h3>
                <p className="text-xs text-[#78716C]">Clinical risk trajectory declining as micronutrient density increases</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669]">
                Risk % Decrease
              </span>
            </div>

            <InteractiveAreaChart
              points={historyData.risk.map((r) => ({
                label: r.date.split("T")[0] || r.date,
                value: Math.round((r.probability || 0.3) * 100),
              }))}
              strokeColor="#059669"
              fillColor="rgba(5, 150, 105, 0.12)"
              targetLine={20}
              unit="%"
            />
          </div>

          {/* Macro Split Historical Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] text-center shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Average Protein</span>
              <p className="text-2xl font-extrabold text-[#EA580C] mt-1">
                {Math.round(historyData.diary.reduce((a, b) => a + (b.protein || 0), 0) / historyData.diary.length)}g
              </p>
              <span className="text-[11px] text-[#78716C]">Sufficient for lean tissue recovery</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] text-center shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Average Iron Intake</span>
              <p className="text-2xl font-extrabold text-[#D97706] mt-1">
                {round(historyData.diary.reduce((a, b) => a + (b.iron || 0), 0) / historyData.diary.length, 1)} mg
              </p>
              <span className="text-[11px] text-[#78716C]">RDA Goal: 15.0 mg/day</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E8E2D5] text-center shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Average Calcium</span>
              <p className="text-2xl font-extrabold text-[#059669] mt-1">
                {Math.round(historyData.diary.reduce((a, b) => a + (b.calcium || 0), 0) / historyData.diary.length)} mg
              </p>
              <span className="text-[11px] text-[#78716C]">RDA Goal: 1000 mg/day</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E8E2D5]">
          <p className="text-xs text-[#78716C]">Log at least 3 daily entries to generate longitudinal trend charts.</p>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   CUSTOM REUSABLE SUB-COMPONENTS
   ========================================================================= */

function RecipeDetailCard({ recipe, onLogToDiary }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-[#FBF9F5] border border-[#E8E2D5] flex flex-col justify-between transition-all hover:border-[#10B981]">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-white border border-[#E8E2D5] shadow-xs">
              {recipe.emoji}
            </span>
            <div>
              <h4 className="font-bold text-xs text-[#1C1917] leading-tight">{recipe.name}</h4>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                {recipe.kcal} kcal • {recipe.protein}g Protein • {recipe.carbs}g Carbs
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#E8E2D5] text-[#064E3B] shrink-0">
            {recipe.diet_type}
          </span>
        </div>

        {/* Expandable Ingredients & Instructions */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-[#E8E2D5] space-y-2 text-[11px] text-[#57534E]">
            <div>
              <strong className="text-[#064E3B]">Ingredients:</strong>{" "}
              {recipe.ingredients.join(", ")}
            </div>
            <div>
              <strong className="text-[#064E3B]">Preparation:</strong> {recipe.instructions}
            </div>
            {recipe.allergens.length > 0 && (
              <div className="text-[#DC2626] font-semibold">
                Contains allergens: {recipe.allergens.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 flex items-center justify-between gap-2 border-t border-[#E8E2D5]/60">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-bold text-[#059669] hover:underline cursor-pointer"
        >
          {expanded ? "Hide Recipe Details" : "View Cooking Method"}
        </button>

        <button
          onClick={() => onLogToDiary(recipe)}
          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#064E3B] text-white hover:bg-[#047857] shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus size={12} /> Log to Diary
        </button>
      </div>
    </div>
  );
}

function InteractiveAreaChart({ points, strokeColor, fillColor, targetLine, unit }) {
  if (!points || points.length === 0) return null;

  const width = 600;
  const height = 180;
  const padX = 40;
  const padY = 25;

  const values = points.map((p) => p.value);
  const minVal = Math.min(...values, targetLine ? targetLine * 0.8 : 0);
  const maxVal = Math.max(...values, targetLine ? targetLine * 1.2 : 100);
  const range = maxVal - minVal || 1;

  const coords = points.map((p, idx) => {
    const x = padX + (idx / Math.max(1, points.length - 1)) * (width - padX * 2);
    const y = height - padY - ((p.value - minVal) / range) * (height - padY * 2);
    return { x, y, ...p };
  });

  const polylineStr = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const polygonStr = `${coords[0].x},${height - padY} ${polylineStr} ${coords[coords.length - 1].x},${height - padY}`;

  const targetY = targetLine
    ? height - padY - ((targetLine - minVal) / range) * (height - padY * 2)
    : null;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
        {/* Fill Area with Gradient */}
        <polygon points={polygonStr} fill={fillColor} />

        {/* Target Line */}
        {targetY && (
          <line
            x1={padX}
            y1={targetY}
            x2={width - padX}
            y2={targetY}
            stroke="#9CA3AF"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        )}

        {/* Main Line */}
        <polyline
          points={polylineStr}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="5" fill="#FFFFFF" stroke={strokeColor} strokeWidth="2.5" />
            <text x={c.x} y={c.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1C1917">
              {c.value}{unit}
            </text>
            <text x={c.x} y={height - 8} textAnchor="middle" fontSize="9" fontWeight="600" fill="#78716C">
              {c.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function AddFoodModal({ slot, onClose, onAddFood, customFoods, onSaveCustomFood }) {
  const [activeTab, setActiveTab] = useState("search"); // 'search' | 'custom'
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [portionQty, setPortionQty] = useState(1);

  // Custom food fields
  const [cName, setCName] = useState("");
  const [cEmoji, setCEmoji] = useState("🍲");
  const [cKcal, setCKcal] = useState("");
  const [cP, setCP] = useState("");
  const [cC, setCC] = useState("");
  const [cF, setCF] = useState("");
  const [cIron, setCIron] = useState("");

  const categories = ["All", "Grains", "Dals", "Dairy", "Protein", "Veggies", "Fruits", "Snacks"];

  const combinedCatalog = useMemo(() => {
    return [...FOOD_DB, ...customFoods];
  }, [customFoods]);

  const filteredFoods = useMemo(() => {
    return combinedCatalog.filter((f) => {
      const matchQuery = f.name.toLowerCase().includes(query.toLowerCase());
      const matchCat = selectedCategory === "All" || f.category === selectedCategory;
      return matchQuery && matchCat;
    });
  }, [combinedCatalog, query, selectedCategory]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!cName || !cKcal) return;

    const newFood = {
      id: `custom-${Date.now()}`,
      name: cName,
      emoji: cEmoji || "🍲",
      kcal: parseFloat(cKcal) || 0,
      p: parseFloat(cP) || 0,
      c: parseFloat(cC) || 0,
      f: parseFloat(cF) || 0,
      iron: parseFloat(cIron) || 0,
      tag: "Custom Item",
      category: "Snacks",
    };

    onSaveCustomFood(newFood);
    onAddFood(newFood, portionQty);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2D5]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
              Add to {MEAL_META[slot].label}
            </span>
            <h3 className="font-bold text-lg font-editorial text-[#064E3B]">
              Select or Create Food 🍎
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#F5EFE6] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-[#F5EFE6] rounded-xl my-4">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "search" ? "bg-white text-[#064E3B] shadow-xs" : "text-[#78716C]"
            }`}
          >
            Search Nutrient Database
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "custom" ? "bg-white text-[#064E3B] shadow-xs" : "text-[#78716C]"
            }`}
          >
            + Create Custom Food
          </button>
        </div>

        {activeTab === "search" ? (
          <>
            {/* Search Input & Category Pills */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3 text-[#78716C]" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search food, e.g. Roti, Paneer, Chicken, Dal..."
                  className="w-full rounded-xl border border-[#E8E2D5] pl-10 pr-4 py-2.5 text-xs bg-[#FBF9F5] outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#064E3B] text-white"
                        : "bg-[#F5EFE6] text-[#57534E] hover:bg-[#E8E2D5]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Serving Size Multiplier */}
            <div className="flex items-center justify-between text-xs font-bold text-[#57534E] px-1 mb-2">
              <span>Portion Quantity:</span>
              <div className="flex items-center gap-1.5">
                {[0.5, 1, 1.5, 2].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPortionQty(m)}
                    className={`px-2.5 py-0.5 rounded-lg text-[11px] cursor-pointer ${
                      portionQty === m
                        ? "bg-[#059669] text-white"
                        : "bg-[#F5EFE6] text-[#78716C] hover:bg-[#E8E2D5]"
                    }`}
                  >
                    {m}x
                  </button>
                ))}
              </div>
            </div>

            {/* Foods List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => onAddFood(food, portionQty)}
                  className="p-3 rounded-2xl bg-[#FBF9F5] hover:bg-[#ECFDF5] border border-[#E8E2D5] hover:border-[#A7F3D0] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{food.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917]">{food.name}</p>
                      <p className="text-[11px] text-[#78716C]">
                        {Math.round(food.kcal * portionQty)} kcal • P {round(food.p * portionQty)}g • C {round(food.c * portionQty)}g
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1 rounded-lg text-xs font-bold bg-[#064E3B] text-white">
                    Add
                  </button>
                </div>
              ))}

              {filteredFoods.length === 0 && (
                <div className="py-8 text-center text-xs text-[#78716C]">
                  No matches found for "{query}". Try creating a custom item!
                </div>
              )}
            </div>
          </>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1">
                <label className="block text-[11px] font-bold text-[#57534E] mb-1">Emoji</label>
                <input
                  value={cEmoji}
                  onChange={(e) => setCEmoji(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E2D5] p-2 text-center text-lg bg-[#FBF9F5]"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-[11px] font-bold text-[#57534E] mb-1">Item Name</label>
                <input
                  required
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  placeholder="e.g. Grandma's Besan Chilla"
                  className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-xs bg-[#FBF9F5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#57534E] mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  required
                  value={cKcal}
                  onChange={(e) => setCKcal(e.target.value)}
                  placeholder="240"
                  className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-xs bg-[#FBF9F5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#57534E] mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={cP}
                  onChange={(e) => setCP(e.target.value)}
                  placeholder="12"
                  className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-xs bg-[#FBF9F5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#57534E] mb-1">Carbohydrates (g)</label>
                <input
                  type="number"
                  value={cC}
                  onChange={(e) => setCC(e.target.value)}
                  placeholder="28"
                  className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-xs bg-[#FBF9F5]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#57534E] mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={cF}
                  onChange={(e) => setCF(e.target.value)}
                  placeholder="6"
                  className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-xs bg-[#FBF9F5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#57534E] mb-1">Iron (optional, mg)</label>
              <input
                type="number"
                value={cIron}
                onChange={(e) => setCIron(e.target.value)}
                placeholder="2.0"
                className="w-full rounded-xl border border-[#E8E2D5] px-3 py-2 text-xs bg-[#FBF9F5]"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-xl font-bold text-xs bg-[#064E3B] text-white hover:bg-[#047857] shadow-md transition-colors cursor-pointer"
            >
              Save Custom Item & Log
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
