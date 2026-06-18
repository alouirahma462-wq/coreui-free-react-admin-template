export function buildKnowledgeGraph(caseModel) {
  const nodes = [];
  const edges = [];

  const { actors = [], events = [], facts = [] } = caseModel;

  actors.forEach((a) => nodes.push({ id: a, type: "actor" }));
  events.forEach((e) => nodes.push({ id: e, type: "event" }));
  facts.forEach((f) => nodes.push({ id: f, type: "fact" }));

  actors.forEach((a) => {
    events.forEach((e) => {
      edges.push({
        from: a,
        to: e,
        relation: "connected_to_event"
      });
    });
  });

  return {
    nodes,
    edges,
    complexity_score: nodes.length + edges.length
  };
}
