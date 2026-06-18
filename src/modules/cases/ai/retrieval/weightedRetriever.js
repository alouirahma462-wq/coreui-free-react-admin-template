import { embedText } from "./embeddings.js";
import { lawDB } from "./lawDB.js";

export const weightedSearch = async (query, k = 5) => {
  const queryVector = await embedText(query);

  const results = lawDB.instance.search(queryVector, 20);

  const scored = results.map((r) => {
    let score = r._score || 0;

    // 🧠 boost if contains article
    if (r.article?.includes("الفصل") || r.article?.includes("المادة")) {
      score += 0.1;
    }

    // 🧠 boost if page exists (closer context priority)
    if (r.page) {
      score += 0.05;
    }

    return {
      ...r,
      final_score: score,
    };
  });

  return scored
    .sort((a, b) => b.final_score - a.final_score)
    .slice(0, k);
};
