import { ai } from "../services/client.js";

/**
 * ⚖️ LEXIS JUDGE ENGINE v10 — ULTRA GOD MODE
 * Constitutional + Precedent + Learning Legal AI
 */

const precedentMemory = []; // 🧠 memory of past cases

export const judgeEngine = async (caseText, analysis) => {
  try {
    console.log("⚖️ JUDGE ENGINE v10 ULTRA GOD MODE START");

    if (!caseText || !analysis) {
      throw new Error("MISSING_INPUTS");
    }

    // ================================
    // 🧠 CONSTITUTIONAL FILTER
    // ================================
    const constitutionalContext = applyConstitutionalRules(caseText, analysis);

    // ================================
    // 🧠 MULTI-JUDGE SYSTEM
    // ================================
    const judges = await Promise.all([
      runJudge("PROSECUTION", caseText, analysis, constitutionalContext),
      runJudge("DEFENSE", caseText, analysis, constitutionalContext),
      runJudge("NEUTRAL", caseText, analysis, constitutionalContext),
    ]);

    // ================================
    // 🧬 CONTRADICTION GRAPH
    // ================================
    const contradictionGraph = buildContradictionGraph(judges);

    // ================================
    // 📚 PRECEDENT MATCHING
    // ================================
    const precedent = matchPrecedent(caseText, analysis);

    // ================================
    // ⚖️ ADVERSARIAL REVIEW
    // ================================
    const adversarial = await runJudge(
      "ADVERSARIAL_CRITIC",
      caseText,
      analysis,
      constitutionalContext,
      judges
    );

    // ================================
    // 📊 WEIGHTED FINAL VERDICT
    // ================================
    const final = computeWeightedVerdict(
      judges,
      adversarial,
      precedent,
      contradictionGraph
    );

    // ================================
    // 🧠 SELF LEARNING UPDATE
    // ================================
    updatePrecedentMemory(caseText, final);

    return {
      success: true,
      verdict: final.verdict,
      confidence: final.confidence,
      precedent,
      contradictionGraph,
      judges,
      adversarial,
      meta: {
        engine: "LEXIS-JUDGE-V10-ULTRA-GODMODE",
        system: "CONSTITUTIONAL_PRECEDENT_LEARNING_AI",
      },
    };
  } catch (err) {
    console.error("❌ judgeEngine v10 error:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};

/* ================================
   ⚖️ JUDGE RUNNER
================================ */
async function runJudge(role, caseText, analysis, constitutionalContext, previous = []) {
  const prompt = `
You are a ${role} Supreme Constitutional Judge AI.

You MUST respect constitutional constraints:
${constitutionalContext}

ANALYSIS:
${analysis}

CASE:
${caseText}

PRECEDENT SIGNAL:
${JSON.stringify(previous || [])}

OUTPUT ONLY JSON:
{
  "verdict": "GUILTY | NOT_GUILTY | PROBABLE_GUILT | INSUFFICIENT_PROOF",
  "confidence": number (0-100),
  "reason": "string",
  "key_factors": ["string"],
  "criticism": "string",
  "constitutional_risk": "LOW | MEDIUM | HIGH"
}
`;

  let raw = await ai(prompt);
  let parsed = safeParse(raw);

  if (!parsed) {
    parsed = {
      verdict: "INSUFFICIENT_PROOF",
      confidence: 35,
      reason: "PARSING_FAILURE",
      key_factors: [],
      criticism: "INVALID_OUTPUT",
      constitutional_risk: "HIGH",
    };
  }

  return validateJudge(parsed);
}

/* ================================
   🧠 CONSTITUTIONAL ENGINE
================================ */
function applyConstitutionalRules(caseText, analysis) {
  return `
- Human rights must be prioritized
- Presumption of innocence applies
- Doubt favors accused
- Evidence must be verifiable
- No inference without legal grounding
- No contradiction with EU / Tunisian criminal principles
`;
}

/* ================================
   🛰 CONTRADICTION GRAPH
================================ */
function buildContradictionGraph(judges) {
  const contradictions = [];

  for (let i = 0; i < judges.length; i++) {
    for (let j = i + 1; j < judges.length; j++) {
      if (judges[i].verdict !== judges[j].verdict) {
        contradictions.push({
          between: [judges[i].verdict, judges[j].verdict],
          severity:
            Math.abs(judges[i].confidence - judges[j].confidence),
        });
      }
    }
  }

  return {
    count: contradictions.length,
    contradictions,
    risk:
      contradictions.length > 2 ? "HIGH_CONFLICT" : "STABLE",
  };
}

/* ================================
   📚 PRECEDENT SYSTEM
================================ */
function matchPrecedent(caseText, analysis) {
  const matches = precedentMemory.filter((p) =>
    p.caseText?.length > 20 &&
    caseText.includes(p.signature || "")
  );

  return {
    count: matches.length,
    strength: matches.length > 2 ? "STRONG" : "WEAK",
  };
}

/* ================================
   🧬 MEMORY UPDATE
================================ */
function updatePrecedentMemory(caseText, final) {
  precedentMemory.push({
    caseText,
    verdict: final.verdict,
    confidence: final.confidence,
    signature: caseText.slice(0, 30),
  });
}

/* ================================
   📊 WEIGHTED VERDICT ENGINE
================================ */
function computeWeightedVerdict(judges, adversarial, precedent, graph) {
  let score = 0;

  for (const j of judges) {
    let weight = j.confidence / 100;

    if (j.verdict === "GUILTY") score += weight;
    if (j.verdict === "NOT_GUILTY") score -= weight;
  }

  if (adversarial?.confidence > 70) score *= 0.9;
  if (precedent.strength === "STRONG") score *= 1.1;
  if (graph.risk === "HIGH_CONFLICT") score *= 0.85;

  let verdict = "INSUFFICIENT_PROOF";

  if (score > 0.6) verdict = "GUILTY";
  else if (score < -0.6) verdict = "NOT_GUILTY";
  else if (Math.abs(score) > 0.3) verdict = "PROBABLE_GUILT";

  return {
    verdict,
    confidence: Math.min(100, Math.abs(score) * 100),
  };
}

/* ================================
   🧠 VALIDATION
================================ */
function validateJudge(j) {
  return {
    verdict: j.verdict || "INSUFFICIENT_PROOF",
    confidence: Math.max(0, Math.min(100, j.confidence || 40)),
    reason: j.reason || "NO_REASON",
    key_factors: j.key_factors || [],
    criticism: j.criticism || "",
    constitutional_risk: j.constitutional_risk || "MEDIUM",
  };
}

/* ================================
   🧾 SAFE PARSER
================================ */
function safeParse(text) {
  try {
    if (!text) return null;
    return JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    return null;
  }
}
