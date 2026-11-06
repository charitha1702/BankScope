# BankScope
### Beyond the Balance Sheet

BankScope is an FDIC bank-level financial research and analytics platform examining financial performance, profitability, risk indicators, and institutional differences across Q1 and Q2 2026.

## Research Scope
- Quarterly financial analysis of FDIC-insured institutions.
- Q1 and Q2 2026 financial comparisons.
- Matched-institution analysis using FDIC Certificate Number (CERT).
- Profitability analysis using ROA, ROE, and NIMY.
- Institution-size comparisons and statistical testing.
- Risk and stability screening.

## Technology Stack
- Frontend: React, Vite, Tailwind CSS, Recharts, Lucide React
- Backend: Python, FastAPI, Pandas, NumPy, SciPy
- Analysis: Jupyter Notebook

## Project Structure
- `backend/` â€“ FastAPI application.
- `frontend/` â€“ React application.
- `data/raw/` â€“ Q1 and Q2 datasets.
- `notebook/` â€“ Exploratory and statistical analysis.
- `reports/` â€“ Research outputs.

## Running Locally

### Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
Open another terminal:
```powershell
cd frontend
npm install
npm run dev
```

## Methodology and Limitations
- Institutions are matched using CERT.
- Full-quarter aggregates and matched-institution comparisons are treated separately.
- Monetary values in the source datasets are in thousands of USD.
- Statistical significance is considered alongside effect size.
- Risk indicators are analytical screening flags, not regulatory findings or bank failure predictions.
- The analysis covers Q1 and Q2 2026 and does not establish long-term trends or seasonality.
- Correlation does not imply causation.

## Disclaimer
BankScope is an independent financial research and decision-support project. It is not an official FDIC product and does not provide regulatory ratings, investment advice, or predictions of institutional failure.

