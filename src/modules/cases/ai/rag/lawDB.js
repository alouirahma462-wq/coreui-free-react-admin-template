import { VectorStore } from "./vectorStore.js"
import { embedText } from "./embeddings.js"

class LawDatabase {
  constructor() {
    if (!global.__LAW_DB__) {
      global.__LAW_DB__ = new VectorStore(384)
    }
    this.db = global.__LAW_DB__
  }

  get instance() {
    return this.db
  }

  async addArticles(articles) {
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

    this.db.add(items)

    console.log("✅ DONE:", items.length)
  }
}

export const lawDB = new LawDatabase()
