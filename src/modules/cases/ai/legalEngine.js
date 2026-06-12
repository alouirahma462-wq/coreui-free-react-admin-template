import { ai } from "./client.js";

export const legalEngine = async (caseText, articles = [], forensics = null) => {
  try {

    console.log("📌 LEGAL ENGINE START (TUNISIAN PRO MAX REAL RAG v6 - ARTICLE ENGINE)");

    // ─────────────────────────────
    // 🧠 ARTICLE ENGINE (NEW)
    // ─────────────────────────────
    const structuredArticles = (articles || [])
      .filter(a => a?.text)
      .map((a, index) => {
        return {
          id: index + 1,
          text: a.text.trim(),
          // محاولة استخراج رقم المادة/الفصل
          match:
            a.text.match(/(الفصل|المادة|Article)\s*\d+/gi)?.[0] ||
            "UNKNOWN_ARTICLE",
        };
      });

    const context = structuredArticles
      .map(a => `📜 [${a.match}] ${a.text}`)
      .join("\n\n--------------------\n\n");

    const safeContext =
      context && context.length > 50
        ? context
        : "⚠️ RAG EMPTY - NO LEGAL TEXT FOUND";

    // ─────────────────────────────
    // 🧠 FORENSIC BLOCK (UNCHANGED BUT CLEAN)
    // ─────────────────────────────
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

    // ─────────────────────────────
    // ⚖️ ADVANCED PROMPT (WESTLAW STYLE)
    // ─────────────────────────────
    const prompt = `
You are a Tunisian Legal AI Judge System (WESTLAW-LEVEL RAG ENGINE).

────────────────────────────────────
📚 RETRIEVAL SYSTEM (REAL RAG ONLY)
────────────────────────────────────
You ONLY use retrieved legal text below.

Each paragraph contains:
- Article/Chapter reference (if available)
- Official Tunisian Penal Code excerpts

NEVER invent articles.

────────────────────────────────────
⚖️ ARTICLE ENGINE RULES (NEW)
────────────────────────────────────
You MUST:

1. Extract legal articles if present
2. Link each legal conclusion to:
   - Article ID
   - Exact text snippet
3. If unclear → "غير محدد في النص"
4. If missing → "غير موجود في قاعدة البيانات"

────────────────────────────────────
🧠 LEGAL CLASSIFICATION ENGINE
────────────────────────────────────
Map crimes:

- السرقة → theft
- العنف → assault
- التحيل → fraud
- التهديد → threat

If no match:
→ "تصنيف عام وفق القانون التونسي"

────────────────────────────────────
📊 EVIDENCE SCORING
────────────────────────────────────
- LOW (0–40)
- MEDIUM (41–70)
- HIGH (71–100)

Only based on RAG evidence.

────────────────────────────────────
🧠 CASE INPUT
────────────────────────────────────
${caseText}

────────────────────────────────────
📚 STRUCTURED LEGAL RAG
────────────────────────────────────
${safeContext}

────────────────────────────────────
${forensicBlock}

────────────────────────────────────
🚨 OUTPUT FORMAT (STRICT)
────────────────────────────────────

Return:

### 1) COURT REPORT (ARABIC)
Must include:

- كل مادة مستخدمة + مصدرها
- شرح مبسط لكل مادة
- ربط المادة بالوقائع
- فصل/Article extraction

### 2) LEGAL CITATION MAP
Show:

- المادة → النص → الاستخدام → السبب

### 3) JSON OUTPUT

{
  "case_type": "",
  "crime_category": "",
  "actors": [],
  "timeline": [],
  "articles_used": [
    {
      "article": "",
      "source_text": "",
      "usage": ""
    }
  ],
  "evidence": {
    "scores": [],
    "summary": ""
  },
  "legal_mapping": "",
  "guilt_probability": 0,
  "confidence_score": 0,
  "verdict": "",
  "risk_level": "LOW | MEDIUM | HIGH",
  "rag_mode": "WESTLAW_TUNISIAN_RAG_V6"
}

────────────────────────────────────
🚨 FINAL RULES
────────────────────────────────────
- NO hallucinated articles
- NO external laws
- ONLY Tunisian Penal Code
- Every article MUST have source text
- If missing → "غير متوفر في RAG"
`;

    console.log("📡 CALLING AI (WESTLAW RAG v6)...");

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
        engine: "TUNISIAN-LEGAL-WESTLAW-RAG-v6",
        mode: "ARTICLE_ENGINE + RAG + CITATION_MAP",
        features: [
          "ARTICLE_EXTRACTION",
          "SOURCE_LINKING",
          "WESTLAW_STYLE_ANALYSIS",
          "NO_HALLUCINATION",
          "STRUCTURED_OUTPUT"
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
