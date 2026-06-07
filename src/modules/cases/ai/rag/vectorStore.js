import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("add expects array")
    }

    const vectors = []

    for (const item of items) {
      if (!item?.vector || !Array.isArray(item.vector)) continue
      if (item.vector.length !== this.dim) continue

      // 🔥 مهم: تحويل إلى Float32Array
      vectors.push(Float32Array.from(item.vector))

      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      console.warn("No vectors")
      return
    }

    // 🔥 FAISS safe format
    this.index.add(vectors)
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("search expects array")
    }

    if (vector.length !== this.dim) {
      throw new Error("bad dim")
    }

    const query = Float32Array.from(vector)

    const result = this.index.search([query], k)

    if (!result?.labels) return []

    return result.labels
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
