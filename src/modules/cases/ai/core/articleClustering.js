import { embedText } from "../storage/embeddings.js";

// 🔥 تعريف ذكي للـ clusters (semantic anchors)
const CLUSTER_SEEDS = {
  theft: "سرقة theft vol vol de vol stealing property",
  violence: "عنف violence assault ضرب اعتداء physical attack",
  fraud: "تحيل fraud fraude تزوير false documents scam",
};

function cosineSimilarity(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }

  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

/**
 * 🧠 AI CLUSTERING ENGINE (REAL SEMANTIC VERSION)
 */
export const clusterArticles = async (articles = []) => {
  const clusters = {
    theft: [],
    violence: [],
    fraud: [],
    unknown: [],
  };

  // 🔥 1. embed cluster seeds once
  const seedVectors = {};
  for (const key of Object.keys(CLUSTER_SEEDS)) {
    seedVectors[key] = await embedText(CLUSTER_SEEDS[key]);
  }

  // 🔥 2. classify each article
  for (const article of articles) {
    const text = article?.text || "";

    if (!text.trim()) {
      clusters.unknown.push(article);
      continue;
    }

    const vector = await embedText(text);

    let bestCluster = "unknown";
    let bestScore = -1;

    for (const [cluster, seedVec] of Object.entries(seedVectors)) {
      const score = cosineSimilarity(vector, seedVec);

      if (score > bestScore) {
        bestScore = score;
        bestCluster = cluster;
      }
    }

    // 🔥 threshold (avoid wrong classification)
    if (bestScore < 0.45) {
      clusters.unknown.push(article);
    } else {
      clusters[bestCluster].push({
        ...article,
        clusterScore: bestScore,
      });
    }
  }

  return clusters;
};
