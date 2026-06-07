import { VectorStore } from "./vectorStore.js"
import { embedText } from "./embeddings.js"

// ✔️ هذا لازم يبقى export ثابت
export const lawDB = new VectorStore(384)

export const loadLawsIntoVectorDB = async (articles) => {
  console.log("⚙️ Starting embedding + indexing...")

  if (!Array.isArray(articles)) {
    throw new Error("articles must be array")
  }

  const items = []

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    if (!article?.text) continue

    const vector = await embedText(article.text)

    if (!Array.isArray(vector) || vector.length !== 384) continue

    items.push({
      vector: vector.map(Number),
      metadata: {
        id: article.id ?? i,
        text: article.text
      }
    })

    if (i % 50 === 0) {
      console.log(`📌 Indexed ${i}/${articles.length}`)
    }
  }

  if (items.length === 0) {
    throw new Error("No valid items to index")
  }

  lawDB.add(items)

  console.log("✅ DONE. Total:", items.length)
}
