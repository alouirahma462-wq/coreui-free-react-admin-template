import { ai } from "./client.js";

export const legalEngine = async (
  caseText,
  articles = [],
  forensics = null
) => {
  try {
    console.log("📌 LEGAL ENGINE START (CLEAN WESTLAW RAG v7)");

    // ─────────────────────────────
    // 🧠 ARTICLE ENGINE (STRUCTURE FIXED)
    // ─────────────────────────────
    const structuredArticles = (articles || [])
      .filter((a) => a?.text)
      .map((a, index) => {
        const match =
          a.text.match(/(الفصل|المادة|Article)\s*\d+/i)?.[0] ||
          "UNKNOWN_ARTICLE";

        return {
          id: index + 1,
          article: match,
          text: a.text.trim(),
        };
      });

    const context = structuredArticles
      .map((a) => `📜 [${a.article}] ${a.text}`)
      .join("\n\n--------------------\n\n");

    const safeContext =
      context && context.length > 0
        ? context
        : "⚠️ NO RAG DATA FOUND IN LEGAL DATABASE";

    // ─────────────────────────────
    // 🧠 FORENSICS BLOCK (SAFE)
    // ─────────────────────────────
    const forensicBlock = forensics
      ? `
════════ FORENSIC ANALYSIS ════════

👥 الأطراف:
${forensics.actors?.join(", ") || "غير محدد"}

⏱️ الأحداث:
${(forensics.events || []).join("\n") || "غير متوفر"}

🔎 الأدلة:
${(forensics.evidence || []).join("\n") || "غير متوفر"}

⚠️ التناقضات:
${JSON.stringify(forensics.contradictions || [], null, 2)}

📊 المصداقية:
${forensics.credibilityScore ?? "غير محسوب"}

══════════════════════════════
`
      : "NO FORENSIC DATA";

    // ─────────────────────────────
    // ⚖️ FINAL LEGAL PROMPT (STABLE + NO HALLUCINATION)
    // ─────────────────────────────
    const prompt = `
You are a Tunisian Legal AI System (WESTLAW RAG v7).

────────────────────────────
RULES (STRICT)
────────────────────────────
- Use ONLY provided RAG text
- NEVER invent articles
- If missing → "غير متوفر في قاعدة البيانات"
- No external law
- No hallucination

────────────────────────────
CASE
────────────────────────────
${caseText}

────────────────────────────
RAG ARTICLES
────────────────────────────
${safeContext}

────────────────────────────
FORENSICS
────────────────────────────
${forensicBlock}

────────────────────────────
TASK
────────────────────────────
1. Extract legal articles
2. Link each article to facts
3. Explain legal reasoning
4. Give verdict probability

────────────────────────────
OUTPUT FORMAT
────────────────────────────

A) COURT REPORT (Arabic)
- الوقائع
- المواد القانونية المستخدمة
- تحليل قانوني واضح
- التعليل

B) ARTICLE MAP
Format:
- المادة → النص → السبب → العلاقة بالقضية

C) JSON OUTPUT

{
  "case_type": "",
  "crime_category": "",
  "articles_used": [
    {
      "article": "",
      "text": "",
      "reason": ""
    }
  ],
  "legal_mapping": "",
  "evidence_score": {
    "low": 0,
    "medium": 0,
    "high": 0
  },
  "guilt_probability": 0,
  "confidence_score": 0,
  "verdict": "",
  "risk_level": "LOW | MEDIUM | HIGH",
  "rag_mode": "WESTLAW_RAG_V7"
}

────────────────────────────
FINAL RULE
────────────────────────────
If no article found:
→ return "غير متوفر في RAG"
`;

    console.log("📡 CALLING AI (CLEAN RAG V7)...");

    const response = await ai(prompt, {
      temperature: 0.05,
    });

    if (!response || response.length < 20) {
      return {
        success: false,
        error: "EMPTY_AI_RESPONSE",
      };
    }

    return {
      success: true,
      analysis: response,
      meta: {
        engine: "WESTLAW_RAG_V7_CLEAN",
        features: [
          "RAG_ONLY",
          "ARTICLE_ENGINE",
          "NO_HALLUCINATION",
          "LEGAL_MAPPING",
        ],
      },
    };
  } catch (err) {
    console.error("❌ legalEngine error:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
