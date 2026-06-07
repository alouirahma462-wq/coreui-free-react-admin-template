import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  // ✅ add must ALWAYS receive: [{vector: [], metadata: {}}]
  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("VectorStore.add expects ARRAY of {vector, metadata}")
    }

    const vectors = []

    for (const item of items) {
      if (!item?.vector || !Array.isArray(item.vector)) continue
      if (item.vector.length !== this.dim) {
        console.warn("❌ Skipping bad vector dim:", item.vector.length)
        continue
      }

      vectors.push(item.vector)
      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      console.warn("⚠️ No valid vectors to add")
      return
    }

    // 🔥 FAISS REQUIREMENT: number[][]
    this.index.add(vectors)
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("Search vector must be ARRAY")
    }

    if (vector.length !== this.dim) {
      throw new Error(`Vector dim mismatch: ${vector.length} != ${this.dim}`)
    }

    const result = this.index.search([vector], k)

    if (!result?.labels) return []

    return result.labels
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
