import { embedText } from "./embeddings.js"
import { lawDB } from "./lawDB.js"

export const searchRelevantArticles = async (caseText, k = 5) => {
  console.log("🔎 Searching vector DB...")

  if (!lawDB.instance || !lawDB.instance.vectors.length) {
    console.log("⚠️ Vector DB EMPTY")
    return []
  }

  const queryVector = await embedText(caseText)

  const results = lawDB.instance.search(queryVector, k)

  return results
}
