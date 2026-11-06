# BankScope
### Beyond the Balance Sheet.

**BankScope** is an interactive financial research and decision-support platform designed to explore the financial performance, profitability, risk indicators, and institutional differences of FDIC-insured banks.

Using Q1 and Q2 2026 FDIC bank-level data, BankScope combines financial analysis, statistical testing, and interactive visualizations to turn complex banking data into meaningful insights.

---
## 🌐 Live Demo

🚀 **Live Website:** [BankScope](https://bankscopee.netlify.app)

📡 **Backend API:** [FastAPI Documentation](https://bankscope-mnaj.onrender.com/docs)

---
## Overview

Financial statements contain more than just numbers. They reveal patterns in institutional growth, capital structure, profitability, and financial stability.

BankScope makes these patterns easier to explore through six interconnected research modules:

| Module | What it explores |
|---|---|
| **Overview** | Key banking metrics and quarterly highlights |
| **Institutions** | Search and explore individual financial institutions |
| **Financial Comparison** | Compare Q1 and Q2 financial positions |
| **Profitability** | Examine ROA, ROE, and net interest margin |
| **Risk & Stability** | Explore capital and profitability screening indicators |
| **Statistical Research** | Investigate relationships, distributions, and statistical differences |

## Key Features

- **Quarterly financial comparison** — Analyze changes in assets, liabilities, deposits, equity, and income.
- **Institution-level exploration** — Search banks and inspect their financial information.
- **Profitability analysis** — Examine ROA, ROE, and net interest margin across institutions.
- **Risk screening** — Identify institutions that meet selected analytical risk-signal criteria.
- **Statistical testing** — Apply non-parametric tests and correlation analysis to investigate financial patterns.
- **Interactive visualizations** — Explore financial information through charts, tables, and research-focused views.

## Data & Research Methodology

The project uses FDIC bank-level financial data for:

- Q1 2026
- Q2 2026

**Institution matching:** The FDIC Certificate Number (`CERT`) is used as the matching key to identify institutions across quarters.

**Research approach:**
1. Data cleaning and standardization.
2. Institution matching across reporting periods.
3. Financial statement reconciliation.
4. Quarterly change analysis.
5. Institution-size segmentation.
6. Profitability and risk-indicator analysis.
7. Statistical testing and correlation analysis.

### Selected Research Findings

Some findings from the completed analysis:

- **4,243 institutions** were matched across both quarters.
- Asset changes were observed across the matched institution cohort, with 2,473 institutions recording an increase.
- Net interest margin differed statistically across institution-size groups (Kruskal–Wallis, p < 0.001).
- The effect size for the NIMY group difference was small (epsilon-squared ≈ 0.0199).
- Very large institutions had a higher observed NIMY outlier rate than the other size groups.

These findings describe the analyzed dataset and should not be interpreted as evidence of causation.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | CSS, Tailwind CSS |
| Visualizations | Recharts |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Data Analysis | Pandas, NumPy, SciPy |
| Research Environment | Jupyter Notebook |
| API Communication | Axios |

## Project Structure

```text
BankScope/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── data/
│   └── raw/
│       ├── Q1.csv
│       └── Q2.csv
│
├── notebook/
│   ├── 01_initial_exploration.ipynb
│   └── 02_financial_analysis.ipynb
│
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/charitha1702/BankScope.git
cd BankScope
```

### 2. Set up the backend

Open a terminal:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Make sure both the backend and frontend servers are running.

## Statistical Methods

The research notebook includes:

- Descriptive statistics
- Quarter-over-quarter comparisons
- Pearson and Spearman correlation
- Kruskal–Wallis H-test
- Dunn's post-hoc test with Holm correction
- Interquartile range (IQR) outlier analysis
- Effect-size interpretation

Statistical significance is considered alongside effect size and practical relevance.

## Important Research Considerations

- The analysis covers Q1 and Q2 2026; it does not establish long-term trends or seasonality.
- Quarterly comparisons use matched institutions where appropriate.
- Missing observations can result in different sample sizes across metrics.
- Risk indicators are analytical screening signals, not regulatory findings or predictions of bank failure.
- Correlation does not establish causation.
- Financial values retain their source reporting units unless explicitly converted.

## Future Scope

Potential directions for further development include:

- Historical multi-quarter analysis.
- More advanced institution-level benchmarking.
- Additional financial health indicators.
- Expanded statistical research.
- Deployment as a publicly accessible research platform.

## Disclaimer

BankScope is an independent financial research and decision-support project. It is not an official FDIC product and does not provide regulatory ratings, investment advice, or predictions of institutional failure.

## Author

**P. S. Charitha**

[GitHub](https://github.com/charitha1702)

---

<p align="center">
  <strong>BankScope — Beyond the Balance Sheet.</strong><br/>
  <sub>Making financial data more meaningful.</sub>
</p>
