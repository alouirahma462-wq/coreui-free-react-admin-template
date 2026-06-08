import { VectorStore } from "./vectorStore.js"
import { embedText } from "./embeddings.js"

export const lawDB = new VectorStore(384)

export const loadLawsIntoVectorDB = async (articles) => {
  console.log("⚙️ Starting embedding + indexing...")

  const items = []

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    if (!article?.text) continue

    const vector = await embedText(article.text)

    if (!Array.isArray(vector)) continue
    if (vector.length !== 384) continue

    items.push({
      vector,
      metadata: {
        id: article.id ?? i,
        text: article.text
      }
    })

    if (i % 50 === 0) {
      console.log(`📌 Indexed ${i}/${articles.length}`)
    }
  }

  if (!items.length) {
    throw new Error("No valid items")
  }

  lawDB.add(items)

  console.log("✅ DONE:", items.length)
}
