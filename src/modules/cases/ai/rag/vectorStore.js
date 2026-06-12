export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim;
    this.vectors = [];
    this.data = [];
  }

  /**
   * 🧠 Normalize vector (important for cosine stability)
   */
  normalize(vec) {
    let norm = 0;

    for (let i = 0; i < vec.length; i++) {
      norm += vec[i] * vec[i];
    }

    norm = Math.sqrt(norm);

    if (norm === 0) return vec;

    return vec.map((v) => v / norm);
  }

  /**
   * 📌 Add embeddings to store
   */
  add(items) {
    if (!Array.isArray(items)) {
      throw new Error("items must be array");
    }

    let added = 0;

    for (const item of items) {
      if (!item?.vector || !item?.metadata) continue;

      const vec = Array.from(item.vector).map(Number);

      // validation
      if (vec.length !== this.dim) continue;
      if (vec.some((v) => !Number.isFinite(v))) continue;

      // normalize before storing (IMPORTANT FIX)
      const normalized = this.normalize(vec);

      this.vectors.push(normalized);
      this.data.push(item.metadata);

      added++;
    }

    console.log(`✅ Indexed: ${added}`);
  }

  /**
   * 🧠 Cosine similarity (safe version)
   */
  cosineSimilarity(a, b) {
    let dot = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }

    return dot; // لأننا normalized → dot = cosine
  }

  /**
   * 🔍 Search RAG
   */
  search(vector, k = 5) {
    if (!Array.isArray(vector)) {
      throw new Error("vector must be array");
    }

    const query = this.normalize(
      Array.from(vector).map((v) => Number(v || 0))
    );

    const scores = [];

    for (let i = 0; i < this.vectors.length; i++) {
      const score = this.cosineSimilarity(query, this.vectors[i]);

      scores.push({
        score,
        data: this.data[i],
      });
    }

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((x) => ({
        ...x.data,
        _score: x.score, // مهم للـ debug + citation engine لاحقاً
      }));
  }
}
