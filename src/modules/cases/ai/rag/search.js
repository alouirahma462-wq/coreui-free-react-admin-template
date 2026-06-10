import { embedText } from "./embeddings.js";
import { lawDB } from "./lawDB.js";

export const searchRelevantArticles = async (caseText, k = 5) => {
  if (!lawDB.vectors || lawDB.vectors.length === 0) {
    console.log("⚠️ Vector DB EMPTY");
    return [];
  }

  const queryVector = await embedText(caseText);

  return lawDB.search(queryVector, k)
    .map(r => ({
      text: r.text || r.metadata?.text,
      id: r.id
    }));
};
