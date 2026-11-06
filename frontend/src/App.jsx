import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Building2, ArrowLeftRight, TrendingUp,
  ShieldAlert, FlaskConical, Search, Menu, X, ChevronRight,
  Landmark, ArrowUpRight, ArrowDownRight, RefreshCw,
  Activity, Users, Wallet, CircleDollarSign, FileSearch,
  ChartNoAxesCombined, Info
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  LineChart, Line, ReferenceLine
} from "recharts";
import "./App.css";

const API = "http://127.0.0.1:8000";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, group: "WORKSPACE" },
  { id: "institutions", label: "Institutions", icon: Building2, group: "WORKSPACE" },
  { id: "comparisons", label: "Financial Comparison", icon: ArrowLeftRight, group: "ANALYSIS" },
  { id: "profitability", label: "Profitability", icon: TrendingUp, group: "ANALYSIS" },
  { id: "risk", label: "Risk & Stability", icon: ShieldAlert, group: "RESEARCH" },
  { id: "statistics", label: "Statistical Research", icon: FlaskConical, group: "RESEARCH" },
];

const COLORS = ["#bd829a", "#d8a9b9", "#9d7187", "#e9cbd5"];

const research = {
  changes: [
    { metric: "Total assets", analyzed: 4243, increased: 2473, decreased: 1769, unchanged: 1, median: 1406, mean: 94098.71 },
    { metric: "Total liabilities", analyzed: 4243, increased: 2296, decreased: 1946, unchanged: 1, median: 691, mean: 90592.99 },
    { metric: "Deposits", analyzed: 4243, increased: 2161, decreased: 2062, unchanged: 20, median: 120, mean: 57389.60 },
    { metric: "Equity", analyzed: 4234, increased: 3640, decreased: 590, unchanged: 4, median: 750.5, mean: 3526.79 },
    { metric: "Net income", analyzed: 4234, increased: 4056, decreased: 178, unchanged: 0, median: 1194.5, mean: 21302.89 },
    { metric: "ROA", analyzed: 4243, increased: 2855, decreased: 1379, unchanged: 9, median: 0.041262, mean: 0.072729 },
    { metric: "ROE", analyzed: 4233, increased: 2724, decreased: 1485, unchanged: 24, median: 0.34, mean: 0.32666 },
  ],
  correlations: [
    { pair: "Assets – Deposits", pearson: 0.99704, spearman: 0.994451 },
    { pair: "Assets – Equity", pearson: 0.993222, spearman: 0.961573 },
    { pair: "Assets – Net income", pearson: 0.98466, spearman: 0.867407 },
    { pair: "ROA – ROE", pearson: 0.5525, spearman: 0.847093 },
    { pair: "ROA – NIMY", pearson: 0.183414, spearman: 0.476812 },
    { pair: "Equity – ROE", pearson: 0.011287, spearman: 0.08361 },
    { pair: "Liabilities – Deposits", pearson: 0.996682, spearman: 0.998144 },
  ],
  sizeNimy: [
    { size: "Small", median: 3.8863, outlier: 3.484 },
    { size: "Medium", median: 3.9906, outlier: 2.2599 },
    { size: "Large", median: 3.906, outlier: 2.8275 },
    { size: "Very large", median: 3.6824, outlier: 7.0621 },
  ],
  classRisk: [
    { class: "N", institutions: 662, capital: 32, profitability: 25, any: 56, anyRate: 8.459 },
    { class: "NM", institutions: 2400, capital: 121, profitability: 93, any: 206, anyRate: 8.583 },
    { class: "SB", institutions: 202, capital: 8, profitability: 20, any: 28, anyRate: 13.861 },
    { class: "SI", institutions: 230, capital: 11, profitability: 15, any: 20, anyRate: 8.696 },
    { class: "SL", institutions: 43, capital: 1, profitability: 4, any: 4, anyRate: 9.302 },
    { class: "SM", institutions: 700, capital: 38, profitability: 20, any: 54, anyRate: 7.714 },
  ],
  sizeRisk: [
    { size: "Small", institutions: 1061, capital: 61, profitability: 95, any: 147, rate: 13.8549 },
    { size: "Medium", institutions: 1062, capital: 65, profitability: 30, any: 92, rate: 8.6629 },
    { size: "Large", institutions: 1061, capital: 53, profitability: 36, any: 82, rate: 7.7286 },
    { size: "Very large", institutions: 1053, capital: 32, profitability: 16, any: 47, rate: 4.4634 },
  ],
  transitions: [
    { status: "No signal in either quarter", capital: 3983, profitability: 4018 },
    { status: "New signal in Q2", capital: 11, profitability: 26 },
    { status: "Signal disappeared in Q2", capital: 39, profitability: 42 },
    { status: "Signal in both quarters", capital: 200, profitability: 147 },
  ],
  posthoc: [
    { comparison: "Small vs Medium", p: "0.06440675", significant: false },
    { comparison: "Small vs Large", p: "0.8279515", significant: false },
    { comparison: "Small vs Very Large", p: "1.047714 × 10⁻¹⁰", significant: true },
    { comparison: "Medium vs Large", p: "0.05501690", significant: false },
    { comparison: "Medium vs Very Large", p: "5.687273 × 10⁻¹⁸", significant: true },
    { comparison: "Large vs Very Large", p: "3.661447 × 10⁻¹⁰", significant: true },
  ],
};

