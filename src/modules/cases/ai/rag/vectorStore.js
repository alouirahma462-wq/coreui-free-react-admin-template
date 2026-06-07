import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("items must be array")
    }

    const vectors = []

    for (const item of items) {
      if (!item?.vector) continue

      const vec = Float32Array.from(item.vector.map(Number))

      if (vec.length !== this.dim) continue

      if (vec.some(v => isNaN(v))) continue

      vectors.push(vec)
      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      throw new Error("No valid vectors")
    }

    this.index.add(vectors)
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("vector must be array")
    }

    const query = Float32Array.from(vector.map(Number))

    const result = this.index.search([query], k)

    if (!result?.labels) return []

    return result.labels.map(i => this.data[i]).filter(Boolean)
  }
}
