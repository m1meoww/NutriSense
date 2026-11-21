import React, { useState, useMemo } from "react";
import {
  Home, BookOpen, Heart, Activity, Sparkles, LogOut, Plus, X,
  ChevronRight, Flame, Droplets, Check, ArrowLeft, Minus
} from "lucide-react";

/* ---------------------------------------------------------------
   NutriSense — AI-Powered Nutrition Intelligence
   Milestone 1: User Health Profile & Dietary Diary System
   (Week 1: registration + health profile + food diary shell
    Week 2: food diary CRUD + symptom assessment + blood-test input)
--------------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`;

const TOKENS = {
  cream: "#FBF5E9",
  creamDeep: "#F3E9D4",
  forest: "#1F3D2B",
  forestDeep: "#16301F",
  sage: "#8FAE8B",
  sageLight: "#DCE8D6",
  coral: "#E2703A",
  coralLight: "#F6D9C7",
  gold: "#DFA94C",
  goldLight: "#F5E4BC",
  ink: "#2B2A22",
  inkSoft: "#6B6858",
};

/* ---------------- Reference data ---------------- */

// Macros as before, plus 4 micronutrients (iron mg, b12 mcg, calcium mg, vitamin D IU)
// per serving — these feed the deficiency-risk engine on the ML Insights page.
const FOOD_DB = [
  { id: "roti", name: "Roti / Chapati", emoji: "🫓", kcal: 120, p: 3.5, c: 18, f: 3, iron: 1.2, b12: 0, ca: 10, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "dal", name: "Dal, cooked", emoji: "🥣", kcal: 116, p: 7, c: 20, f: 0.4, iron: 2.5, b12: 0, ca: 28, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "rice", name: "Rice, cooked", emoji: "🍚", kcal: 130, p: 2.7, c: 28, f: 0.3, iron: 0.4, b12: 0, ca: 6, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "poha", name: "Poha", emoji: "🍛", kcal: 180, p: 4, c: 32, f: 4, iron: 1.8, b12: 0, ca: 15, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "paneer", name: "Paneer", emoji: "🧀", kcal: 265, p: 18, c: 6, f: 20, iron: 0.3, b12: 0.4, ca: 480, vitd: 4, tag: "ICMR-NIN IFCT" },
  { id: "milk", name: "Cow milk", emoji: "🥛", kcal: 61, p: 3.2, c: 4.8, f: 3.3, iron: 0.1, b12: 0.4, ca: 113, vitd: 25, tag: "ICMR-NIN IFCT" },
  { id: "egg", name: "Boiled egg", emoji: "🥚", kcal: 78, p: 6.3, c: 0.6, f: 5.3, iron: 0.9, b12: 0.6, ca: 25, vitd: 41, tag: "USDA" },
  { id: "banana", name: "Banana", emoji: "🍌", kcal: 105, p: 1.3, c: 27, f: 0.4, iron: 0.3, b12: 0, ca: 6, vitd: 0, tag: "USDA" },
  { id: "idli", name: "Idli (2 pcs)", emoji: "⚪", kcal: 78, p: 2.6, c: 16, f: 0.4, iron: 0.7, b12: 0, ca: 20, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "dosa", name: "Plain Dosa", emoji: "🌯", kcal: 168, p: 3.9, c: 29, f: 4, iron: 1.1, b12: 0, ca: 18, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "sabzi", name: "Mixed Sabzi", emoji: "🥘", kcal: 140, p: 3.5, c: 14, f: 8, iron: 1.4, b12: 0, ca: 40, vitd: 0, tag: "ICMR-NIN IFCT" },
  { id: "chicken", name: "Chicken curry", emoji: "🍗", kcal: 220, p: 22, c: 6, f: 12, iron: 1.3, b12: 0.3, ca: 22, vitd: 3, tag: "USDA" },
  { id: "salad", name: "Cucumber-tomato salad", emoji: "🥗", kcal: 45, p: 1.5, c: 9, f: 0.3, iron: 0.5, b12: 0, ca: 20, vitd: 0, tag: "USDA" },
  { id: "almonds", name: "Almonds (10 pcs)", emoji: "🌰", kcal: 70, p: 2.6, c: 2.5, f: 6, iron: 0.6, b12: 0, ca: 30, vitd: 0, tag: "USDA" },
  { id: "curd", name: "Curd / Dahi", emoji: "🥣", kcal: 60, p: 3.5, c: 4.7, f: 3.1, iron: 0.1, b12: 0.3, ca: 120, vitd: 2, tag: "ICMR-NIN IFCT" },
  { id: "oats", name: "Oats, cooked", emoji: "🥣", kcal: 150, p: 5, c: 27, f: 3, iron: 1.7, b12: 0, ca: 50, vitd: 0, tag: "USDA" },
  { id: "apple", name: "Apple", emoji: "🍎", kcal: 95, p: 0.5, c: 25, f: 0.3, iron: 0.2, b12: 0, ca: 11, vitd: 0, tag: "USDA" },
  { id: "tea", name: "Tea with milk", emoji: "☕", kcal: 55, p: 1.5, c: 8, f: 2, iron: 0.1, b12: 0.1, ca: 30, vitd: 5, tag: "ICMR-NIN IFCT" },
];

