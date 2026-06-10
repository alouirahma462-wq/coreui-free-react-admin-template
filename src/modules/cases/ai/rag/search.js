import { embedText } from "./embeddings.js"
import { lawDB } from "./lawDB.js"

export const searchRelevantArticles = async (caseText, k = 5) => {
  console.log("🔎 Searching vector DB...")

  const queryVector = await embedText(caseText)

  const db = lawDB.instance

  if (!db || db.vectors.length === 0) {
    console.log("⚠️ Vector DB EMPTY")
    return []
  }

  return db.search(queryVector, k)
}
