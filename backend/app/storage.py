"""NutriSense — Milestone 3: lightweight persistence for history/trend views."""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "nutrisense.db"
DB_PATH.parent.mkdir(exist_ok=True)


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""CREATE TABLE IF NOT EXISTS diary_snapshots(
        user_id TEXT, date TEXT, kcal REAL, protein REAL, carbs REAL, fat REAL,
        iron REAL, b12 REAL, calcium REAL, vitamin_d REAL,
        UNIQUE(user_id, date)
    )""")
    conn.execute("""CREATE TABLE IF NOT EXISTS risk_snapshots(
        user_id TEXT, date TEXT, label TEXT, probability REAL, band TEXT
    )""")
    return conn


def save_diary_snapshot(user_id, date, totals, micros):
    conn = get_conn()
    conn.execute(
        """INSERT INTO diary_snapshots(user_id,date,kcal,protein,carbs,fat,iron,b12,calcium,vitamin_d)
           VALUES (?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(user_id,date) DO UPDATE SET
             kcal=excluded.kcal, protein=excluded.protein, carbs=excluded.carbs, fat=excluded.fat,
             iron=excluded.iron, b12=excluded.b12, calcium=excluded.calcium, vitamin_d=excluded.vitamin_d""",
        (user_id, date, totals["kcal"], totals["protein"], totals["carbs"], totals["fat"],
         micros["iron"], micros["b12"], micros["calcium"], micros["vitamin_d"]),
    )
    conn.commit()
    conn.close()


def save_risk_snapshot(user_id, date, results):
    conn = get_conn()
    conn.execute("DELETE FROM risk_snapshots WHERE user_id=? AND date=?", (user_id, date))
    for r in results:
        conn.execute(
            "INSERT INTO risk_snapshots(user_id,date,label,probability,band) VALUES (?,?,?,?,?)",
            (user_id, date, r["label"], r["risk_probability"], r["risk_band"]),
        )
    conn.commit()
    conn.close()


def get_history(user_id, days=30):
    conn = get_conn()
    cur = conn.execute(
        "SELECT date,kcal,protein,carbs,fat,iron,b12,calcium,vitamin_d FROM diary_snapshots "
        "WHERE user_id=? ORDER BY date DESC LIMIT ?", (user_id, days),
    )
    cols = ["date", "kcal", "protein", "carbs", "fat", "iron", "b12", "calcium", "vitamin_d"]
    diary = [dict(zip(cols, row)) for row in cur.fetchall()]

    cur2 = conn.execute(
        "SELECT date,label,probability,band FROM risk_snapshots "
        "WHERE user_id=? ORDER BY date DESC LIMIT ?", (user_id, days * 5),
    )
    risk = [dict(zip(["date", "label", "probability", "band"], row)) for row in cur2.fetchall()]
    conn.close()
    return {"diary": list(reversed(diary)), "risk": list(reversed(risk))}
