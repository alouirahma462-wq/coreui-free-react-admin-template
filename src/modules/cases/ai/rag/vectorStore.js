import faiss from "faiss-node"

export class VectorStore {
  constructor() {
    this.index = null
    this.data = []
    this.dim = null
  }

  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("VectorStore.add expects array")
    }

    const vectors = []

    for (const item of items) {
      if (!Array.isArray(item) || item.length !== 2) continue

      const [vector, metadata] = item

      // 🧠 أول مرة نحدد dimension تلقائياً
      if (!this.index) {
        this.dim = vector.length
        this.index = new faiss.IndexFlatL2(this.dim)
      }

      // ⚠️ حماية من اختلاف الأبعاد
      if (vector.length !== this.dim) {
        console.warn("Skipping vector wrong dim:", vector.length)
        continue
      }

      vectors.push(Float32Array.from(vector))
      this.data.push(metadata)
    }

    if (vectors.length > 0) {
      this.index.add(vectors)
    }
  }

  search(vector, k = 5) {
    if (!this.index) return []
    if (!Array.isArray(vector)) return []

    if (vector.length !== this.dim) {
      console.error("Query dim mismatch:", vector.length, "expected:", this.dim)
      return []
    }

    const result = this.index.search(new Float32Array(vector), k)

    return (result.labels || [])
      .filter(i => i !== -1)
      .map(i => this.data[i])
  }
}
