export function buildCaseGraph(caseInput) {
  const nodes = [];
  const edges = [];
  const contradictions = [];

  for (const actor of caseInput.actors || []) {
    nodes.push({ id: actor.id, type: "actor" });
  }

  for (const event of caseInput.events || []) {
    nodes.push({ id: event.id, type: "event" });

    edges.push({
      from: event.actor,
      to: event.id,
      relation: "performed",
    });
  }

  // 🔥 contradiction detection (simple AI logic)
  for (const w1 of caseInput.witnesses || []) {
    for (const w2 of caseInput.witnesses || []) {
      if (w1.statement !== w2.statement && w1.target === w2.target) {
        contradictions.push(`${w1.id}-${w2.id}`);
      }
    }
  }

  return {
    nodes,
    edges,
    contradictions,
  };
}
