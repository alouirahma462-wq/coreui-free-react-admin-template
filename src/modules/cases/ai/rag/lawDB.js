import { embedText } from "./embeddings.js"
import { VectorStore } from "./vectorStore.js"

export const lawDB = new VectorStore(384)

export const loadLawsIntoVectorDB = async (articles) => {
  try {
    console.log("⚙️ Starting embedding + indexing...")

    const items = []

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      if (!article?.text) continue

      const vector = await embedText(article.text)

      if (!vector || vector.length !== 384) continue

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

    console.log("📦 Sending to VectorStore...")

    lawDB.add(items)

    console.log("✅ DONE. Total:", items.length)

  } catch (err) {
    console.error("❌ loadLawsIntoVectorDB error:", err)
  }
}
