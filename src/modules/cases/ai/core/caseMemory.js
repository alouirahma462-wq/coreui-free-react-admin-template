const caseMemoryDB = [];

/**
 * 🧠 Store case outcome with structured pattern
 */
export function storeCaseOutcome(caseInput = {}, legalDecision = {}) {
  if (!caseInput || !legalDecision) return;

  const record = {
    pattern: extractPattern(caseInput),
    outcome: legalDecision.verdict || "UNKNOWN",
    confidence: legalDecision.probability ?? legalDecision.confidence ?? 0.5,
    timestamp: Date.now(),
  };

  caseMemoryDB.push(record);

  // 🧹 prevent memory explosion (keep last 1000 cases)
  if (caseMemoryDB.length > 1000) {
    caseMemoryDB.shift();
  }
}

/**
 * 🔥 Extract structured pattern from case
 */
function extractPattern(caseInput = {}) {
  return {
    crimeTypes: normalizeArray(caseInput.crime_type),
    actorCount: Array.isArray(caseInput.actors)
      ? caseInput.actors.length
      : 0,
    evidenceCount: Array.isArray(caseInput.evidence)
      ? caseInput.evidence.length
      : 0,
  };
}

/**
 * 🧠 Normalize input to array
 */
function normalizeArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * 🔍 Compute similarity score between two patterns
 */
function similarityScore(a, b) {
  let score = 0;

  // actor similarity
  const actorDiff = Math.abs(a.actorCount - b.actorCount);
  score += Math.max(0, 1 - actorDiff * 0.2);

  // evidence similarity
  const evidenceDiff = Math.abs(a.evidenceCount - b.evidenceCount);
  score += Math.max(0, 1 - evidenceDiff * 0.2);

  // crime type overlap
  const overlap = a.crimeTypes.filter(t =>
    b.crimeTypes.includes(t)
  ).length;

  const union = new Set([...a.crimeTypes, ...b.crimeTypes]).size || 1;
  score += overlap / union;

  return score / 3; // normalize
}

/**
 * 🔥 Retrieve similar cases (REAL AI-style memory)
 */
export function getSimilarCases(caseInput = {}, threshold = 0.6) {
  const current = extractPattern(caseInput);

  return caseMemoryDB
    .map(record => ({
      ...record,
      similarity: similarityScore(current, record.pattern),
    }))
    .filter(r => r.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);
}

/**
 * 📊 Debug helper
 */
export function getMemorySize() {
  return caseMemoryDB.length;
}
