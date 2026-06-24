import fs from "fs";

//
// 🧠 PHASE 3 — LEGAL GPT BRAIN
//

export class LegalBrain {

  constructor(graph) {
    this.graph = graph;
  }

  // =========================
  // 🔍 1. SEMANTIC SEARCH (SIMULATED GPT EMBEDDING)
  // =========================
  findSimilarCases(query) {

    const results = this.graph.nodes.map(node => {

      const similarity =
        this._similarity(query, node.text);

      return {
        nodeId: node.id,
        similarity,
        case_type: node.ai?.case_type,
        decision: node.ai?.judgment?.decision
      };
    });

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  // =========================
  // 🧠 2. CASE PREDICTION (GPT STYLE LOGIC)
  // =========================
  predictOutcome() {

    let guilt = 0;
    let total = 0;

    for (const node of this.graph.nodes) {

      const p = node.ai?.judgment?.probabilities?.probability_guilt;

      if (p !== undefined) {
        guilt += p;
        total++;
      }
    }

    const avg = total ? guilt / total : 0;

    return {
      probability_of_conviction: avg.toFixed(2),
      verdict:
        avg > 0.7 ? "إدانة قوية 🟢" :
        avg > 0.4 ? "قضية غير محسومة 🟡" :
        "براءة محتملة 🔴"
    };
  }

  // =========================
  // 📄 3. LEGAL BRIEF GENERATOR (REPORT)
  // =========================
  generateLegalBrief() {

    const caseType = this._majorityCaseType();

    return {
      title: "📄 مذكرة قانونية ذكية (AI Generated)",
      case_type: caseType,

      facts: this._collectFacts(),

      analysis: this.predictOutcome(),

      recommendation:
        caseType === "جزائي"
          ? "يرجح التوجه لإثبات النية الجنائية"
          : "الملف يحتاج دعم قانوني إضافي",

      citations: this._extractKeyNodes()
    };
  }

  // =========================
  // 🧠 HELPERS
  // =========================
  _similarity(a, b) {
    const setA = new Set(a.split(" "));
    const setB = new Set(b.split(" "));

    const intersection = [...setA].filter(x => setB.has(x)).length;

    return intersection / Math.max(setA.size, setB.size);
  }

  _majorityCaseType() {
    const map = {};

    for (const n of this.graph.nodes) {
      const t = n.ai?.case_type || "عام";
      map[t] = (map[t] || 0) + 1;
    }

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || "عام";
  }

  _collectFacts() {
    return this.graph.nodes
      .flatMap(n => n.ai?.facts || [])
      .slice(0, 15);
  }

  _extractKeyNodes() {
    return this.graph.nodes
      .filter(n => n.ai?.judgment)
      .slice(0, 5)
      .map(n => ({
        page: n.id,
        decision: n.ai.judgment.decision
      }));
  }
}
