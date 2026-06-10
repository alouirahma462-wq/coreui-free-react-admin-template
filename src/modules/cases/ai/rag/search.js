import { embedText } from "./embeddings.js";
import { lawDB } from "./lawDB.js";

export const searchRelevantArticles = async (caseText, k = 5) => {
  if (!lawDB.vectors.length) {
    console.log("⚠️ Vector DB EMPTY");
    return [];
  }

  const queryVector = await embedText(caseText);

  const results = lawDB.search(queryVector, k);

  return results
    .filter(r => r?.text || r?.metadata?.text)
    .map(r => ({
      text: r.text || r.metadata.text,
      id: r.id
    }));
};
