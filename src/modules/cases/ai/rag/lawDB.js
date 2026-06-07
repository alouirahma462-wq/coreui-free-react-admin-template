import { embedText } from "./embeddings.js"
import { VectorStore } from "./vectorStore.js"

export const lawDB = new VectorStore()

export const loadLawsIntoVectorDB = async (articles) => {
  try {

    if (!Array.isArray(articles)) {
      throw new Error("articles must be array")
    }

    const vectors = []

    for (const article of articles) {

      if (!article?.text) continue

      const vector = await embedText(article.text)

      vectors.push({
        vector,   // embedding
        metadata: {
          id: article.id,
          text: article.text
        }
      })
    }

    // 🔥 IMPORTANT: pass ARRAY not single items
    lawDB.add(vectors)

    console.log("✅ Laws indexed into Vector DB")

  } catch (err) {
    console.error("❌ loadLawsIntoVectorDB error:", err)
  }
}
