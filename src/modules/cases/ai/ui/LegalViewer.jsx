import { useState } from "react";

export default function LegalViewer({ result }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr" }}>
      
      {/* ARTICLES */}
      <div>
        <h3>📚 Articles</h3>
        {result?.articles_used?.map((a, i) => (
          <div key={i} onClick={() => setSelected(a)}>
            ⚖️ {a.article}
          </div>
        ))}
      </div>

      {/* MAIN VIEW */}
      <div>
        <h2>⚖️ Case Result</h2>
        <pre>{result?.verdict}</pre>
      </div>

      {/* EXPLAINABILITY */}
      <div>
        <h3>🧠 Explanation</h3>
        <pre>
          {JSON.stringify(result?.explainability, null, 2)}
        </pre>
      </div>
    </div>
  );
}