/* ---- Milestone 2: client-side deficiency-risk engine ----
   Mirrors the trained Random Forest model's real SHAP drivers (see the
   nutrisense-ml backend: reports/shap_top_features.json) so the frontend
   demo tracks the same signal directions without needing a live server
   call from inside the artifact sandbox. Swap this for a fetch() to your
   running FastAPI /predict endpoint when you deploy the real backend. */
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const RISK_TARGETS = { iron: 15, b12: 2.4, calcium: 900, vitd: 400 };

function runRiskEngine({ profile, diaryMicros, symptoms }) {
  const age = parseFloat(profile.age) || 30;
  const isFemale = profile.gender === "Female";
  const isVegan = profile.dietaryPreference === "Vegan";
  const isVeg = profile.dietaryPreference === "Vegetarian" || isVegan;
  const sedentary = profile.activity === "Sedentary" || profile.activity === "Light";
  const sevNum = (k) => ({ None: 0, Mild: 1, Moderate: 2, Severe: 3 }[symptoms[k]] || 0);

  const gap = (val, target) => 1 - Math.min(1.4, (val || 0) / target);

  const build = (label, emoji, logit, factors) => {
    const p = Math.max(0.02, Math.min(0.97, sigmoid(logit)));
    const band = p < 0.2 ? "Low" : p < 0.5 ? "Moderate" : "High";
    const top = factors.filter((f) => f.on).sort((a, b) => b.w - a.w).slice(0, 3);
    return { label, emoji, probability: p, band, factors: top.length ? top : [{ text: "No strong risk drivers detected", w: 0 }] };
  };

  const ironGap = gap(diaryMicros.iron, RISK_TARGETS.iron);
  const b12Gap = gap(diaryMicros.b12, RISK_TARGETS.b12);
  const caGap = gap(diaryMicros.ca, RISK_TARGETS.calcium);
  const vitdGap = gap(diaryMicros.vitd, RISK_TARGETS.vitd);

  return [
    build("Anemia risk", "🩸",
      2.0 * ironGap + (isFemale ? 0.5 : 0) + 0.15 * sevNum("fatigue") - 1.0,
      [
        { text: "Low logged iron intake", w: ironGap, on: ironGap > 0.2 },
        { text: "Biological sex (higher iron needs)", w: isFemale ? 0.5 : 0, on: isFemale },
        { text: "Reported fatigue", w: 0.15 * sevNum("fatigue"), on: sevNum("fatigue") > 0 },
      ]),
    build("Iron deficiency", "⚙️",
      2.2 * ironGap + (isFemale ? 0.6 : 0) + 0.15 * sevNum("fatigue") + 0.15 * sevNum("hairLoss") - 1.0,
      [
        { text: "Low logged iron intake", w: ironGap, on: ironGap > 0.2 },
        { text: "Biological sex (higher iron needs)", w: isFemale ? 0.6 : 0, on: isFemale },
        { text: "Reported fatigue / hair loss", w: 0.15 * (sevNum("fatigue") + sevNum("hairLoss")), on: sevNum("fatigue") + sevNum("hairLoss") > 0 },
      ]),
    build("Vitamin D deficiency", "☀️",
      2.0 * vitdGap + (sedentary ? 0.5 : 0) + 0.15 * sevNum("muscleWeakness") - 1.0,
      [
        { text: "Low logged vitamin D intake", w: vitdGap, on: vitdGap > 0.2 },
        { text: "Low activity / sun exposure proxy", w: sedentary ? 0.5 : 0, on: sedentary },
        { text: "Reported muscle weakness", w: 0.15 * sevNum("muscleWeakness"), on: sevNum("muscleWeakness") > 0 },
      ]),
    build("B12 deficiency", "🧬",
      2.5 * b12Gap + (isVegan ? 0.8 : isVeg ? 0.3 : 0) + 0.02 * Math.max(0, age - 50) + 0.15 * sevNum("mood") - 1.0,
      [
        { text: "Low logged B12 intake", w: b12Gap, on: b12Gap > 0.2 },
        { text: "Vegan / vegetarian diet (B12 mainly in animal foods)", w: isVegan ? 0.8 : isVeg ? 0.3 : 0, on: isVeg },
        { text: "Reported mood-related symptoms", w: 0.15 * sevNum("mood"), on: sevNum("mood") > 0 },
      ]),
    build("Calcium deficiency", "🦴",
      2.0 * caGap + 0.05 * Math.max(0, age - 30) + 0.1 * sevNum("muscleWeakness") - 0.9,
      [
        { text: "Low logged calcium intake", w: caGap, on: caGap > 0.2 },
        { text: "Age-related risk", w: 0.05 * Math.max(0, age - 30), on: age > 30 },
        { text: "Reported muscle weakness", w: 0.1 * sevNum("muscleWeakness"), on: sevNum("muscleWeakness") > 0 },
      ]),
  ];
}

