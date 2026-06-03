import { embedText } from "./embedding.js"
import { lawDB } from "./lawDB.js"

export const searchRelevantArticles = async (caseText, k = 5) => {
  const queryVector = await embedText(caseText)

  return lawDB.search(queryVector, k)
}
