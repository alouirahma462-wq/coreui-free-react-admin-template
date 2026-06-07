import { embedText } from "./embeddings.js"
import { VectorStore } from "./vectorStore.js"

export const lawDB = new VectorStore(384)

export const loadLawsIntoVectorDB = async (articles) => {
  try {
    console.log("⚙️ Starting embedding + indexing...")

    if (!Array.isArray(articles)) {
      throw new Error("articles must be an array")
    }

    const items = []

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]

      if (!article || !article.text) continue

      const vector = await embedText(article.text)

      if (!Array.isArray(vector) || vector.length !== 384) continue

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

    // 🔥 FIX: ensure always array + not empty
    if (items.length === 0) {
      throw new Error("No valid items to index")
    }

    lawDB.add(items)

    console.log("✅ DONE. Total:", items.length)

  } catch (err) {
    console.error("❌ loadLawsIntoVectorDB error:", err)
  }
}
