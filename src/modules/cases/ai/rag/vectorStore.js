import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("VectorStore.add expects array")
    }

    const vectors = []

    for (const item of items) {
      if (!item?.vector) continue
      if (!Array.isArray(item.vector)) continue
      if (item.vector.length !== this.dim) continue

      // مهم جداً: FAISS يحتاج float array نظيف
      const cleanVector = Array.from(item.vector.map(Number))

      vectors.push(cleanVector)
      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      throw new Error("No valid vectors")
    }

    // 🔥 IMPORTANT: ensure 2D array
    this.index.add(vectors)
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("Search vector must be array")
    }

    if (vector.length !== this.dim) {
      throw new Error(`Vector dim mismatch`)
    }

    const result = this.index.search([vector], k)

    if (!result || !result.labels) return []

    return result.labels.map(i => this.data[i]).filter(Boolean)
  }
}
