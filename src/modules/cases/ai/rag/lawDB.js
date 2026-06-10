import { VectorStore } from "./vectorStore.js";

const GLOBAL_KEY = "__TUNISIAN_LAW_DB__";

// ✅ GLOBAL SINGLETON (FIX FINAL)
function getDB() {
  if (!globalThis[GLOBAL_KEY]) {
    globalThis[GLOBAL_KEY] = new VectorStore(384);
  }
  return globalThis[GLOBAL_KEY];
}

export const lawDB = getDB();

export const loadLawsIntoVectorDB = async (articles) => {
  console.log("⚙️ Starting embedding + indexing...");

  const items = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (!article?.vector) continue;

    items.push({
      vector: article.vector,
      metadata: {
        id: article.id ?? i,
        text: article.text
      }
    });

    if (i % 50 === 0) {
      console.log(`📌 Indexed ${i}/${articles.length}`);
    }
  }

  getDB().add(items);

  console.log("✅ VECTOR DB READY:", items.length);
};
