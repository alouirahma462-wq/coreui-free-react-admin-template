import { ai } from "../services/client.js";
import { getSimilarCases, storeCaseOutcome } from "../core/caseMemory.js";

export const legalEngine = async (
  caseText,
  articles = [],
  forensics = null
) => {
  try {
    console.log("📌 LEGAL ENGINE v10 FINAL DECISION MODE");

    if (!caseText) throw new Error("MISSING_CASE");

    // ================================
    // 🧠 CASE MEMORY
    // ================================
    const memoryCases = getSimilarCases({
      crime_type: caseText,
      actors: forensics?.actors,
      evidence: forensics?.evidence,
    });

    const memoryContext =
      memoryCases.length > 0
        ? memoryCases
            .slice(0, 3)
            .map(
              (m) =>
                `🧠 PREVIOUS CASE → ${m.outcome} | confidence ${m.confidence}`
            )
            .join("\n")
        : "NO_RELEVANT_MEMORY";

    // ================================
    // 📚 RAG ARTICLES
    // ================================
    const structuredArticles = (articles || [])
      .filter((a) => a?.text)
      .map((a, i) => {
        const article =
          a.text.match(/(الفصل|المادة|Article)\s*\d+/i)?.[0] ||
          "UNKNOWN";

        return {
          id: i,
          article,
          text: a.text,
          score: scoreArticle(a.text, caseText),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    const context = structuredArticles
      .map((a) => `📜 ${a.article}\n${a.text}`)
      .join("\n\n---\n\n");

    // ================================
    // 🧠 FORENSICS
    // ================================
    const forensicBlock = buildForensics(forensics);

    // ================================
    // ⚖️ SUPREME COURT SIMULATION
    // ================================
    const judges = await Promise.all([
      runJudge("PROSECUTION", caseText, context, forensicBlock),
      runJudge("DEFENSE", caseText, context, forensicBlock),
      runJudge("NEUTRAL", caseText, context, forensicBlock),
    ]);

    const synthesis = synthesizeJudges(judges);

    // ================================
    // 🧠 FINAL META JUDGE
    // ================================
    const prompt = `
You are FINAL SUPREME COURT META JUDGE.

You MUST produce structured judgment data ONLY.

CASE:
${caseText}

JUDGES:
${JSON.stringify(judges, null, 2)}

SYNTHESIS:
${JSON.stringify(synthesis, null, 2)}

Return ONLY JSON:

{
  "verdict": "",
  "confidence": 0,
  "legal_strength": "LOW | MEDIUM | HIGH",
  "agreement_level": 0,
  "risk_level": "LOW | MEDIUM | HIGH",
  "reasoning": "string",
  "decision_type": "CONSENSUS | SPLIT | CONFLICT"
}
`;

    const response = await ai(prompt, { temperature: 0.01 });

    const parsed = safeParse(response);
    if (!parsed) return { success: false, error: "PARSE_FAILED" };

    const validated = validate(parsed);

    // ================================
    // 🧠 🔥 DECISION COMPILER (NEW CORE UPGRADE)
    // ================================
    const finalDecision = compileFinalDecision(validated, judges, synthesis);

    // ================================
    // 🧠 LEARNING LOOP
    // ================================
    storeCaseOutcome(
      {
        crime_type: caseText,
        actors: forensics?.actors,
        evidence: forensics?.evidence,
      },
      {
        verdict: finalDecision.verdict,
        probability: finalDecision.confidence / 100,
      }
    );

    return {
      success: true,

      // 🔥 FINAL COURT OUTPUT (NOT JUST ANALYSIS)
      judgment: finalDecision,

      court: {
        judges,
        synthesis,
        meta_judgment: validated,
      },

      meta: {
        engine: "LEXIS_V10_FINAL_DECISION",
        features: [
          "MULTI_JUDGE_SYSTEM",
          "DECISION_COMPILER",
          "CONSENSUS_RESOLUTION",
          "LEARNING_LOOP",
        ],
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/* ================================
   ⚖️ 🔥 FINAL DECISION COMPILER (CORE UPGRADE)
================================ */
function compileFinalDecision(meta, judges, synthesis) {
  const votes = synthesis.votes;

  const confidenceBoost =
    synthesis.agreement_level > 0.6 ? 10 : -10;

  const finalConfidence = Math.max(
    0,
    Math.min(100, meta.confidence + confidenceBoost)
  );

  // 🧠 Majority rule enforcement
  let verdict = Object.keys(votes).reduce((a, b) =>
    votes[a] > votes[b] ? a : b
  );

  // ⚖️ conflict override
  if (synthesis.agreement_level < 0.5) {
    verdict = "CONFLICTING_EVIDENCE";
  }

  return {
    verdict,
    confidence: finalConfidence,
    strength: meta.legal_strength,
    agreement: synthesis.agreement_level,
    decision_type: meta.decision_type,

    // 🔥 REAL COURT OUTPUT
    ruling: `
FINAL COURT DECISION:

- Verdict: ${verdict}
- Confidence: ${finalConfidence}%
- Agreement: ${synthesis.agreement_level}
- Legal Strength: ${meta.legal_strength}
- Decision Type: ${meta.decision_type}
    `.trim(),
  };
}

/* ================================
   ⚖️ JUDGE RUNNER
================================ */
async function runJudge(role, caseText, context, forensic) {
  const prompt = `
${role} Judge.

Return JSON ONLY:
{
  "vote": "GUILTY | NOT_GUILTY | UNCERTAIN",
  "confidence": 0-100,
  "reason": "string",
  "key_factors": ["string"]
}

CASE:
${caseText}

ARTICLES:
${context}

FORENSICS:
${forensic}
`;

  const res = await ai(prompt, { temperature: 0.02 });
  const parsed = safeParse(res);

  return (
    parsed || {
      vote: "UNCERTAIN",
      confidence: 40,
      reason: "parse_failed",
      key_factors: [],
    }
  );
}

/* ================================
   🧠 SYNTHESIS ENGINE
================================ */
function synthesizeJudges(judges) {
  const votes = { GUILTY: 0, NOT_GUILTY: 0, UNCERTAIN: 0 };
  let confidence = 0;

  for (const j of judges) {
    votes[j.vote] = (votes[j.vote] || 0) + 1;
    confidence += j.confidence || 0;
  }

  return {
    votes,
    agreement_level:
      Math.max(...Object.values(votes)) / judges.length,
    avg_confidence: Math.round(confidence / judges.length),
  };
}

/* ================================
   📚 ARTICLE SCORING
================================ */
function scoreArticle(text, query) {
  let score = 0;
  if (/قانون|جريمة|crime|law/i.test(text)) score += 0.4;
  if (text.length > 400) score += 0.2;
  if (query && text.includes(query)) score += 0.4;
  return score;
}

/* ================================
   🧠 FORENSIC BUILDER
================================ */
function buildForensics(f) {
  if (!f) return "NO_FORENSIC_DATA";

  return `
Actors: ${f.actors?.join(", ") || "N/A"}
Events: ${f.events?.join(", ") || "N/A"}
Evidence: ${f.evidence?.join(", ") || "N/A"}
Contradictions: ${JSON.stringify(f.contradictions || [])}
`;
}

/* ================================
   🧾 SAFE PARSER
================================ */
function safeParse(text) {
  try {
    return JSON.parse(text.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch {
    return null;
  }
}

/* ================================
   ⚖️ VALIDATION
================================ */
function validate(data) {
  data.confidence = Math.max(0, Math.min(100, data.confidence || 50));
  if (!data.verdict) data.verdict = "UNCERTAIN";
  return { ...data, validated: true };
}
