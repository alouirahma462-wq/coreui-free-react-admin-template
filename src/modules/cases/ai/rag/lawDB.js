import { embedText } from "./embeddings.js"
import { VectorStore } from "./vectorStore.js"

export const lawDB = new VectorStore()

export const loadLawsIntoVectorDB = async (articles) => {
  try {
    if (!Array.isArray(articles)) {
      throw new Error("articles must be array")
    }

    console.log("⚙️ Starting embedding + indexing...")

    const batch = []

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]
      if (!article?.text) continue

      const vector = await embedText(article.text)

      batch.push({
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

    lawDB.add(batch)

    console.log("✅ Indexing complete:", batch.length)

  } catch (err) {
    console.error("❌ loadLawsIntoVectorDB error:", err)
  }
}
