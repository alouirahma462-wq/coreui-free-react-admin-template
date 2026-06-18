export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim;
    this.vectors = [];
    this.data = [];
  }

  add(items) {
    if (!Array.isArray(items)) return;

    for (const item of items) {
      if (!item?.vector || !item?.metadata) continue;

      const vec = item.vector.map(Number);

      if (vec.length !== this.dim) continue;

      // 🔥 normalize (مهم جداً للـ cosine stability)
      const norm = Math.sqrt(vec.reduce((a, b) => a + b * b, 0));
      if (norm === 0) continue;

      const normalized = vec.map(v => v / norm);

      this.vectors.push(normalized);
      this.data.push(item.metadata);
    }

    console.log(`✅ VectorStore indexed: ${this.vectors.length}`);
  }

  cosineSimilarity(a, b) {
    let dot = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }

    return dot;
  }

  search(vector, k = 5) {
    const query = vector.map(Number);

    const results = [];

    for (let i = 0; i < this.vectors.length; i++) {
      const score = this.cosineSimilarity(query, this.vectors[i]);

      results.push({
        score,
        data: this.data[i]
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(r => r.data);
  }
}
