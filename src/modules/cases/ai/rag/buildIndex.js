import { loadAllLaws } from "./lawLoader.js"
import { lawDB } from "./lawDB.js"

export const buildIndex = async () => {
  console.log("📚 Loading Tunisian law PDFs...")

  const chunks = await loadAllLaws()

  console.log("🧠 Creating embeddings + indexing...")

  await lawDB.addArticles(chunks)

  console.log("✅ LEGAL INDEX READY")
}
