export class VectorStore {
  constructor(dim = 384) {
    this.dim = dim;
    this.vectors = [];
    this.data = [];

    // 🧠 LEGAL MEMORY LAYER (NEW)
    this.caseLinks = new Map(); // similarity links
    this.fingerprints = new Map(); // duplicate detection
  }

  // ================================
  // 🧠 SAFE NORMALIZATION
  // ================================
  normalize(vec) {
    if (!Array.isArray(vec)) return null;

    const clean = vec.map(v => (isFinite(v) ? v : 0));

    const norm = Math.sqrt(
      clean.reduce((sum, v) => sum + v * v, 0)
    );

    if (!norm) return null;

    return clean.map(v => v / norm);
  }

  // ================================
  // 🧬 LEGAL FINGERPRINT (NEW)
  // ================================
  fingerprint(meta) {
    const base =
      `${meta?.articleNumber || ""}-${meta?.page || ""}-${(meta?.text || "").slice(0, 50)}`;

    return base.replace(/\s+/g, "").toLowerCase();
  }

  // ================================
  // 📥 ADD WITH MEMORY AWARENESS
  // ================================
  add(items = []) {
    for (const item of items) {
      if (!item?.vector || !item?.metadata) continue;

      const normalized = this.normalize(item.vector);
      if (!normalized || normalized.length !== this.dim) continue;

      const meta = {
        ...item.metadata,
        _storedAt: Date.now()
      };

      const fp = this.fingerprint(meta);

      // ================================
      // 🔁 DUPLICATE DETECTION
      // ================================
      if (this.fingerprints.has(fp)) {
        continue;
      }

      this.fingerprints.set(fp, this.data.length);

      this.vectors.push(normalized);
      this.data.push(meta);
    }
  }

  // ================================
  // ⚖️ COSINE SIMILARITY
  // ================================
  cosine(a, b) {
    let dot = 0;

    const len = Math.min(a.length, b.length);

    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
    }

    return dot;
  }

  // ================================
  // 🧠 LEGAL SCORING ENGINE v4
  // ================================
  score(queryVec, vec, meta) {
    let score = this.cosine(queryVec, vec);

    // ⚖️ STRUCTURE BOOST
    if (meta?.articleNumber) score += 0.06;
    if (meta?.type === "article") score += 0.04;
    if (meta?.page) score += 0.02;

    // 🧠 CONTENT QUALITY BOOST
    if ((meta?.text?.length || 0) > 1000) score += 0.03;

    // 🧬 LEGAL IMPORTANCE BOOST
    if (meta?.importance > 0.7) score += 0.05;

    // 🛰 GRAPH READY BOOST
    if (meta?.graph_ready) score += 0.02;

    return score;
  }

  // ================================
  // 🔍 SEARCH (GOD CORE v4)
  // ================================
  search(vector, k = 5) {
    const query = this.normalize(vector);
    if (!query) return [];

    const results = [];

    for (let i = 0; i < this.vectors.length; i++) {
      const vec = this.vectors[i];
      const meta = this.data[i];

      const score = this.score(query, vec, meta);

      results.push({
        score,
        similarity: score,
        ...meta
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }

  // ================================
  // 🧠 CASE SIMILARITY TRACKING (NEW)
  // ================================
  linkCases(k = 10) {
    const links = [];

    for (let i = 0; i < this.vectors.length; i++) {
      const base = this.vectors[i];
      const metaA = this.data[i];

      const similarities = [];

      for (let j = 0; j < this.vectors.length; j++) {
        if (i === j) continue;

        const score = this.cosine(base, this.vectors[j]);

        similarities.push({
          from: metaA?.id || i,
          to: this.data[j]?.id || j,
          score
        });
      }

      links.push(
        ...similarities
          .sort((a, b) => b.score - a.score)
          .slice(0, k)
      );
    }

    return links;
  }

  // ================================
  // 📊 STATS
  // ================================
  stats() {
    return {
      vectors: this.vectors.length,
      dimension: this.dim,
      memory_links: this.caseLinks.size,
      fingerprints: this.fingerprints.size
    };
  }
}

/* ================================
   🔥 SINGLETON (LAW CORE MEMORY)
================================ */
export const lawDB = new VectorStore(384);
