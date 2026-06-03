import { embedText } from "./embedding.js"
import { VectorStore } from "./vectorStore.js"

export const lawDB = new VectorStore()

export const loadLawsIntoVectorDB = async (articles) => {
  for (const article of articles) {
    const vector = await embedText(article.text)

    lawDB.add(vector, {
      id: article.id,
      text: article.text
    })
  }

  console.log("✅ Laws indexed into Vector DB")
}
