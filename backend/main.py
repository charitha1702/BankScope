
from functools import lru_cache
from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="BankScope API",
    description="Beyond the Balance Sheet",
    version="1.0.0",
)

# Allow requests from the local frontend and deployed Netlify frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://bankscopee.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data" / "raw"

NUMERIC_COLUMNS = [
    "ASSET", "LIAB", "DEP", "EQ", "NETINC",
    "ROA", "ROE", "NIMY"
]

DISPLAY_COLUMNS = [
    "CERT", "NAME", "CITY", "STALP", "BKCLASS",
    "ASSET", "LIAB", "DEP", "EQ", "NETINC",
    "ROA", "ROE", "NIMY"
]


@lru_cache(maxsize=2)
def load_data(quarter: str):
    if quarter not in ["Q1", "Q2"]:
        raise ValueError("Quarter must be Q1 or Q2")

    file_path = DATA_DIR / f"{quarter}.csv"

    if not file_path.exists():
        raise FileNotFoundError(f"{quarter}.csv not found")

    df = pd.read_csv(file_path, low_memory=False)

    df["CERT"] = (
        df["CERT"]
        .astype("string")
        .str.replace(r"\.0$", "", regex=True)
    )

    for column in NUMERIC_COLUMNS:
        if column in df.columns:
            df[column] = pd.to_numeric(
                df[column], errors="coerce"
            )

    return df


def safe_number(value):
    if pd.isna(value):
        return None
    return float(value)


def clean_records(df):
    return (
        df.astype(object)
        .where(pd.notna(df), None)
        .to_dict(orient="records")
    )


def get_quarter_summary(quarter):
    df = load_data(quarter)

    return {
        "quarter": quarter,
        "institution_count": int(len(df)),
        "total_assets": safe_number(df["ASSET"].sum()),
        "total_deposits": safe_number(df["DEP"].sum()),
        "total_equity": safe_number(df["EQ"].sum()),
        "median_roa": safe_number(df["ROA"].median()),
        "median_roe": safe_number(df["ROE"].median()),
        "median_nimy": safe_number(df["NIMY"].median()),
    }


@app.get("/")
def home():
    return {
        "project": "BankScope",
        "tagline": "Beyond the Balance Sheet",
        "status": "running",
    }


@app.get("/api/overview")
def overview():
    q1 = load_data("Q1")
    q2 = load_data("Q2")

    matched = (
        set(q1["CERT"].dropna())
        & set(q2["CERT"].dropna())
    )

    return {
        "project": "BankScope",
        "quarters": {
            "Q1": get_quarter_summary("Q1"),
            "Q2": get_quarter_summary("Q2"),
        },
        "matched_institutions": len(matched),
    }


@app.get("/api/quarterly-summary")
def quarterly_summary():
    return {
        "Q1": get_quarter_summary("Q1"),
        "Q2": get_quarter_summary("Q2"),
    }


@app.get("/api/institutions")
def search_institutions(
    quarter: str = Query(default="Q2"),
    search: str = Query(default=""),
    limit: int = Query(default=20, ge=1, le=100),
):
    if quarter not in ["Q1", "Q2"]:
        raise HTTPException(
            status_code=400,
            detail="Quarter must be Q1 or Q2",
        )

    df = load_data(quarter)
    df = df[DISPLAY_COLUMNS].copy()

    if search.strip():
        search = search.strip()

        mask = (
            df["CERT"].str.contains(
                search, case=False, na=False
            )
            | df["NAME"].astype("string").str.contains(
                search, case=False, na=False
            )
        )

        df = df[mask]

    return {
        "quarter": quarter,
        "count": min(len(df), limit),
        "institutions": clean_records(
            df.head(limit)
        ),
    }


@app.get("/api/institutions/{cert}/comparison")
def institution_comparison(cert: str):
    results = {}

    for quarter in ["Q1", "Q2"]:
        df = load_data(quarter)

        institution = df[df["CERT"] == cert]

        if institution.empty:
            results[quarter] = None
        else:
            results[quarter] = clean_records(
                institution[DISPLAY_COLUMNS].head(1)
            )[0]

    if results["Q1"] is None and results["Q2"] is None:
        raise HTTPException(
            status_code=404,
            detail="Institution not found",
        )

    return {
        "certificate_number": cert,
        "comparison": results,
    }
