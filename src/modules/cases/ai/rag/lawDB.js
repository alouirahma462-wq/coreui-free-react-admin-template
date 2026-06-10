import { VectorStore } from "./vectorStore.js"
import { embedText } from "./embeddings.js"

class LawDatabase {
  constructor() {
    // 🧠 GLOBAL SINGLETON (CRITICAL FIX)
    if (!globalThis.__LAW_DB__) {
      globalThis.__LAW_DB__ = new VectorStore(384)
    }

    this.db = globalThis.__LAW_DB__

    // 🧠 tracking to avoid double indexing
    if (!globalThis.__LAW_DB_STATE__) {
      globalThis.__LAW_DB_STATE__ = {
        indexed: false,
        count: 0
      }
    }

    this.state = globalThis.__LAW_DB_STATE__
  }

  get instance() {
    return this.db
  }

  async addArticles(articles = []) {
    if (!Array.isArray(articles) || articles.length === 0) {
      console.warn("⚠️ No articles provided")
      return
    }

    console.log("⚙️ LAW DB INDEXING START...")

    const items = []

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i]

      if (!article?.text) continue

      try {
        const vector = await embedText(article.text)

        // 🔒 safety check
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
          console.log(`📌 Embedding ${i}/${articles.length}`)
        }

      } catch (err) {
        console.warn("⚠️ embed failed:", err.message)
      }
    }

    // 🧠 IMPORTANT: avoid double indexing
    if (this.state.indexed && this.state.count === items.length) {
      console.log("⚠️ Already indexed - skipping")
      return
    }

    // 🚀 ADD TO VECTOR DB
    this.db.add(items)

    // 💾 save state
    this.state.indexed = true
    this.state.count = items.length

    console.log("✅ LAW DB READY:", items.length)
  }

  clear() {
    globalThis.__LAW_DB__ = new VectorStore(384)
    globalThis.__LAW_DB_STATE__ = { indexed: false, count: 0 }
    this.db = globalThis.__LAW_DB__
    this.state = globalThis.__LAW_DB_STATE__
    console.log("🧹 LAW DB RESET DONE")
  }
}

export const lawDB = new LawDatabase()
