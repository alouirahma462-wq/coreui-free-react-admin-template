import { embedText } from "../embeddings.js";
import { lawDB } from "./lawDB.js";

export const retrieveArticles = async (query, k = 5) => {
  const vector = await embedText(query);

  const results = lawDB.instance.search(vector, k);

  return results.map(r => ({
    ...r,
    weight: r.text?.length || 1
  }));
};
