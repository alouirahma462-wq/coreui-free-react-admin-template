import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  // =========================
  // ADD VECTORS (FIXED)
  // =========================
  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("add expects array of [vector, metadata]")
    }

    const vectors = []

    for (const item of items) {
      if (!Array.isArray(item) || item.length !== 2) continue

      const [vector, metadata] = item

      vectors.push(Float32Array.from(vector))
      this.data.push(metadata)
    }

    // 🔥 FAISS expects batch 2D array
    this.index.add(vectors)
  }

  // =========================
  // SEARCH (FIXED)
  // =========================
  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      console.error("❌ search input must be array")
      return []
    }

    const result = this.index.search(new Float32Array(vector), k)

    if (!result || !result.labels) return []

    return result.labels
      .filter(i => i !== -1)
      .map(i => this.data[i])
  }
}
