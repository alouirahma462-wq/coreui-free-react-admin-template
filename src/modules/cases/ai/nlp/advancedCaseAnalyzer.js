export const advancedCaseAnalyzer = (text) => {
  const lines = text.split(/\n|\./g).filter(l => l.trim())

  const witnesses = []
  const evidence = []
  const timeline = []

  for (const line of lines) {

    // شهود
    if (line.includes("قال") || line.includes("شهد")) {
      witnesses.push(line.trim())
    }

    // أدلة
    if (line.includes("تم العثور") || line.includes("دليل") || line.includes("سلاح")) {
      evidence.push(line.trim())
    }

    // أحداث زمنية (بسيط)
    if (line.includes("في") || line.includes("سنة") || line.includes("يوم")) {
      timeline.push(line.trim())
    }
  }

  return {
    witnesses,
    evidence,
    timeline,
    riskLevel: evidence.length > 2 ? "HIGH" : "MEDIUM"
  }
}
