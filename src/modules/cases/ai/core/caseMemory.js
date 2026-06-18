// 🧠 Case Memory Learning Engine
// النظام يتعلم من القضايا السابقة

const caseMemoryDB = [];

export function storeCaseOutcome(caseInput, legalDecision) {
  caseMemoryDB.push({
    pattern: extractPattern(caseInput),
    outcome: legalDecision.verdict,
    confidence: legalDecision.probability,
    timestamp: Date.now(),
  });
}

// 🔥 استخراج نمط القضية
function extractPattern(caseInput) {
  return {
    crimeTypes: caseInput.crime_type || [],
    actorCount: caseInput.actors?.length || 0,
    evidenceCount: caseInput.evidence?.length || 0,
  };
}

// 🔥 استرجاع حالات مشابهة
export function getSimilarCases(caseInput) {
  const current = extractPattern(caseInput);

  return caseMemoryDB.filter(c => {
    return (
      c.pattern.actorCount === current.actorCount &&
      c.pattern.crimeTypes?.length === current.crimeTypes?.length
    );
  });
}
