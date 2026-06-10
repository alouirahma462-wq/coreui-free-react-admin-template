import { embedText } from "./embeddings.js";
import { lawDB } from "./lawDB.js";

export const searchRelevantArticles = async (caseText, k = 5) => {
  if (!lawDB.vectors.length) {
    console.log("⚠️ Vector DB is empty");
    return [];
  }

  const queryVector = await embedText(caseText);

  const results = lawDB.search(queryVector, k);

  console.log("🔎 SEARCH RESULTS:", results.length);

  return results;
};
