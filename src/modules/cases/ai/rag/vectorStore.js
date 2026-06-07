import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  // ✅ يدعم 2 صيغ:
  // 1) add(vector, metadata)
  // 2) add([{vector, metadata}])
  add(input, metadata = null) {

    // 🟢 الحالة 1: array of objects
    if (Array.isArray(input) && typeof input[0] === "object") {
      for (const item of input) {
        if (!item?.vector) continue

        this.index.add(Float32Array.from(item.vector))
        this.data.push(item.metadata)
      }
      return
    }

    // 🟢 الحالة 2: vector + metadata
    if (Array.isArray(input) && metadata) {
      this.index.add(Float32Array.from(input))
      this.data.push(metadata)
      return
    }

    throw new Error("Invalid VectorStore.add input format")
  }

  search(vector, k = 5) {
    const result = this.index.search(Float32Array.from(vector), k)

    return (result.labels || [])
      .map(i => this.data[i])
      .filter(Boolean)
  }
}
