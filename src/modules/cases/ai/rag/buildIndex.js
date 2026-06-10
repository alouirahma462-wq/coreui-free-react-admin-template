import { loadAllLaws } from "./lawLoader.js";
import { loadLawsIntoVectorDB } from "./lawDB.js";

export const buildIndex = async () => {
  console.log("📚 Loading Tunisian law PDFs...");

  const chunks = await loadAllLaws();

  console.log("🧠 Creating embeddings + indexing...");

  await loadLawsIntoVectorDB(chunks);

  console.log("✅ LEGAL INDEX READY");
};
