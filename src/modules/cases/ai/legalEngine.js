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
IMPORTANT STRICT RULE
────────────────────────────
- You MUST output ALL sections 1–16.
- If a section cannot be computed, write: "NOT COMPUTED - DATA INSUFFICIENT"
- Do NOT skip any section.
- Do NOT merge sections.

────────────────────────────
ANTI-HALLUCINATION RULE
────────────────────────────
Do NOT simulate or invent software outputs (FAISS, D3, ML models).
Only provide logical legal reasoning.
If system data is not available, explicitly state:
"SIMULATION NOT AVAILABLE IN RUNTIME"

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
OUTPUT FORMAT (MANDATORY - DO NOT MODIFY)
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
OUTPUT MUST BE STRUCTURED LIKE A COURT DOCUMENT.
NO EXTRA TEXT OUTSIDE SECTIONS.
NO INTRODUCTION.
NO CONCLUSION OUTSIDE FORMAT.
FORMAL JUDICIAL LANGUAGE.
NO EMOTIONAL LANGUAGE.
HIGH ANALYTICAL DEPTH.
`;

    console.log("📡 CALLING AI v7...");

    const response = await ai(prompt, {
      temperature: 0.2
    });

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