const moneyT = (value) => value == null ? "—" : `$${(Number(value) / 1e9).toFixed(2)}T`;
const moneyB = (value) => value == null ? "—" : `$${(Number(value) / 1e6).toFixed(2)}B`;
const number = (value) => value == null ? "—" : Number(value).toLocaleString("en-US");
const pct = (value, digits = 2) => value == null ? "—" : `${Number(value).toFixed(digits)}%`;
const signedPct = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

function PageHeading({ eyebrow, title, description, right }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {right && <div className="heading-action">{right}</div>}
    </div>
  );
}

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      {(title || subtitle) && (
        <div className="panel-heading">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

function MetricCard({ label, value, note, icon: Icon, tone = "rose" }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={19} /></div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">{note}</div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <div key={item.dataKey} style={{ color: item.color }}>
          {item.name}: {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
        </div>
      ))}
    </div>
  );
}

function OverviewPage({ overview, loading, onNavigate }) {
  if (!overview) return <div className="empty-state">Loading financial overview…</div>;

  const q1 = overview.quarters?.Q1;
  const q2 = overview.quarters?.Q2;
  if (!q1 || !q2) return <div className="empty-state">The overview response is missing quarter data.</div>;

  const researchAreas = [
    {
      number: "01",
      title: "Financial Comparison",
      description: "Investigate changes in assets, liabilities, deposits, equity and income across matched institutions.",
      icon: ArrowLeftRight,
      page: "comparisons",
    },
    {
      number: "02",
      title: "Profitability Analysis",
      description: "Examine ROA, ROE and net interest margin yield, including differences across institution sizes.",
      icon: TrendingUp,
      page: "profitability",
    },
    {
      number: "03",
      title: "Risk & Stability",
      description: "Explore capital and profitability screening signals, institution classifications and quarterly transitions.",
      icon: ShieldAlert,
      page: "risk",
    },
    {
      number: "04",
      title: "Statistical Research",
      description: "Evaluate financial relationships and test differences using correlation and non-parametric methods.",
      icon: FlaskConical,
      page: "statistics",
    },
    {
      number: "05",
      title: "Institution Explorer",
      description: "Search individual institutions and inspect their reported financial information.",
      icon: Building2,
      page: "institutions",
    },
  ];

  const workflow = [
    {
      step: "01",
      title: "Data collection & preparation",
      description: "Load Q1 and Q2 2026 FDIC datasets, inspect variables, clean financial fields and validate records.",
    },
    {
      step: "02",
      title: "Institution matching",
      description: "Match institutions using FDIC Certificate Numbers to establish a consistent cohort for quarterly comparisons.",
    },
    {
      step: "03",
      title: "Financial analysis",
      description: "Evaluate balance-sheet movements, profitability metrics, descriptive statistics and institution-size groups.",
    },
    {
      step: "04",
      title: "Risk screening",
      description: "Examine capital and profitability indicators, outliers and changes in screening signals between quarters.",
    },
    {
      step: "05",
      title: "Statistical validation",
      description: "Apply Pearson and Spearman correlation, Kruskal–Wallis testing and Dunn's post-hoc comparisons with Holm adjustment.",
    },
  ];

  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="eyebrow">AN FDIC FINANCIAL RESEARCH PROJECT · 2026</div>
          <h1>
            Beyond the
            <br />
            <span>Balance Sheet.</span>
          </h1>
          <p className="landing-description">
            Looking beyond reported financial figures to understand
            institutional performance, profitability, risk indicators
            and the relationships shaping the US banking sector.
          </p>
          <div className="hero-tags">
            <span>Q1 2026</span>
            <span>Q2 2026</span>
            <span>FDIC quarterly data</span>
          </div>
          <button className="hero-button" onClick={() => onNavigate("institutions")}>
            Explore the institutions <ChevronRight size={16} />
          </button>
        </div>

        <div className="hero-side">
          <div className="hero-side-top">
            <span>RESEARCH SCOPE</span>
            <Activity size={17} />
          </div>
          <div className="hero-side-number">{number(overview.matched_institutions)}</div>
          <div className="hero-side-label">Institutions matched across both quarters</div>
          <div className="hero-side-divider" />
          <div className="hero-side-detail">
            <span>Reporting periods</span><strong>Q1 – Q2 2026</strong>
          </div>
          <div className="hero-side-detail">
            <span>Primary data source</span><strong>FDIC</strong>
          </div>
          <div className="hero-side-detail">
            <span>Research approach</span><strong>Quantitative analysis</strong>
          </div>
          <div className="hero-side-bottom">
            <span className="live-dot" /> Quarterly datasets connected
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-intro">
          <div className="eyebrow">THE PROJECT</div>
          <h2>Understanding banking beyond the numbers.</h2>
          <p>
            BankScope is a financial analytics platform built to study
            the financial position and performance of FDIC-reporting
            institutions. It brings together quarterly financial data,
            institution-level comparisons, risk screening and
            statistical analysis in one research environment.
          </p>
        </div>
        <div className="research-purpose-grid">
          <div className="purpose-item">
            <div className="purpose-icon"><Landmark size={19} /></div>
            <h3>Financial position</h3>
            <p>Understand assets, liabilities, deposits, equity and net income.</p>
          </div>
          <div className="purpose-item">
            <div className="purpose-icon"><ChartNoAxesCombined size={19} /></div>
            <h3>Performance</h3>
            <p>Study profitability through ROA, ROE and NIMY indicators.</p>
          </div>
          <div className="purpose-item">
            <div className="purpose-icon"><ShieldAlert size={19} /></div>
            <h3>Risk screening</h3>
            <p>Identify institutions with selected capital and profitability signals.</p>
          </div>
          <div className="purpose-item">
            <div className="purpose-icon"><FlaskConical size={19} /></div>
            <h3>Statistical evidence</h3>
            <p>Test financial relationships and differences across institution groups.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="section-heading-row">
          <div>
            <div className="eyebrow">THE DATA AT A GLANCE</div>
            <h2>A snapshot of the banking sector.</h2>
            <p>Live aggregate figures retrieved from the BankScope API.</p>
          </div>
          <span className="snapshot-period">Q2 2026</span>
        </div>
        <div className="metric-grid">
          <MetricCard label="Total assets" value={moneyT(q2.total_assets)} note={`Q1: ${moneyT(q1.total_assets)}`} icon={Landmark} />
          <MetricCard label="Total deposits" value={moneyT(q2.total_deposits)} note={`Q1: ${moneyT(q1.total_deposits)}`} icon={Wallet} tone="mauve" />
          <MetricCard label="Total equity" value={moneyT(q2.total_equity)} note={`Q1: ${moneyT(q1.total_equity)}`} icon={CircleDollarSign} tone="peach" />
          <MetricCard label="Matched institutions" value={number(overview.matched_institutions)} note="Present in both quarters" icon={Users} tone="sage" />
        </div>
        <div className="snapshot-note">
          <Info size={15} />
          Aggregate totals represent all institutions reported in each quarter.
          Matched-institution analysis uses the common cohort.
        </div>
      </section>

      <section className="landing-section">
        <div className="eyebrow">WHAT WE INVESTIGATED</div>
        <h2>Five dimensions of financial research.</h2>
        <p className="section-subtitle">
          Each section approaches the data from a different analytical perspective.
        </p>
        <div className="research-area-list">
          {researchAreas.map((area) => {
            const Icon = area.icon;
            return (
              <button className="research-area" key={area.number} onClick={() => onNavigate(area.page)}>
                <span className="research-area-number">{area.number}</span>
                <span className="research-area-icon"><Icon size={19} /></span>
                <span className="research-area-copy">
                  <strong>{area.title}</strong>
                  <span>{area.description}</span>
                </span>
                <ChevronRight className="research-area-arrow" size={19} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="landing-section">
        <div className="eyebrow">OUR ANALYTICAL APPROACH</div>
        <h2>From raw data to statistical evidence.</h2>
        <p className="section-subtitle">
          The research follows a structured workflow to move from data preparation to interpretation.
        </p>
        <div className="workflow-list">
          {workflow.map((item) => (
            <div className="workflow-item" key={item.step}>
              <div className="workflow-number">{item.step}</div>
              <div className="workflow-copy">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="eyebrow">RESEARCH TRANSPARENCY</div>
        <h2>Scope, methodology & limitations.</h2>
        <div className="limitations-grid">
          <div className="limitation-card">
            <h3>Study scope</h3>
            <p>
              This analysis covers two reporting periods: Q1 and Q2 2026.
              It provides a quarterly comparison, not a long-term trend
              or a forecast of future banking performance.
            </p>
          </div>
          <div className="limitation-card">
            <h3>Matched cohort</h3>
            <p>
              Institution-level quarterly changes are based on records
              matched using FDIC Certificate Numbers. Some metrics have
              fewer valid observations because of missing values.
            </p>
          </div>
          <div className="limitation-card">
            <h3>Statistical interpretation</h3>
            <p>
              Statistical significance does not necessarily imply a
              large practical effect. Correlation identifies association,
              not causation.
            </p>
          </div>
          <div className="limitation-card">
            <h3>Risk indicators</h3>
            <p>
              Screening indicators are analytical flags based on
              selected financial measures. They are not regulatory
              findings or predictions of institutional failure.
            </p>
          </div>
        </div>
      </section>

      <section className="landing-closing">
        <div>
          <div className="eyebrow">CONTINUE EXPLORING</div>
          <h2>Good analysis starts with better questions.</h2>
          <p>
            Explore the institutions, compare financial performance
            and examine the evidence behind the findings.
          </p>
        </div>
        <button className="hero-button" onClick={() => onNavigate("statistics")}>
          Explore statistical research <ChevronRight size={16} />
        </button>
      </section>
    </>
  );
}
function InstitutionsPage({ institutions, loading, search, setSearch, quarter, setQuarter, onRefresh }) {
  const [selected, setSelected] = useState(null);
  const records = institutions?.institutions || [];
  const keys = records[0] ? Object.keys(records[0]) : [];
  const get = (row, key) => row?.[key] ?? row?.[key.toLowerCase()] ?? null;

  return (
    <>
      <PageHeading
        eyebrow="INSTITUTION DIRECTORY"
        title="Know the institutions."
        description="Search and explore FDIC institutions using their reported quarterly financials."
        right={
          <button className="soft-button" onClick={onRefresh}>
            <RefreshCw size={15} /> Refresh
          </button>
        }
      />

      <Card title="Institution explorer" subtitle={`${institutions?.count ?? records.length} records returned`}>
        <div className="table-controls">
          <div className="search-box">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bank name or certificate number…"
            />
          </div>

          <select
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
            className="select-control"
          >
            <option value="Q2">Q2 2026</option>
            <option value="Q1">Q1 2026</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading institutions…</div>
        ) : records.length === 0 ? (
          <div className="empty-state">No institutions found. Try another search.</div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Certificate</th>
                  <th>State</th>
                  <th>Class</th>
                  <th>Assets</th>
                  <th>ROA</th>
                  <th>ROE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {records.map((row, index) => {
                  const cert = get(row, "CERT") ?? get(row, "certificate_number") ?? index;

                  return (
                    <tr
                      key={cert}
                      onClick={() => setSelected(row)}
                      className="clickable-row"
                    >
                      <td>
                        <strong>{get(row, "NAME") ?? get(row, "name") ?? "Institution"}</strong>
                        <small>
                          {[get(row, "CITY"), get(row, "STALP")].filter(Boolean).join(", ")}
                        </small>
                      </td>
                      <td>{cert}</td>
                      <td>{get(row, "STALP") ?? "—"}</td>
                      <td>{get(row, "BKCLASS") ?? "—"}</td>
                      <td>{moneyB(get(row, "ASSET"))}</td>
                      <td>{pct(get(row, "ROA"))}</td>
                      <td>{pct(get(row, "ROE"))}</td>
                      <td><ChevronRight size={16} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>
              <X size={18} />
            </button>

            <div className="eyebrow">
              INSTITUTION PROFILE · {get(selected, "CERT")}
            </div>

            <h2>{get(selected, "NAME") ?? get(selected, "name")}</h2>

            <p className="muted">
              {[get(selected, "CITY"), get(selected, "STALP"), get(selected, "BKCLASS")]
                .filter(Boolean).join(" · ")}
            </p>

            <div className="profile-grid">
              {[
                ["Assets", moneyB(get(selected, "ASSET"))],
                ["Deposits", moneyB(get(selected, "DEP"))],
                ["Equity", moneyB(get(selected, "EQ"))],
                ["Net income", moneyB(get(selected, "NETINC"))],
                ["ROA", pct(get(selected, "ROA"))],
                ["ROE", pct(get(selected, "ROE"))],
                ["NIMY", pct(get(selected, "NIMY"))],
              ].map(([label, value]) => (
                <div className="profile-metric" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <div className="footnote">
              <Info size={14} />
              Figures are from the selected quarter and are not a Q1-to-Q2 comparison.
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ComparisonsPage({ overview }) {
  if (!overview?.quarters?.Q1 || !overview?.quarters?.Q2) {
    return <div className="empty-state">Loading quarterly comparison…</div>;
  }

  const q1 = overview.quarters.Q1;
  const q2 = overview.quarters.Q2;

  const fields = [
    ["Total assets", q1.total_assets, q2.total_assets],
    ["Total deposits", q1.total_deposits, q2.total_deposits],
    ["Total equity", q1.total_equity, q2.total_equity],
  ];

  const pctChange = (a, b) => a ? ((b - a) / Math.abs(a)) * 100 : 0;

  const chartData = fields.map(([metric, a, b]) => ({
    metric,
    Q1: a / 1e9,
    Q2: b / 1e9,
  }));

  return (
    <>
      <PageHeading
        eyebrow="QUARTERLY ANALYSIS"
        title="What changed?"
        description="Compare aggregate balance-sheet and profitability measures between Q1 and Q2 2026."
      />

      <div className="metric-grid">
        {fields.map(([label, a, b]) => (
          <MetricCard
            key={label}
            label={`${label} · change`}
            value={signedPct(pctChange(a, b))}
            note={`${moneyT(a)} → ${moneyT(b)}`}
            icon={ArrowUpRight}
          />
        ))}

        <MetricCard
          label="Matched cohort"
          value={number(overview.matched_institutions)}
          note="Institutions present in both quarters"
          icon={Users}
          tone="sage"
        />
      </div>

      <div className="content-grid two-col">
        <Card title="Balance-sheet comparison" subtitle="Aggregate totals · USD trillions">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee6e9" />
                <XAxis dataKey="metric" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="Q1" fill="#d8b4c2" radius={[5, 5, 0, 0]} />
                <Bar dataKey="Q2" fill="#956b80" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Median profitability" subtitle="Quarterly median values · percent">
          <div className="comparison-list">
            {[
              ["ROA", q1.median_roa, q2.median_roa],
              ["ROE", q1.median_roe, q2.median_roe],
              ["NIMY", q1.median_nimy, q2.median_nimy],
            ].map(([label, a, b]) => (
              <div className="comparison-row" key={label}>
                <div>
                  <strong>{label}</strong>
                  <span>Q1 {pct(a)} <ArrowRightSmall /> Q2 {pct(b)}</span>
                </div>
                <b className={b >= a ? "positive" : "negative"}>
                  {signedPct(pctChange(a, b))}
                </b>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Matched-institution movement"
        subtitle="Institutions analyzed individually across both quarters"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Analyzed</th>
                <th>Increased</th>
                <th>Decreased</th>
                <th>Unchanged</th>
                <th>Median change*</th>
              </tr>
            </thead>
            <tbody>
              {research.changes.map((r) => (
                <tr key={r.metric}>
                  <td><strong>{r.metric}</strong></td>
                  <td>{number(r.analyzed)}</td>
                  <td className="positive">{number(r.increased)}</td>
                  <td className="negative">{number(r.decreased)}</td>
                  <td>{number(r.unchanged)}</td>
                  <td>
                    {r.median.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="footnote">
          <Info size={14} />
          *Median change is in the source metric's original units. The table uses matched
          institutions; aggregate charts above use all institutions reported in each quarter.
        </div>
      </Card>
    </>
  );
}

function ArrowRightSmall() {
  return <span className="inline-arrow">→</span>;
}
function ProfitabilityPage({ overview }) {
  const q1 = overview?.quarters?.Q1;
  const q2 = overview?.quarters?.Q2;

  const medians = q1 && q2 ? [
    { metric: "ROA", Q1: q1.median_roa, Q2: q2.median_roa },
    { metric: "ROE", Q1: q1.median_roe, Q2: q2.median_roe },
    { metric: "NIMY", Q1: q1.median_nimy, Q2: q2.median_nimy },
  ] : [];

  return (
    <>
      <PageHeading
        eyebrow="PERFORMANCE RESEARCH"
        title="The profitability picture."
        description="Examine returns, margins and differences across institution-size groups."
      />

      <div className="metric-grid">
        <MetricCard
          label="Q2 median ROA"
          value={pct(q2?.median_roa)}
          note="Return on average assets"
          icon={Activity}
        />
        <MetricCard
          label="Q2 median ROE"
          value={pct(q2?.median_roe)}
          note="Return on equity"
          icon={TrendingUp}
          tone="mauve"
        />
        <MetricCard
          label="Q2 median NIMY"
          value={pct(q2?.median_nimy)}
          note="Net interest margin yield"
          icon={ChartNoAxesCombined}
          tone="peach"
        />
        <MetricCard
          label="NIMY outliers · very large"
          value="7.06%"
          note="Highest outlier rate among size groups"
          icon={Info}
          tone="sage"
        />
      </div>

      <div className="content-grid two-col">
        <Card title="Quarterly profitability" subtitle="Median ratios · percent">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medians}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee6e9" />
                <XAxis dataKey="metric" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="Q1" fill="#d8b4c2" radius={[5, 5, 0, 0]} />
                <Bar dataKey="Q2" fill="#956b80" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="NIMY by institution size" subtitle="Median NIMY · percent">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={research.sizeNimy} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee6e9" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="size"
                  type="category"
                  width={85}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="median"
                  name="Median NIMY"
                  fill="#a77990"
                  radius={[0, 5, 5, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="NIMY outlier rate by size" subtitle="Share of institutions flagged as NIMY outliers">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Institution size</th>
                <th>Median NIMY</th>
                <th>Outlier institutions</th>
                <th>Outlier rate</th>
              </tr>
            </thead>
            <tbody>
              {research.sizeNimy.map((r, i) => (
                <tr key={r.size}>
                  <td><strong>{r.size}</strong></td>
                  <td>{pct(r.median, 4)}</td>
                  <td>{[37, 24, 30, 75][i]}</td>
                  <td>{pct(r.outlier, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="footnote">
          <Info size={14} />
          NIMY outliers are statistical screening observations, not proof of financial distress.
        </div>
      </Card>
    </>
  );
}

function RiskPage() {
  return (
    <>
      <PageHeading
        eyebrow="SCREENING & STABILITY"
        title="Signals worth investigating."
        description="Review capital and profitability screening indicators across institution classes and size groups."
      />

      <div className="callout-note">
        <Info size={17} />
        <span>
          These are analytical screening signals derived from the Q1–Q2 dataset.
          They are not regulatory determinations, confirmed distress events or predictions
          of bank failure.
        </span>
      </div>

      <div className="content-grid two-col">
        <Card title="Risk signals by institution class" subtitle="Institutions with at least one screening signal">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={research.classRisk}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee6e9" />
                <XAxis dataKey="class" axisLine={false} tickLine={false} />
                <YAxis unit="%" axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="anyRate"
                  name="Institutions with any signal (%)"
                  fill="#a77990"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Risk signals by institution size" subtitle="Institutions with at least one screening signal">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={research.sizeRisk}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee6e9" />
                <XAxis dataKey="size" axisLine={false} tickLine={false} />
                <YAxis unit="%" axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="rate"
                  name="Institutions with any signal (%)"
                  fill="#bd829a"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Screening breakdown by bank class" subtitle="Counts of capital, profitability and combined signals">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Bank class</th>
                <th>Institutions</th>
                <th>Capital signals</th>
                <th>Profitability signals</th>
                <th>Any signal</th>
                <th>Any signal rate</th>
              </tr>
            </thead>
            <tbody>
              {research.classRisk.map((r) => (
                <tr key={r.class}>
                  <td><strong>{r.class}</strong></td>
                  <td>{number(r.institutions)}</td>
                  <td>{r.capital}</td>
                  <td>{r.profitability}</td>
                  <td>{r.any}</td>
                  <td>{pct(r.anyRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Signal transitions between quarters" subtitle="Matched institutions · Q1 to Q2">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Transition</th>
                <th>Capital position</th>
                <th>Profitability</th>
              </tr>
            </thead>
            <tbody>
              {research.transitions.map((r) => (
                <tr key={r.status}>
                  <td><strong>{r.status}</strong></td>
                  <td>{number(r.capital)}</td>
                  <td>{number(r.profitability)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="insight-grid compact-insights">
          <div className="insight-item">
            <span className="insight-mark">01</span>
            <div>
              <strong>Small institutions show more combined signals</strong>
              <p>13.85% of the small-institution screening group had at least one signal.</p>
            </div>
          </div>

          <div className="insight-item">
            <span className="insight-mark">02</span>
            <div>
              <strong>Very large institutions show fewer combined signals</strong>
              <p>The corresponding rate was 4.46% in the very-large group.</p>
            </div>
          </div>

          <div className="insight-item">
            <span className="insight-mark">03</span>
            <div>
              <strong>More signals disappeared than emerged</strong>
              <p>For both capital and profitability, disappeared signals exceeded new Q2 signals.</p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

function StatisticsPage() {
  return (
    <>
      <PageHeading
        eyebrow="STATISTICAL RESEARCH"
        title="Evidence behind the findings."
        description="Correlation, non-parametric testing and post-hoc comparisons from the completed Q1–Q2 analysis."
      />

      <div className="metric-grid">
        <MetricCard
          label="Matched institutions"
          value="4,243"
          note="Matched Q1 and Q2 records"
          icon={Users}
        />
        <MetricCard
          label="Kruskal–Wallis H"
          value="87.628"
          note="NIMY across four size groups"
          icon={FlaskConical}
          tone="mauve"
        />
        <MetricCard
          label="P-value"
          value="7.08 × 10⁻¹⁹"
          note="Statistically significant"
          icon={Activity}
          tone="peach"
        />
        <MetricCard
          label="Epsilon-squared"
          value="0.0199"
          note="Small effect size"
          icon={ChartNoAxesCombined}
          tone="sage"
        />
      </div>

      <div className="content-grid two-col">
        <Card title="Selected correlations" subtitle="Pearson and Spearman correlation coefficients">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Variable pair</th>
                  <th>Pearson</th>
                  <th>Spearman</th>
                </tr>
              </thead>
              <tbody>
                {research.correlations.map((r) => (
                  <tr key={r.pair}>
                    <td><strong>{r.pair}</strong></td>
                    <td>{r.pearson.toFixed(4)}</td>
                    <td>{r.spearman.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="NIMY across size groups" subtitle="Median values used in the Kruskal–Wallis test">
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={research.sizeNimy}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee6e9" />
                <XAxis dataKey="size" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="median"
                  name="Median NIMY (%)"
                  fill="#a77990"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Dunn post-hoc comparisons" subtitle="Holm-adjusted p-values following the Kruskal–Wallis test">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Group comparison</th>
                <th>Adjusted p-value</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {research.posthoc.map((r) => (
                <tr key={r.comparison}>
                  <td><strong>{r.comparison}</strong></td>
                  <td>{r.p}</td>
                  <td>
                    <span className={`result-pill ${r.significant ? "significant" : "not-significant"}`}>
                      {r.significant ? "Significant" : "Not significant"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="research-conclusion">
          <div className="eyebrow">INTERPRETATION</div>
          <h3>NIMY differs across institution-size groups, but the effect is small.</h3>
          <p>
            The post-hoc results indicate that the very-large group differs significantly
            from the small, medium and large groups. The other pairwise comparisons are
            not statistically significant after Holm adjustment.
          </p>
        </div>
      </Card>

      <div className="footnote">
        <Info size={14} />
        Statistical significance does not imply a large practical effect.
        Correlation does not establish causation.
      </div>
    </>
  );
}
export default function App() {
  const [activePage, setActivePage] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [institutions, setInstitutions] = useState(null);
  const [search, setSearch] = useState("");
  const [quarter, setQuarter] = useState("Q2");
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/api/overview`);

      if (!response.ok) {
        throw new Error("Could not load overview data.");
      }

      setOverview(await response.json());
    } catch (err) {
      setError(`${err.message} Make sure the FastAPI backend is running on port 8000.`);
    } finally {
      setLoading(false);
    }
  };

  const loadInstitutions = async () => {
    try {
      setSearchLoading(true);

      const params = new URLSearchParams({ quarter, limit: "100" });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(`${API}/api/institutions?${params}`);

      if (!response.ok) {
        throw new Error("Could not load institutions.");
      }

      setInstitutions(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (activePage === "institutions") {
      loadInstitutions();
    }
  }, [activePage, quarter, search]);

  const navigate = (id) => {
    setActivePage(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageTitles = {
    overview: "Overview",
    institutions: "Institutions",
    comparisons: "Financial Comparison",
    profitability: "Profitability",
    risk: "Risk & Stability",
    statistics: "Statistical Research",
  };

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="mobile-scrim"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Landmark size={21} />
          </div>

          <div>
            <div className="brand-name">BankScope<span>.</span></div>
            <div className="brand-caption">BEYOND THE BALANCE SHEET</div>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-rule" />

        {["WORKSPACE", "ANALYSIS", "RESEARCH"].map((group) => (
          <div className="nav-group" key={group}>
            <div className="nav-label">{group}</div>

            {NAV.filter((item) => item.group === group).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-item ${activePage === id ? "active" : ""}`}
                onClick={() => navigate(id)}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
                {activePage === id && <span className="nav-active-dot" />}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="dataset-card">
            <div className="dataset-icon">
              <FileSearch size={17} />
            </div>
            <div>
              <strong>FDIC dataset</strong>
              <span>Q1 – Q2 · 2026</span>
            </div>
            <span className="live-dot" />
          </div>

          <div className="sidebar-footer">
            FINANCIAL RESEARCH PLATFORM<br />
            VERSION 1.0
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="breadcrumb">
            BankScope <span>/</span> {pageTitles[activePage]}
          </div>

          <div className="topbar-right">
            <span className="period-label">REPORTING PERIOD</span>
            <span className="period-chip">Q1 – Q2 2026</span>
          </div>
        </header>

        <div className="page-content">
          {error && (
            <div className="error-banner">
              <Info size={16} />
              {error}
              <button
                onClick={() => {
                  setError("");
                  loadOverview();
                }}
              >
                Retry
              </button>
            </div>
          )}

          {loading && !overview ? (
            <div className="empty-state">Connecting to BankScope data…</div>
          ) : (
            <>
              {activePage === "overview" && (
                <OverviewPage
                  overview={overview}
                  loading={loading}
                  onNavigate={navigate}
                />
              )}

              {activePage === "institutions" && (
                <InstitutionsPage
                  institutions={institutions}
                  loading={searchLoading}
                  search={search}
                  setSearch={setSearch}
                  quarter={quarter}
                  setQuarter={setQuarter}
                  onRefresh={loadInstitutions}
                />
              )}

              {activePage === "comparisons" && (
                <ComparisonsPage overview={overview} />
              )}

              {activePage === "profitability" && (
                <ProfitabilityPage overview={overview} />
              )}

              {activePage === "risk" && <RiskPage />}

              {activePage === "statistics" && <StatisticsPage />}
            </>
          )}

          <footer className="page-footer">
            <span>BankScope · Beyond the Balance Sheet</span>
            <span>FDIC quarterly data · 2026</span>
          </footer>
        </div>
      </main>
    </div>
  );
}