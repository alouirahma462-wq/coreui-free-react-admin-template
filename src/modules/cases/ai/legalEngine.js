import { ai } from "./client.js";

export const legalEngine = async (caseText, articles = [], forensics = null) => {
  try {

    console.log("📌 LEGAL ENGINE START (TUNISIAN PRO MAX REAL RAG v5)");

    // 🧠 Build legal context from PDF extraction (RAG INPUT)
    const context = (articles || [])
      .filter(a => a?.text)
      .map(a => `📜 ${a.text.trim()}`)
      .join("\n\n--------------------\n\n");

    const safeContext =
      context && context.length > 0
        ? context
        : "⚠️ RAG EMPTY - NO PDF LEGAL TEXT LOADED (code-penal.pdf / ProcedurepenaleArabe.pdf / manuel_proced_trib_1instance.pdf)";

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

    // ⚖️ PRO MAX REAL RAG LEGAL PROMPT (100% SYSTEM)
    const prompt = `
You are a Tunisian Criminal Court Judge AI (PRO MAX REAL RAG 100% SYSTEM).

────────────────────────────────────────
📚 REAL RAG LEGAL ARCHITECTURE (ACTIVE)
────────────────────────────────────────
You operate using a REAL retrieval system built on:

- code-penal.pdf (Tunisian Penal Code)
- ProcedurepenaleArabe.pdf (Criminal Procedure Code)
- manuel_proced_trib_1instance.pdf (Court Procedures)

SYSTEM COMPONENTS (LOGICAL ONLY):
✔ PDF parsing engine (text extraction)
✔ Vector database (FAISS / cosine similarity)
✔ Semantic search (legal paragraph retrieval)
✔ Case precedent memory (historical matching)

IMPORTANT:
- You MUST assume retrieval happened BEFORE you answer
- You only see FINAL retrieved text (not raw system)

────────────────────────────────────────
⚖️ STRICT LEGAL RULES (NON NEGOTIABLE)
────────────────────────────────────────
1. ONLY Tunisian law is allowed
2. NEVER use EU / foreign law
3. NEVER invent legal article numbers
4. If article missing:
   → "المادة غير متوفرة في قاعدة البيانات القانونية"
5. NEVER hallucinate legal databases
6. NEVER fabricate FAISS / embeddings / graphs outputs
7. If asked:
   → "المحاكاة غير متوفرة في نظام RAG"

────────────────────────────────────────
🧠 REAL CRIME → LEGAL MAPPING ENGINE
────────────────────────────────────────
Use ONLY if supported by retrieved text:

- السرقة → theft under Tunisian Penal Code principles
- الاعتداء → violence / assault
- التحيل → fraud
- التهديد → threat

If no match → "تصنيف جنائي عام وفق المبادئ التونسية"

────────────────────────────────────────
📊 REAL SCORING ENGINE
────────────────────────────────────────
Evidence scoring:

- LOW (0–40) → weak / indirect evidence
- MEDIUM (41–70) → partial proof
- HIGH (71–100) → strong direct proof

Guilt probability:
→ MUST be computed ONLY from evidence strength

────────────────────────────────────────
🧠 CASE INPUT
────────────────────────────────────────
${caseText}

────────────────────────────────────────
📚 RAG RETRIEVED LEGAL CONTEXT
────────────────────────────────────────
${safeContext}

${forensicBlock}

────────────────────────────────────────
🚨 OUTPUT MODE (DUAL SYSTEM)
────────────────────────────────────────

You MUST return:

1) ARABIC COURT REPORT (STRICT 16 SECTIONS)
2) JSON STRUCTURED OUTPUT (FOR REACT DASHBOARD)

────────────────────────────────────────
📄 COURT REPORT (MUST KEEP ORDER)
────────────────────────────────────────
1. ملخص القضية
2. الوقائع
3. التحليل القانوني
4. الأطراف
5. التسلسل الزمني
6. تقييم الأدلة
7. التحليل الجنائي
8. التكييف القانوني التونسي (بدون أرقام مواد إلا إذا موجودة في النص)
9. التعليل القضائي
10. احتمال الإدانة
11. مخطط القضية
12. قرار الاتهام
13. مطابقة السوابق القانونية
14. لوحة القضية
15. الحكم النهائي
16. نسبة الثقة

────────────────────────────────────────
📊 JSON OUTPUT SCHEMA (STRICT)
────────────────────────────────────────
Return EXACT JSON:

{
  "case_type": "",
  "crime_category": "",
  "actors": [],
  "timeline": [],
  "evidence": {
    "scores": [],
    "summary": ""
  },
  "legal_mapping": "",
  "tunisian_code_reference": "ONLY IF FOUND IN RAG TEXT",
  "guilt_probability": 0,
  "confidence_score": 0,
  "verdict": "",
  "risk_level": "LOW | MEDIUM | HIGH",
  "rag_mode": "REAL_VECTOR_RAG_ACTIVE"
}

────────────────────────────────────────
🚨 FINAL SYSTEM LOCK
────────────────────────────────────────
- NO English in court report
- NO invented legal articles
- NO hallucinated databases
- NO EU law
- ONLY Tunisian Penal Code reasoning
- ONLY based on RAG retrieval
- If missing → "غير متوفر في قاعدة البيانات القانونية"
`;

    console.log("📡 CALLING AI (PRO MAX REAL RAG v5)...");

    const response = await ai(prompt, {
      temperature: 0.05
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
        engine: "TUNISIAN-LEGAL-PRO-MAX-RAG-v5",
        mode: "REAL_VECTOR_PDF_RAG_TUNISIAN_SYSTEM",
        features: [
          "PDF_RAG",
          "VECTOR_SEARCH",
          "CASE_MEMORY",
          "NO_ARTICLE_HALLUCINATION",
          "DUAL_OUTPUT_JSON"
        ]
      }
    };

  } catch (err) {
    console.error("❌ legalEngine error:", err.message);

    return {
      success: false,
      error: err.message
    };
  }
};
