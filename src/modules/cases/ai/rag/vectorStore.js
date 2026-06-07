import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("VectorStore.add expects ARRAY of {vector, metadata}")
    }

    const vectors = []

    for (const item of items) {
      if (!item?.vector || !Array.isArray(item.vector)) continue
      if (item.vector.length !== this.dim) continue

      vectors.push(item.vector.map(Number)) // 🔥 مهم جداً
      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      console.warn("⚠️ No valid vectors")
      return
    }

    // 🔥 FAISS FIX: لازم array 2D صافية
    this.index.add(vectors)
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("Search vector must be ARRAY")
    }

    if (vector.length !== this.dim) {
      throw new Error(`Vector dim mismatch: ${vector.length} != ${this.dim}`)
    }

    const result = this.index.search([vector.map(Number)], k)

    if (!result?.labels) return []

    return result.labels
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
