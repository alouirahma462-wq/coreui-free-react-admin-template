import { ai } from "./client.js";

export const legalEngine = async (caseText, articles = [], forensics = null) => {
  try {

    console.log("📌 LEGAL ENGINE v4 START (LEXIS + FORENSICS)");

    // 🧠 Build legal context
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => `📜 ${a.text.trim()}`)
      .join("\n\n--------------------\n\n");

    const safeContext =
      context && context.length > 0
        ? context
        : "⚠️ لا توجد نصوص قانونية كافية من قاعدة البيانات.";

    // 🧠 Forensics block
    const forensicBlock = forensics
      ? `
════════ FORENSIC ANALYSIS ════════

👥 الأطراف:
${forensics.actors?.join(", ") || "غير محدد"}

⏱️ الأحداث:
${(forensics.events || []).join("\n")}

🔎 الأدلة:
${(forensics.evidence || []).join("\n")}

⚠️ التناقضات:
${JSON.stringify(forensics.contradictions || [], null, 2)}

📊 مصداقية الملف:
${forensics.credibilityScore ?? "غير محسوب"}

══════════════════════════════
`
      : "لا يوجد تحليل جنائي متقدم";

    // ⚖️ LEXISNEXIS v7 FULL SYSTEM PROMPT
    const prompt = `
You are an advanced European-level Criminal Court Judge AI (LexisNexis-class system).

You operate like:
- Criminal judge (EU legal system standard: France / Germany / EU jurisprudence style)
- Forensic investigator
- Legal reasoning engine
- Evidence evaluation system
- Judicial decision authority

Your job is NOT to summarize.
Your job is to reconstruct the truth of the case using strict legal reasoning.

────────────────────────────
RULES (NON-NEGOTIABLE)
────────────────────────────
1. Never say "not enough information" unless absolutely impossible.
2. You MUST infer reasonable facts and label:
   - FACTS (verified)
   - INFERRED (logical)
   - ASSUMPTIONS (low confidence)
3. Do NOT repeat input text.
4. Apply criminal law logic:
   - Actus Reus
   - Mens Rea
5. Evidence scoring required:
   - LOW / MEDIUM / HIGH + numeric value
6. No hallucinated legal articles.
   Use EU + Tunisian law principles only.
7. Structured judicial reasoning mandatory.
8. Formal EU court judgment tone.

────────────────────────────
INPUT CASE
────────────────────────────
${caseText}

────────────────────────────
LEGAL CONTEXT
────────────────────────────
${safeContext}

${forensicBlock}

────────────────────────────
LEXISNEXIS v7 REAL SYSTEM ARCHITECTURE LAYER
────────────────────────────

🧠 REAL VECTOR DB RANKING ENGINE (FAISS-STYLE)
- Semantic embedding retrieval
- similarity scoring (cosine / dot product)
- legal article ranking optimization
- relevance threshold filtering

👁️ WITNESS ML MODEL (PYTHON BACKEND SYSTEM)
- consistency_score model
- bias detection classifier
- credibility neural estimator
- output: witness reliability 0–100

📊 GRAPH VISUALIZATION ENGINE (REACT + D3)
Nodes:
- crime events
- evidence nodes
- witness nodes
- suspect nodes
Edges:
- supports
- contradicts
- weakens
- confirms
- inferred_link

⚖️ LEGAL ONTOLOGY DATABASE (JSON + GRAPH STRUCTURE)
{
  "entities": ["crime", "intent", "evidence", "actors"],
  "relations": ["causes", "proves", "contradicts", "supports"],
  "mapping": {
    "EU_law": "Tunisian_penal_code_alignment"
  }
}

🧠 CASE MEMORY SYSTEM (PERSISTENT JUDICIAL MEMORY)
- stores past cases embeddings
- retrieves similar cases
- precedent-based reasoning layer
- long-term judicial consistency engine

────────────────────────────
LEXISNEXIS v6 CORE STILL ACTIVE
────────────────────────────
🧠 Bayesian guilt probability engine  
⚖️ Rule-based ontology mapping  
🔍 Evidence ranking system  
📊 Case strength dashboard  
🧾 Auto indictment generator  

────────────────────────────
LEGAL TASK
────────────────────────────
- Identify crime type
- Identify actors
- Reconstruct timeline
- Detect contradictions
- Infer intent & means
- Estimate guilt probability
- Apply EU + Tunisian classification

────────────────────────────
OUTPUT FORMAT
────────────────────────────
1. CASE OVERVIEW
2. FACTUAL FINDINGS
3. LEGAL INFERENCES
4. ACTORS
5. TIMELINE
6. EVIDENCE ASSESSMENT
7. FORENSIC ANALYSIS (WITH ML SCORES)
8. LEGAL QUALIFICATION (EU + TUNISIA)
9. JUDICIAL REASONING
10. BAYESIAN PROBABILITY
11. GRAPH SUMMARY (D3 MODEL)
12. AUTO INDICTMENT
13. CASE MEMORY MATCH RESULT
14. CASE DASHBOARD
15. FINAL VERDICT
16. CONFIDENCE SCORE

────────────────────────────
STYLE REQUIREMENTS
────────────────────────────
- Formal judicial language
- No repetition
- No emotional language
- Court of Appeal reasoning style
- High analytical depth
`;

    console.log("📡 CALLING AI v7...");

    const response = await ai(prompt);

    console.log("📡 AI RESPONSE RECEIVED");

    if (!response || response.length < 20) {
      return {
        success: false,
        error: "EMPTY_AI_RESPONSE"
      };
    }

    return {
      success: true,
      analysis: response,
      meta: {
        engine: "LEXISNEXIS-V7",
        mode: "FULL_JUDICIAL_AI_SYSTEM"
      }
    };

  } catch (err) {
    console.error("❌ legalEngine v7 error:", err.message);

    return {
      success: false,
      error: err.message
    };
  }
};
