import { embedText } from "./embeddings.js"
import { VectorStore } from "./vectorStore.js"

export const lawDB = new VectorStore()

export const loadLawsIntoVectorDB = async (articles) => {
  try {

    if (!Array.isArray(articles)) {
      throw new Error("articles must be array")
    }

    console.log("⚙️ Starting embedding + indexing...")

    const vectors = []

    for (let i = 0; i < articles.length; i++) {

      const article = articles[i]

      if (!article?.text || article.text.trim().length < 5) continue

      // 🔥 embedding
      const vector = await embedText(article.text)

      vectors.push({
        vector,
        metadata: {
          id: article.id ?? i,
          text: article.text
        }
      })

      // 📊 progress tracking (important for debugging)
      if (i % 50 === 0) {
        console.log(`📌 Indexed ${i}/${articles.length}`)
      }
    }

    if (vectors.length === 0) {
      throw new Error("No valid vectors generated")
    }

    console.log("📦 Sending vectors to VectorStore...")

    // 🔥 IMPORTANT FIX: ensure correct array format
    lawDB.add(vectors)

    console.log(`✅ Laws indexed successfully: ${vectors.length}`)

  } catch (err) {
    console.error("❌ loadLawsIntoVectorDB error:", err)
  }
}
