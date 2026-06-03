import faiss from "faiss-node"

export class VectorStore {
  constructor(dim = 384) {
    this.index = new faiss.IndexFlatL2(dim)
    this.data = []
  }

  add(vector, metadata) {
    this.index.add(Float32Array.from(vector))
    this.data.push(metadata)
  }

  search(vector, k = 5) {
    const result = this.index.search(Float32Array.from(vector), k)

    return result.labels.map(i => this.data[i]).filter(Boolean)
  }
}
