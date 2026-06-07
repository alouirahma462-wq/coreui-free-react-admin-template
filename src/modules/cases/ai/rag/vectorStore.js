import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  // =========================
  // ADD (FIXED GLOBALLY)
  // =========================
  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("VectorStore.add expects array of items")
    }

    const vectors = []

    for (const item of items) {
      if (!item || !Array.isArray(item.vector)) continue
      if (item.vector.length !== this.dim) continue

      // 🔥 IMPORTANT: keep pure number array (NO Float32Array objects)
      vectors.push(item.vector.map(v => Number(v)))

      // store metadata in same order
      this.data.push(item.metadata)
    }

    if (vectors.length === 0) {
      console.warn("⚠️ No valid vectors to add")
      return
    }

    // 🔥 FAISS expects: number[][]
    this.index.add(vectors)
  }

  // =========================
  // SEARCH (FIXED + SAFE)
  // =========================
  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("VectorStore.search expects array")
    }

    if (vector.length !== this.dim) {
      throw new Error(`Vector dim mismatch: ${vector.length} != ${this.dim}`)
    }

    // FAISS query format
    const query = vector.map(v => Number(v))

    const result = this.index.search([query], k)

    if (!result || !result.labels) return []

    return result.labels
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
