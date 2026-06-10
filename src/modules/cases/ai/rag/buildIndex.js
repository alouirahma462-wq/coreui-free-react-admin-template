import { loadAllLaws } from "./lawLoader.js";
import { loadLawsIntoVectorDB } from "./lawDB.js";
import { embedText } from "./embeddings.js";

export const buildIndex = async () => {
  console.log("📚 Loading Tunisian law PDFs...");

  const chunks = await loadAllLaws();

  console.log("🧠 Creating embeddings...");

  // embed ALL chunks
  const enriched = [];

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i].text;
    if (!text) continue;

    const vector = await embedText(text);

    enriched.push({
      text,
      vector,
      id: i
    });

    if (i % 50 === 0) {
      console.log(`🧠 Embedding ${i}/${chunks.length}`);
    }
  }

  console.log("📦 Loading into Vector DB...");

  await loadLawsIntoVectorDB(enriched);

  console.log("✅ LEGAL INDEX READY");
};
