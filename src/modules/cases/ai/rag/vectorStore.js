export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim
    this.vectors = []
    this.data = []
  }

  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("items must be array")
    }

    let added = 0

    for (const item of items) {
      if (!item?.vector || !item?.metadata) continue

      const vec = Array.from(item.vector).map(Number)

      if (vec.length !== this.dim) continue
      if (vec.some(v => !Number.isFinite(v))) continue

      this.vectors.push(vec)
      this.data.push(item.metadata)

      added++
    }

    console.log(`✅ Indexed: ${added}`)
  }

  cosineSimilarity(a, b) {
    let dot = 0
    let magA = 0
    let magB = 0

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i]
      magA += a[i] * a[i]
      magB += b[i] * b[i]
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB))
  }

  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("vector must be array")
    }

    const query = Array.from(vector).map(Number)

    const scores = []

    for (let i = 0; i < this.vectors.length; i++) {
      const score = this.cosineSimilarity(query, this.vectors[i])

      scores.push({
        score,
        data: this.data[i]
      })
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(x => x.data)
  }
}
