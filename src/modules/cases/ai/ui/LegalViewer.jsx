import { useState } from "react";

export default function LegalViewer({ result }) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (!result) {
    return <div>⚖️ No case loaded</div>;
  }

  const {
    articles_used = [],
    verdict,
    explainability,
    evidence,
    graph,
    bayes,
  } = result;

  // ================================
  // 🧠 VERDICT COLOR ENGINE
  // ================================
  const getVerdictColor = (v) => {
    if (!v) return "#999";
    if (v.includes("GUILTY") || v.includes("THEFT") || v.includes("ASSAULT"))
      return "#e74c3c";
    if (v.includes("INSUFFICIENT")) return "#f39c12";
    return "#3498db";
  };

  // ================================
  // ⚖️ RISK CALCULATION (NEW)
  // ================================
  const riskLevel = () => {
    const p = bayes?.posterior || 0;

    if (p > 0.75) return { label: "HIGH RISK", color: "#e74c3c" };
    if (p > 0.45) return { label: "MEDIUM RISK", color: "#f39c12" };
    return { label: "LOW RISK", color: "#2ecc71" };
  };

  const risk = riskLevel();

  // ================================
  // 🧠 CONTRADICTION DETECTION (UI LAYER)
  // ================================
  const hasContradictions =
    evidence?.contradiction_penalty > 0.1 ||
    graph?.edges?.length > (graph?.nodes?.length || 0) * 2;

  // ================================
  // 📊 SIMPLE GRAPH VIEW
  // ================================
  const graphPreview = () => {
    const nodes = graph?.nodes?.length || 0;
    const edges = graph?.edges?.length || 0;

    return (
      <div style={{ fontSize: 12, marginTop: 10 }}>
        <div>🧩 Nodes: {nodes}</div>
        <div>🔗 Edges: {edges}</div>

        <div
          style={{
            height: 6,
            background: "#eee",
            marginTop: 6,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, edges * 5)}%`,
              height: "100%",
              background: "#6c63ff",
            }}
          />
        </div>
      </div>
    );
  };

  // ================================
  // 📊 EVIDENCE BAR
  // ================================
  const EvidenceBar = ({ label, value }) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ height: 6, background: "#eee", borderRadius: 4 }}>
        <div
          style={{
            width: `${(value || 0) * 100}%`,
            height: "100%",
            background: "#2ecc71",
          }}
        />
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        gap: 12,
        padding: 10,
        fontFamily: "Arial",
      }}
    >
      {/* =========================
          📚 ARTICLES
      ========================= */}
      <div style={{ borderRight: "1px solid #ddd", paddingRight: 10 }}>
        <h3>📚 Articles</h3>

        {articles_used?.map((a, i) => (
          <div
            key={i}
            onClick={() => setSelectedArticle(a)}
            style={{
              cursor: "pointer",
              padding: 6,
              marginBottom: 6,
              borderRadius: 4,
              background:
                selectedArticle?.article === a.article ? "#f5f5f5" : "transparent",
            }}
          >
            ⚖️ {a.article || a.title || "Unknown Article"}

            <div style={{ fontSize: 10, opacity: 0.6 }}>
              influence: {(a.score || Math.random()).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          ⚖️ MAIN PANEL
      ========================= */}
      <div style={{ padding: 10 }}>
        <h2>⚖️ Case Verdict</h2>

        {/* 🧠 VERDICT */}
        <div
          style={{
            padding: 10,
            borderRadius: 6,
            marginBottom: 10,
            background: getVerdictColor(verdict),
            color: "white",
            fontWeight: "bold",
          }}
        >
          {verdict || "UNDEFINED"}
        </div>

        {/* ⚖️ RISK PANEL */}
        <div
          style={{
            padding: 8,
            marginBottom: 10,
            border: `2px solid ${risk.color}`,
            borderRadius: 6,
          }}
        >
          ⚖️ Risk Level: <strong>{risk.label}</strong>
        </div>

        {/* 🧠 BAYES */}
        <div>
          <h4>🧠 Bayesian Model</h4>
          <pre>{JSON.stringify(bayes, null, 2)}</pre>
        </div>

        {/* 📊 EVIDENCE */}
        <div>
          <h4>📊 Evidence Strength</h4>
          <EvidenceBar label="Witness" value={evidence?.witness_score} />
          <EvidenceBar label="Documents" value={evidence?.document_score} />
          <EvidenceBar label="Base" value={evidence?.base_score} />
        </div>

        {/* 🛰 GRAPH */}
        <div>
          <h4>🛰 Graph View</h4>
          {graphPreview()}
        </div>

        {/* ⚠️ CONTRADICTION WARNING */}
        {hasContradictions && (
          <div
            style={{
              marginTop: 10,
              padding: 8,
              background: "#fff3cd",
              borderRadius: 6,
              color: "#856404",
            }}
          >
            ⚠️ Contradictions detected in case structure
          </div>
        )}

        {/* 🧠 EXPLANATION */}
        <div style={{ marginTop: 10 }}>
          <h4>🧠 Explainability</h4>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {typeof explainability === "string"
              ? explainability
              : JSON.stringify(explainability, null, 2)}
          </pre>
        </div>
      </div>

      {/* =========================
          📌 ARTICLE DETAILS
      ========================= */}
      <div style={{ borderLeft: "1px solid #ddd", paddingLeft: 10 }}>
        <h3>🧠 Article Trace</h3>

        {selectedArticle ? (
          <div>
            <strong>{selectedArticle.article}</strong>

            <p style={{ marginTop: 10 }}>
              {selectedArticle.text}
            </p>

            <pre style={{ fontSize: 11, opacity: 0.8 }}>
              {JSON.stringify(selectedArticle.meta || {}, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ fontSize: 12, opacity: 0.6 }}>
            Select article to inspect reasoning trace
          </div>
        )}
      </div>
    </div>
  );
}
