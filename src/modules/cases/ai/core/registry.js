import * as services from "../services/client.js";
import * as embeddings from "../storage/embeddings.js";
import * as vectorStore from "../storage/vectorStore.js";

import * as legalEngine from "../domain/legalEngine.js";
import * as judgeEngine from "../domain/judgeEngine.js";

import * as reasoning from "../reasoning/legalReasoning.js";
import * as explainability from "../reasoning/explainabilityLayer.js";

import * as graph from "../graph/knowledgeGraph.js";
import * as evidence from "../evidence/bayesianEvidence.js";

/* ================================
   🧠 SINGLE ACCESS POINT (AI CORE)
================================ */
export const AI = {
  services,
  embeddings,
  vectorStore,

  legalEngine,
  judgeEngine,

  reasoning,
  explainability,

  graph,
  evidence
};
