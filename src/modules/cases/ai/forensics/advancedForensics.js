export const advancedForensics = (text) => {

  const sentences = text.split(/\n|\.|،/g).filter(s => s.trim())

  const actors = new Set()
  const events = []
  const evidence = []
  const contradictions = []

  let lastMention = null

  for (const s of sentences) {

    // 👥 actors
    if (s.includes("قال") || s.includes("صرّح")) {
      actors.add("شاهد")
    }

    // 🔎 evidence
    if (s.includes("تم العثور") || s.includes("سلاح") || s.includes("دليل")) {
      evidence.push(s.trim())
    }

    // ⏱ timeline
    if (s.includes("في") || s.includes("يوم") || s.includes("سنة")) {
      events.push(s.trim())
    }

    // ⚠️ simple contradiction detection
    if (lastMention && s.includes("لكن") || s.includes("غير")) {
      contradictions.push({
        from: lastMention,
        to: s.trim()
      })
    }

    lastMention = s
  }

  return {
    actors: Array.from(actors),
    events,
    evidence,
    contradictions,
    credibilityScore: evidence.length - contradictions.length
  }
}