const MEAL_META = {
  breakfast: { label: "Breakfast", emoji: "🌅" },
  lunch: { label: "Lunch", emoji: "☀️" },
  snack: { label: "Snacks", emoji: "🍎" },
  dinner: { label: "Dinner", emoji: "🌙" },
};

const MEDICAL_CONDITIONS = ["None", "Diabetes", "Hypertension", "High Cholesterol", "Thyroid", "PCOS", "Anemia"];
const DIETARY_PREFS = ["Vegetarian", "Vegan", "Eggetarian", "Non-Vegetarian"];
const HEALTH_GOALS = ["Weight loss", "Muscle gain", "Weight maintenance", "Healthy eating", "Improve energy"];
const ACTIVITY_LEVELS = ["Sedentary", "Light", "Moderate", "Active", "Very active"];

const SYMPTOMS = [
  { key: "fatigue", label: "Fatigue", emoji: "😴", hint: "Feeling tired even after resting" },
  { key: "hairLoss", label: "Hair loss", emoji: "💇", hint: "More shedding than usual" },
  { key: "skin", label: "Skin conditions", emoji: "🧴", hint: "Dryness, rashes, or pale skin" },
  { key: "muscleWeakness", label: "Muscle weakness", emoji: "💪", hint: "Reduced strength or endurance" },
  { key: "mood", label: "Mood-related symptoms", emoji: "🌥️", hint: "Low mood, irritability, brain fog" },
];
const SEVERITIES = ["None", "Mild", "Moderate", "Severe"];

const LAB_FIELDS = [
  { key: "hemoglobin", label: "Hemoglobin", unit: "g/dL", low: 12, high: 16, emoji: "🩸" },
  { key: "vitaminD", label: "Vitamin D", unit: "ng/mL", low: 20, high: 50, emoji: "☀️" },
  { key: "vitaminB12", label: "Vitamin B12", unit: "pg/mL", low: 200, high: 900, emoji: "🧬" },
  { key: "iron", label: "Iron", unit: "µg/dL", low: 60, high: 170, emoji: "⚙️" },
  { key: "calcium", label: "Calcium", unit: "mg/dL", low: 8.5, high: 10.5, emoji: "🦴" },
];

/* ---------------- small helpers ---------------- */

function labStatus(value, low, high) {
  if (value === "" || value === null || value === undefined) return null;
  const v = parseFloat(value);
  if (Number.isNaN(v)) return null;
  if (v < low) return "low";
  if (v > high) return "high";
  return "normal";
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", emoji: "🌅" };
  if (h < 17) return { text: "Good afternoon", emoji: "☀️" };
  return { text: "Good evening", emoji: "🌙" };
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-semibold transition-colors border"
      style={{
        background: active ? TOKENS.forest : "#fff",
        color: active ? TOKENS.cream : TOKENS.ink,
        borderColor: active ? TOKENS.forest : TOKENS.sageLight,
      }}
    >
      {children}
    </button>
  );
}

function SectionCard({ children, style }) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 border"
      style={{ background: "#fff", borderColor: TOKENS.sageLight, ...style }}
    >
      {children}
    </div>
  );
}

/* ---------------- App ---------------- */

