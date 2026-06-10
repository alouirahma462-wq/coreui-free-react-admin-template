import { VectorStore } from "./vectorStore.js";

const GLOBAL_KEY = "__LAW_DB_SINGLETON__";

// ✅ Singleton (حل مشكلة [])
export const lawDB =
  globalThis[GLOBAL_KEY] || new VectorStore(384);

globalThis[GLOBAL_KEY] = lawDB;

// =========================
// ADD TO VECTOR DB
// =========================
export const loadLawsIntoVectorDB = async (articles) => {
  console.log("⚙️ Starting embedding + indexing...");

  const items = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    if (!article?.text) continue;

    const vector = article.vector;
    if (!Array.isArray(vector)) continue;

    items.push({
      vector,
      metadata: {
        id: article.id ?? i,
        text: article.text
      }
    });

    if (i % 50 === 0) {
      console.log(`📌 Indexed ${i}/${articles.length}`);
    }
  }

  lawDB.add(items);

  console.log("✅ VECTOR DB READY:", items.length);
};
