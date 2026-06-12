import { embedText } from "./embeddings.js";
import { lawDB } from "./lawDB.js";

/**
 * ⚖️ CLEAN LEGAL SEARCH ENGINE
 */
export const searchLaw = async (query, k = 5) => {
  const vector = await embedText(query);

  const results = lawDB.search(vector, k);

  return results.map(r => ({
    title: r.title || "unknown",
    text: r.text,
    page: r.page,
    id: r.id
  }));
};
