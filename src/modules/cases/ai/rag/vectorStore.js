import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  // ✅ ADD FIXED
  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("VectorStore.add expects ARRAY")
    }

    const flatVectors = []

    for (const item of items) {
      if (!item?.vector || !Array.isArray(item.vector)) continue
      if (item.vector.length !== this.dim) continue

      // 🔥 FAISS NEEDS FLAT ARRAY
      flatVectors.push(...item.vector)

      this.data.push(item.metadata)
    }

    if (this.data.length === 0) {
      console.warn("⚠️ No valid data added")
      return
    }

    // 🔥 FIX: must be Float32Array
    const floatVectors = new Float32Array(flatVectors)

    this.index.add(floatVectors)
  }

  // ✅ SEARCH FIXED
  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("Search vector must be ARRAY")
    }

    if (vector.length !== this.dim) {
      throw new Error(`Vector dim mismatch: ${vector.length} != ${this.dim}`)
    }

    const query = new Float32Array(vector)

    const result = this.index.search(query, k)

    if (!result?.labels) return []

    return result.labels
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
