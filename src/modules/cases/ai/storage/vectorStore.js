export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim;
    this.vectors = [];
    this.data = [];
  }

  add(items = []) {
    for (const item of items) {
      if (!item?.vector || !item?.metadata) continue;

      const vec = item.vector.map(Number);
      if (vec.length !== this.dim) continue;

      const norm = Math.sqrt(vec.reduce((a, b) => a + b * b, 0));
      if (!norm) continue;

      const normalized = vec.map(v => v / norm);

      this.vectors.push(normalized);
      this.data.push(item.metadata);
    }
  }

  cosine(a, b) {
    let dot = 0;
    for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
    return dot;
  }

  search(vector, k = 5) {
    const query = vector.map(Number);

    return this.vectors
      .map((v, i) => ({
        score: this.cosine(query, v),
        data: this.data[i]
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(r => r.data);
  }
}

/* 🔥 SINGLETON (الحل الحقيقي لمشكلتك) */
export const lawDB = new VectorStore(384);