export default function NutriSense() {
  const [page, setPage] = useState("login");
  const [loginEmail, setLoginEmail] = useState("demo@nutrisense.app");
  const [loginPass, setLoginPass] = useState("");

  const [profile, setProfile] = useState({
    name: "", age: "", gender: "Prefer not to say", height: "", weight: "",
    activity: "Moderate", medicalConditions: [], dietaryPreference: "Vegetarian",
    healthGoals: [],
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [draftProfile, setDraftProfile] = useState(profile);

  const [meals, setMeals] = useState({ breakfast: [], lunch: [], snack: [], dinner: [] });
  const [addFoodMeal, setAddFoodMeal] = useState(null);
  const [foodSearch, setFoodSearch] = useState("");

  const [symptoms, setSymptoms] = useState(
    Object.fromEntries(SYMPTOMS.map((s) => [s.key, "None"]))
  );
  const [labs, setLabs] = useState(
    Object.fromEntries(LAB_FIELDS.map((l) => [l.key, ""]))
  );

  /* ---- derived nutrition ---- */
  const totals = useMemo(() => {
    let kcal = 0, p = 0, c = 0, f = 0;
    Object.values(meals).forEach((list) =>
      list.forEach((item) => {
        kcal += item.kcal * item.qty;
        p += item.p * item.qty;
        c += item.c * item.qty;
        f += item.f * item.qty;
      })
    );
    return { kcal: Math.round(kcal), p: Math.round(p), c: Math.round(c), f: Math.round(f) };
  }, [meals]);

  const diaryMicros = useMemo(() => {
    let iron = 0, b12 = 0, ca = 0, vitd = 0;
    Object.values(meals).forEach((list) =>
      list.forEach((item) => {
        iron += (item.iron || 0) * item.qty;
        b12 += (item.b12 || 0) * item.qty;
        ca += (item.ca || 0) * item.qty;
        vitd += (item.vitd || 0) * item.qty;
      })
    );
    return { iron: Math.round(iron * 10) / 10, b12: Math.round(b12 * 10) / 10, ca: Math.round(ca), vitd: Math.round(vitd) };
  }, [meals]);

  const targetKcal = useMemo(() => {
    const { age, gender, height, weight, activity } = profile;
    if (!age || !height || !weight) return 2000;
    const a = parseFloat(age), h = parseFloat(height), w = parseFloat(weight);
    let bmr = 10 * w + 6.25 * h - 5 * a + (gender === "Male" ? 5 : gender === "Female" ? -161 : -78);
    const mult = { Sedentary: 1.2, Light: 1.375, Moderate: 1.55, Active: 1.725, "Very active": 1.9 };
    return Math.round(bmr * (mult[activity] || 1.4));
  }, [profile]);

  const pct = Math.min(100, Math.round((totals.kcal / targetKcal) * 100));

  const symptomFlags = Object.values(symptoms).filter((v) => v !== "None").length;
  const labsFilled = LAB_FIELDS.filter((l) => labs[l.key] !== "").length;

  /* ---- handlers ---- */
  function handleLogin(e) {
    e.preventDefault();
    setPage("dashboard");
  }
  function saveProfile() {
    setProfile(draftProfile);
    setProfileSaved(true);
    setPage("dashboard");
  }
  function addFood(food) {
    const entry = { ...food, uid: `${food.id}-${Date.now()}`, qty: 1 };
    setMeals((m) => ({ ...m, [addFoodMeal]: [...m[addFoodMeal], entry] }));
  }
  function updateQty(mealKey, uid, delta) {
    setMeals((m) => ({
      ...m,
      [mealKey]: m[mealKey]
        .map((it) => (it.uid === uid ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
    }));
  }
  function removeFood(mealKey, uid) {
    setMeals((m) => ({ ...m, [mealKey]: m[mealKey].filter((it) => it.uid !== uid) }));
  }

  /* ---------------- LOGIN ---------------- */
  if (page === "login") {
    return (
      <div
        className="min-h-[640px] w-full flex items-center justify-center p-6"
        style={{ background: `radial-gradient(circle at 20% 20%, ${TOKENS.sageLight}, ${TOKENS.cream} 60%)`, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <style>{FONT_IMPORT}</style>
        <div className="w-full max-w-sm rounded-[2rem] p-8 shadow-xl border" style={{ background: "#fff", borderColor: TOKENS.sageLight }}>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="text-5xl mb-2">🥑</div>
            <p className="text-xs tracking-wide font-semibold" style={{ color: TOKENS.sage }}>nutrition intelligence</p>
            <h1 className="text-3xl mt-1" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>
              Eat well. Feel better. 💚
            </h1>
            <p className="text-sm mt-2" style={{ color: TOKENS.inkSoft }}>
              Build a healthier relationship with food, one meal at a time.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: TOKENS.sageLight }}
              placeholder="Email"
            />
            <input
              type="password"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none"
              style={{ borderColor: TOKENS.sageLight }}
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full rounded-xl py-3 font-semibold flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              style={{ background: TOKENS.forest, color: TOKENS.cream }}
            >
              Login <ChevronRight size={18} />
            </button>
          </form>
          <p className="text-center text-xs mt-5" style={{ color: TOKENS.inkSoft }}>
            Demo mode · Milestone 1
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- SHELL (sidebar + page) ---------------- */
  const nav = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "diary", label: "Food Diary", icon: BookOpen },
    { key: "profile", label: "Health Profile", icon: Heart },
    { key: "symptoms", label: "Symptoms & Labs", icon: Activity },
    { key: "insights", label: "ML Risk Insights", icon: Sparkles },
  ];

  return (
    <div
      className="min-h-[720px] w-full flex flex-col md:flex-row"
      style={{ background: TOKENS.cream, fontFamily: "'Plus Jakarta Sans', sans-serif", color: TOKENS.ink }}
    >
      <style>{FONT_IMPORT}</style>

      {/* Sidebar */}
      <aside
        className="md:w-64 w-full flex md:flex-col justify-between p-5 md:p-6 md:rounded-r-[2rem] shrink-0"
        style={{ background: TOKENS.forest, color: TOKENS.cream }}
      >
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🥑</span>
            <div>
              <p className="font-bold leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>NutriSense</p>
              <p className="text-[11px] opacity-70">nutrition intelligence</p>
            </div>
          </div>
          <nav className="hidden md:flex flex-col gap-1">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = page === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setPage(n.key)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    background: active ? TOKENS.cream : "transparent",
                    color: active ? TOKENS.forest : TOKENS.cream,
                    opacity: active ? 1 : 0.85,
                  }}
                >
                  <Icon size={18} /> {n.label}
                </button>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => setPage("login")}
          className="hidden md:flex items-center gap-2 text-sm opacity-70 hover:opacity-100 px-4 py-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-3" style={{ background: TOKENS.forestDeep }}>
        {nav.map((n) => {
          const Icon = n.icon;
          const active = page === n.key;
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap"
              style={{ background: active ? TOKENS.cream : "transparent", color: active ? TOKENS.forest : TOKENS.cream }}
            >
              <Icon size={14} /> {n.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto">
        {page === "dashboard" && (
          <DashboardView
            profile={profile} profileSaved={profileSaved} totals={totals} targetKcal={targetKcal}
            pct={pct} symptomFlags={symptomFlags} labsFilled={labsFilled} setPage={setPage}
          />
        )}
        {page === "profile" && (
          <ProfileView draftProfile={draftProfile} setDraftProfile={setDraftProfile} saveProfile={saveProfile} />
        )}
        {page === "diary" && (
          <DiaryView
            meals={meals} totals={totals} targetKcal={targetKcal} pct={pct}
            setAddFoodMeal={setAddFoodMeal} updateQty={updateQty} removeFood={removeFood}
          />
        )}
        {page === "symptoms" && (
          <SymptomsView symptoms={symptoms} setSymptoms={setSymptoms} labs={labs} setLabs={setLabs} />
        )}
        {page === "insights" && (
          <InsightsView
            totals={totals} symptomFlags={symptomFlags} labsFilled={labsFilled}
            profile={profile} profileSaved={profileSaved} diaryMicros={diaryMicros} symptoms={symptoms}
          />
        )}
      </main>

      {/* Add food modal */}
      {addFoodMeal && (
        <AddFoodModal
          mealKey={addFoodMeal}
          onClose={() => { setAddFoodMeal(null); setFoodSearch(""); }}
          onAdd={(f) => addFood(f)}
          search={foodSearch}
          setSearch={setFoodSearch}
        />
      )}
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function DashboardView({ profile, profileSaved, totals, targetKcal, pct, symptomFlags, labsFilled, setPage }) {
  const g = greeting();
  const r = 54, c = 2 * Math.PI * r;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-sm" style={{ color: TOKENS.inkSoft }}>{g.text}{profile.name ? `, ${profile.name}` : ""} {g.emoji}</p>
        <h1 className="text-3xl" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>Your nutrition today 🥗</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <SectionCard style={{ gridColumn: "span 1" }}>
          <div className="flex items-center gap-6">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} fill="none" stroke={TOKENS.sageLight} strokeWidth="12" />
              <circle
                cx="60" cy="60" r={r} fill="none" stroke={TOKENS.coral} strokeWidth="12"
                strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
                strokeLinecap="round" transform="rotate(-90 60 60)"
              />
              <text x="60" y="56" textAnchor="middle" fontSize="20" fontWeight="700" fill={TOKENS.forest}>{totals.kcal}</text>
              <text x="60" y="74" textAnchor="middle" fontSize="10" fill={TOKENS.inkSoft}>of {targetKcal} kcal</text>
            </svg>
            <div className="space-y-1 text-sm">
              <p><span style={{ color: TOKENS.coral }}>●</span> {totals.p}g protein</p>
              <p><span style={{ color: TOKENS.gold }}>●</span> {totals.c}g carbs</p>
              <p><span style={{ color: TOKENS.sage }}>●</span> {totals.f}g fat</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.sage }}>Health profile</p>
          {profileSaved ? (
            <>
              <p className="text-lg font-semibold mt-2" style={{ color: TOKENS.forest }}>{profile.age}y · {profile.gender}</p>
              <p className="text-sm mt-1" style={{ color: TOKENS.inkSoft }}>{profile.height} cm · {profile.weight} kg · {profile.activity}</p>
              <p className="text-sm mt-1" style={{ color: TOKENS.inkSoft }}>Goal: {profile.healthGoals.join(", ") || "—"}</p>
            </>
          ) : (
            <>
              <p className="text-sm mt-2" style={{ color: TOKENS.inkSoft }}>Let's personalize your nutrition — it only takes a minute.</p>
              <button onClick={() => setPage("profile")} className="mt-4 text-sm font-semibold px-4 py-2 rounded-full" style={{ background: TOKENS.forest, color: TOKENS.cream }}>
                Complete profile 🥑
              </button>
            </>
          )}
        </SectionCard>

        <SectionCard>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.sage }}>Symptoms &amp; labs</p>
          <p className="text-lg font-semibold mt-2" style={{ color: TOKENS.forest }}>{symptomFlags} symptom{symptomFlags === 1 ? "" : "s"} flagged</p>
          <p className="text-sm mt-1" style={{ color: TOKENS.inkSoft }}>{labsFilled}/5 lab values logged</p>
          <button onClick={() => setPage("symptoms")} className="mt-4 text-sm font-semibold px-4 py-2 rounded-full border" style={{ borderColor: TOKENS.forest, color: TOKENS.forest }}>
            Update check-in
          </button>
        </SectionCard>
      </div>

      <SectionCard style={{ background: TOKENS.forest, color: TOKENS.cream, border: "none" }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif" }}><Sparkles size={18} /> Deficiency risk engine — coming in Milestone 2</p>
            <p className="text-sm opacity-80 mt-1 max-w-xl">Your food diary, symptom check-ins, and lab values are being prepared for the ML model — Random Forest &amp; XGBoost with SHAP explainability.</p>
          </div>
          <button onClick={() => setPage("insights")} className="text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap" style={{ background: TOKENS.cream, color: TOKENS.forest }}>
            Preview →
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Health Profile ---------------- */

function ProfileView({ draftProfile, setDraftProfile, saveProfile }) {
  const d = draftProfile, set = (patch) => setDraftProfile({ ...d, ...patch });
  const toggle = (key, val) => {
    const list = d[key].includes(val) ? d[key].filter((v) => v !== val) : [...d[key], val];
    set({ [key]: list });
  };
  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.sage }}>Your health context 💚</p>
      <h1 className="text-3xl mb-2" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>Let's personalize your nutrition</h1>
      <p className="text-sm mb-6" style={{ color: TOKENS.inkSoft }}>This becomes the foundation for future nutrition calculations and AI recommendations.</p>

      <SectionCard>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Name"><input value={d.name} onChange={(e) => set({ name: e.target.value })} className="input" placeholder="Your name" /></Field>
          <Field label="Age"><input type="number" value={d.age} onChange={(e) => set({ age: e.target.value })} className="input" placeholder="24" /></Field>
          <Field label="Gender">
            <select value={d.gender} onChange={(e) => set({ gender: e.target.value })} className="input">
              {["Prefer not to say", "Female", "Male", "Non-binary"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Height (cm)"><input type="number" value={d.height} onChange={(e) => set({ height: e.target.value })} className="input" placeholder="172" /></Field>
          <Field label="Weight (kg)"><input type="number" value={d.weight} onChange={(e) => set({ weight: e.target.value })} className="input" placeholder="68" /></Field>
          <Field label="Activity level">
            <select value={d.activity} onChange={(e) => set({ activity: e.target.value })} className="input">
              {ACTIVITY_LEVELS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </Field>
        </div>

        <p className="text-sm font-semibold mt-6 mb-2" style={{ color: TOKENS.forest }}>🩺 Medical conditions</p>
        <div className="flex flex-wrap gap-2">
          {MEDICAL_CONDITIONS.map((m) => (
            <Chip key={m} active={d.medicalConditions.includes(m)} onClick={() => toggle("medicalConditions", m)}>{m}</Chip>
          ))}
        </div>

        <p className="text-sm font-semibold mt-6 mb-2" style={{ color: TOKENS.forest }}>🥕 Dietary preference</p>
        <div className="flex flex-wrap gap-2">
          {DIETARY_PREFS.map((p) => (
            <Chip key={p} active={d.dietaryPreference === p} onClick={() => set({ dietaryPreference: p })}>{p}</Chip>
          ))}
        </div>

        <p className="text-sm font-semibold mt-6 mb-2" style={{ color: TOKENS.forest }}>🎯 Health goal</p>
        <div className="flex flex-wrap gap-2">
          {HEALTH_GOALS.map((h) => (
            <Chip key={h} active={d.healthGoals.includes(h)} onClick={() => toggle("healthGoals", h)}>{h}</Chip>
          ))}
        </div>

        <button
          onClick={saveProfile}
          className="mt-8 w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          style={{ background: TOKENS.forest, color: TOKENS.cream }}
        >
          Save profile ✨
        </button>
      </SectionCard>
      <style>{`.input{width:100%;border:1px solid ${TOKENS.sageLight};border-radius:0.75rem;padding:0.65rem 0.9rem;font-size:0.9rem;outline:none;background:#fff}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold" style={{ color: TOKENS.forest }}>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/* ---------------- Food Diary ---------------- */

function DiaryView({ meals, totals, targetKcal, pct, setAddFoodMeal, updateQty, removeFood }) {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="max-w-4xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.sage }}>{today}</p>
      <h1 className="text-3xl mb-5" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>Your Food Diary 📔</h1>

      <div className="rounded-3xl p-6 mb-6 grid grid-cols-2 sm:grid-cols-5 gap-4" style={{ background: TOKENS.forest, color: TOKENS.cream }}>
        <div className="col-span-2 sm:col-span-1">
          <p className="text-xs opacity-70">Today's intake</p>
          <p className="text-3xl font-bold">{totals.kcal}<span className="text-sm font-normal opacity-70"> / {targetKcal} kcal</span></p>
          <div className="w-full h-1.5 rounded-full mt-2" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: TOKENS.gold }} />
          </div>
        </div>
        <Stat label="Protein" value={`${totals.p}g`} />
        <Stat label="Carbs" value={`${totals.c}g`} />
        <Stat label="Fat" value={`${totals.f}g`} />
        <Stat label="Fiber" value="—" />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {Object.entries(MEAL_META).map(([key, meta]) => (
          <SectionCard key={key}>
            <p className="font-semibold mb-3 flex items-center gap-2" style={{ color: TOKENS.forest }}>
              <span className="text-lg">{meta.emoji}</span> {meta.label}
            </p>
            <div className="space-y-2">
              {meals[key].map((item) => (
                <div key={item.uid} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: TOKENS.creamDeep }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs" style={{ color: TOKENS.inkSoft }}>{item.kcal * item.qty} kcal · {item.tag}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => updateQty(key, item.uid, -1)} className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ borderColor: TOKENS.sageLight }}><Minus size={12} /></button>
                    <span className="text-xs w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(key, item.uid, 1)} className="w-6 h-6 rounded-full flex items-center justify-center border" style={{ borderColor: TOKENS.sageLight }}><Plus size={12} /></button>
                    <button onClick={() => removeFood(key, item.uid)} className="w-6 h-6 rounded-full flex items-center justify-center ml-1" style={{ color: TOKENS.coral }}><X size={14} /></button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setAddFoodMeal(key)}
                className="w-full rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1"
                style={{ background: TOKENS.sageLight, color: TOKENS.forest }}
              >
                <Plus size={14} /> Add food
              </button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs opacity-70">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function AddFoodModal({ mealKey, onClose, onAdd, search, setSearch }) {
  const results = FOOD_DB.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(31,61,43,0.45)" }}>
      <div className="w-full max-w-md rounded-3xl p-6 max-h-[85vh] flex flex-col" style={{ background: "#fff" }}>
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-xl font-semibold flex items-center gap-2" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>
            Add food <span>🍎</span>
          </h2>
          <button onClick={onClose}><X size={20} color={TOKENS.inkSoft} /></button>
        </div>
        <p className="text-xs mb-3" style={{ color: TOKENS.inkSoft }}>to {MEAL_META[mealKey].label} · Search Indian foods or USDA foods.</p>
        <input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search food, e.g. roti, rice, oats..."
          className="w-full rounded-xl border px-4 py-3 text-sm mb-3 outline-none"
          style={{ borderColor: TOKENS.sageLight }}
        />
        <div className="overflow-y-auto flex-1 space-y-1 -mx-2 px-2">
          {results.map((f) => (
            <button
              key={f.id}
              onClick={() => { onAdd(f); onClose(); }}
              className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-opacity-60 text-left"
              style={{ background: TOKENS.creamDeep }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{f.emoji}</span>
                <div>
                  <p className="text-sm font-semibold">{f.name}</p>
                  <p className="text-xs" style={{ color: TOKENS.inkSoft }}>{f.kcal} kcal · P {f.p}g · C {f.c}g · F {f.f}g</p>
                </div>
              </div>
              <ChevronRight size={16} color={TOKENS.sage} />
            </button>
          ))}
          {results.length === 0 && <p className="text-sm text-center py-6" style={{ color: TOKENS.inkSoft }}>No matches — try another search.</p>}
        </div>
        <p className="text-[11px] mt-3 pt-3 border-t" style={{ color: TOKENS.inkSoft, borderColor: TOKENS.sageLight }}>
          Indian reference data: ICMR-NIN IFCT. USDA integration is available through the backend scaffold.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Symptoms & Labs ---------------- */

function SymptomsView({ symptoms, setSymptoms, labs, setLabs }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.sage }}>Weekly check-in</p>
        <h1 className="text-3xl" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>Symptoms &amp; Labs 🩺</h1>
        <p className="text-sm mt-1" style={{ color: TOKENS.inkSoft }}>This helps the deficiency engine understand how you're feeling, not just what you eat.</p>
      </div>

      <SectionCard>
        <p className="font-semibold mb-4" style={{ color: TOKENS.forest }}>How have you been feeling? 🌤️</p>
        <div className="space-y-4">
          {SYMPTOMS.map((s) => (
            <div key={s.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm font-semibold flex items-center gap-2"><span className="text-lg">{s.emoji}</span> {s.label}</p>
                <p className="text-xs" style={{ color: TOKENS.inkSoft }}>{s.hint}</p>
              </div>
              <div className="flex gap-1.5">
                {SEVERITIES.map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSymptoms({ ...symptoms, [s.key]: sev })}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                    style={{
                      background: symptoms[s.key] === sev ? TOKENS.coral : "#fff",
                      color: symptoms[s.key] === sev ? "#fff" : TOKENS.ink,
                      borderColor: symptoms[s.key] === sev ? TOKENS.coral : TOKENS.sageLight,
                    }}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <p className="font-semibold mb-1" style={{ color: TOKENS.forest }}>Latest blood test values 💉</p>
        <p className="text-xs mb-4" style={{ color: TOKENS.inkSoft }}>Optional — leave blank if you don't have recent results. General adult reference ranges shown; always confirm with your lab report.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {LAB_FIELDS.map((l) => {
            const status = labStatus(labs[l.key], l.low, l.high);
            const color = status === "low" ? TOKENS.coral : status === "high" ? TOKENS.gold : status === "normal" ? TOKENS.sage : TOKENS.inkSoft;
            return (
              <label key={l.key} className="block">
                <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: TOKENS.forest }}>
                  <span>{l.emoji}</span> {l.label} <span className="text-xs font-normal" style={{ color: TOKENS.inkSoft }}>({l.unit})</span>
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={labs[l.key]}
                    onChange={(e) => setLabs({ ...labs, [l.key]: e.target.value })}
                    placeholder={`${l.low}–${l.high}`}
                    className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: TOKENS.sageLight }}
                  />
                  {status && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: `${color}22`, color }}>
                      {status === "normal" ? "Normal ✓" : status === "low" ? "Low" : "High"}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- ML Insights (Milestone 2: deficiency-risk engine) ---------------- */

function InsightsView({ totals, symptomFlags, labsFilled, profile, profileSaved, diaryMicros, symptoms }) {
  const [ran, setRan] = useState(false);
  const results = useMemo(
    () => (ran ? runRiskEngine({ profile, diaryMicros, symptoms }) : null),
    [ran, profile, diaryMicros, symptoms]
  );
  const bandColor = (band) => (band === "High" ? TOKENS.coral : band === "Moderate" ? TOKENS.gold : TOKENS.sage);

  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.sage }}>Milestone 2</p>
      <h1 className="text-3xl mb-2" style={{ fontFamily: "'Fraunces', serif", color: TOKENS.forest }}>ML Risk Insights ✨</h1>
      <p className="text-sm mb-6" style={{ color: TOKENS.inkSoft }}>
        Estimates deficiency risk from your health profile, food diary and symptom check-in — the same signals
        (and directions of effect) as the trained Random Forest model in the NutriSense backend.
      </p>

      {!profileSaved && (
        <SectionCard style={{ marginBottom: "1.25rem" }}>
          <p className="text-sm" style={{ color: TOKENS.inkSoft }}>
            🥑 Complete your health profile first for a more accurate assessment — right now it'll assume defaults.
          </p>
        </SectionCard>
      )}

      {!ran && (
        <SectionCard>
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🤖</div>
            <p className="font-semibold text-lg" style={{ color: TOKENS.forest }}>Ready to run your risk assessment</p>
            <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: TOKENS.inkSoft }}>
              Uses today's food diary ({totals.kcal} kcal logged) and your latest symptom check-in
              ({symptomFlags} flagged) to estimate risk across 5 deficiency categories.
            </p>
            <button
              onClick={() => setRan(true)}
              className="mt-5 px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
              style={{ background: TOKENS.forest, color: TOKENS.cream }}
            >
              <Sparkles size={16} /> Run risk assessment
            </button>
          </div>
        </SectionCard>
      )}

      {ran && results && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setRan(false)} className="text-xs font-semibold flex items-center gap-1" style={{ color: TOKENS.inkSoft }}>
              <ArrowLeft size={12} /> reset
            </button>
          </div>
          {results.map((r) => (
            <SectionCard key={r.label}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="font-semibold flex items-center gap-2" style={{ color: TOKENS.forest }}>
                  <span className="text-lg">{r.emoji}</span> {r.label}
                </p>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${bandColor(r.band)}22`, color: bandColor(r.band) }}>
                  {r.band} · {Math.round(r.probability * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full mt-3 mb-3" style={{ background: TOKENS.sageLight }}>
                <div className="h-2 rounded-full" style={{ width: `${Math.round(r.probability * 100)}%`, background: bandColor(r.band) }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {r.factors.map((f, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: TOKENS.creamDeep, color: TOKENS.inkSoft }}>
                    {f.text}
                  </span>
                ))}
              </div>
            </SectionCard>
          ))}
          <p className="text-xs text-center pt-2" style={{ color: TOKENS.inkSoft }}>
            Estimated risk from a screening model — not a diagnosis. High risk means: consider getting the relevant blood test. 💛
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl p-5 text-sm" style={{ background: TOKENS.forest, color: TOKENS.cream }}>
        <p className="font-semibold flex items-center gap-2 mb-1"><Sparkles size={15} /> How this connects to the real model</p>
        <p className="opacity-80">
          This screen runs a lightweight version of the risk logic in your browser. The full pipeline —
          synthetic-but-clinically-grounded training data, a Random Forest vs. XGBoost comparison, and
          per-prediction SHAP explanations — lives in a separate FastAPI service (<code>POST /predict</code>)
          that you can run locally and point this app at.
        </p>
      </div>
    </div>
  );
}
