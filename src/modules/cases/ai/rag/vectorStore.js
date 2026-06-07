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
      if (!item || !item.vector || !item.metadata) continue

      let vec = item.vector

      // تحويل آمن
      if (Array.isArray(vec)) {
        vec = Float32Array.from(vec)
      }

      if (!(vec instanceof Float32Array)) continue
      if (vec.length !== this.dim) continue

      vectors.push(vec)
      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      throw new Error("No valid vectors to add")
    }

    // FAISS يحتاج Array of Float32Array
    this.index.add(vectors)
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("VectorStore.search expects array")
    }

    const query = Float32Array.from(vector)

    const result = this.index.search([query], k)

    if (!result?.labels) return []

    return result.labels
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
