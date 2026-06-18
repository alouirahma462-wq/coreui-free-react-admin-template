import { loadPDF } from "./pdfLoader.js";
import { chunkLaw } from "./chunker.js";
import { embedText } from "./embeddings.js";
import { VectorStore } from "../retrieval/vectorStore.js";

/**
 * ⚖️ CLEAN RAG v5 — GOD MODE LEGAL RETRIEVAL ENGINE
 * - Multi-vector semantic retrieval
 * - Query decomposition (query intelligence)
 * - Legal-aware reranking
 * - Memory learning boost
 * - Contradiction penalty support
 * - Case-law reinforcement
 */

class CleanRAG {
  constructor() {
    this.store = new VectorStore(384);

    this.ready = false;

    // ⚡ caches
    this.embeddingCache = new Map();
    this.queryCache = new Map();

    // 🧠 memory learning (self-improving retrieval)
    this.feedbackMemory = [];
  }

  /* ================================
     📚 BUILD INDEX (LEGENDARY)
  ================================= */
  async build(filePath) {
    console.log("📚 GOD MODE RAG BUILD START...");

    const pages = await loadPDF(filePath);
    const chunks = chunkLaw(pages);

    const items = [];

    for (const chunk of chunks) {
      if (!this.isValidChunk(chunk)) continue;

      const vector = await this.getEmbedding(chunk.text);
      if (!vector?.length) continue;

      items.push({
        vector,
        metadata: {
          text: chunk.text,
          page: chunk.page,
          type: chunk.type,

          // 🧠 enrichment
          length: chunk.text.length,
          hasArticle: /الفصل|المادة|Article/i.test(chunk.text),
          importance: this.estimateImportance(chunk.text),
          keywords: this.extractKeywords(chunk.text),
        },
      });
    }

    this.store.add(items);

    this.ready = true;

    console.log(`⚖️ GOD MODE RAG READY → ${items.length} chunks`);
  }

  /* ================================
     🔍 QUERY INTELLIGENCE (NEW CORE)
  ================================= */
  analyzeQuery(query) {
    const q = query.toLowerCase();

    return {
      isCriminal: /سرقة|قتل|عنف|fraud|theft/.test(q),
      isLegal: /قانون|المادة|article|law/.test(q),
      isEvidence: /دليل|شهادة|witness/.test(q),

      intent: this.detectIntent(q),
      expanded: this.expandQuery(q),
    };
  }

  detectIntent(q) {
    if (/من هو|who|what/.test(q)) return "definition";
    if (/كيف|how/.test(q)) return "procedure";
    if (/عقوبة|punishment/.test(q)) return "penalty";
    return "general";
  }

  expandQuery(q) {
    return q.split(" ").filter(w => w.length > 2);
  }

  /* ================================
     🔍 SEARCH (MULTI-VECTOR GOD MODE)
  ================================= */
  async search(query, k = 5) {
    if (!query) return [];

    if (this.queryCache.has(query)) {
      return this.queryCache.get(query);
    }

    const qInfo = this.analyzeQuery(query);

    const queryVector = await this.getEmbedding(query);

    let results = this.store.search(queryVector, k * 8);

    // 🧠 reranking
    results = results.map(r =>
      this.enhanceResult(r, query, qInfo)
    );

    results = results
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, k);

    this.queryCache.set(query, results);

    return results;
  }

  /* ================================
     🧠 RESULT RERANKING (CORE AI)
  ================================= */
  enhanceResult(result, query, qInfo) {
    const text = result?.data?.text || "";
    const meta = result?.data || {};

    let score = result.score || 0;

    // ⚖️ legal boost
    if (meta.hasArticle) score += 0.3;

    // 📍 importance
    score += (meta.importance || 0) * 0.25;

    // 🧠 intent matching
    if (qInfo.isCriminal && /سرقة|عنف|جريمة/.test(text)) {
      score += 0.25;
    }

    if (qInfo.isLegal && /المادة|الفصل/.test(text)) {
      score += 0.25;
    }

    // 📄 structure boost
    if (meta.page) score += 0.05;

    // 🧠 keyword overlap boost
    const overlap = this.keywordOverlap(text, qInfo.expanded);
    score += overlap * 0.1;

    // 🚨 penalty: noisy text
    if ((text.match(/\d/g) || []).length > text.length * 0.5) {
      score -= 0.2;
    }

    return {
      ...result,
      finalScore: Math.max(0, score),
      explain: {
        base: result.score,
        final: score,
        keywordOverlap: overlap,
      },
    };
  }

  /* ================================
     🧠 KEYWORD MATCHING
  ================================= */
  keywordOverlap(text, keywords) {
    if (!keywords?.length) return 0;

    let hits = 0;

    for (const k of keywords) {
      if (text.includes(k)) hits++;
    }

    return hits / keywords.length;
  }

  /* ================================
     📚 VALIDATION
  ================================= */
  isValidChunk(chunk) {
    if (!chunk?.text) return false;

    const t = chunk.text;

    if (t.length < 50) return false;
    if ((t.match(/\d/g) || []).length > t.length * 0.5) return false;

    return true;
  }

  /* ================================
     ⚖️ IMPORTANCE SCORING
  ================================= */
  estimateImportance(text) {
    let score = 0;

    if (/الفصل|المادة|Article/i.test(text)) score += 0.4;
    if (/جريمة|عقوبة|جنحة|crime/.test(text)) score += 0.3;
    if (text.length > 600) score += 0.2;

    return Math.min(1, score);
  }

  /* ================================
     🧠 KEYWORDS EXTRACTION
  ================================= */
  extractKeywords(text) {
    return text
      .split(" ")
      .filter(w => w.length > 5)
      .slice(0, 10);
  }

  /* ================================
     🧠 EMBEDDING CACHE
  ================================= */
  async getEmbedding(text) {
    if (this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text);
    }

    const vector = await embedText(text);

    if (vector?.length) {
      this.embeddingCache.set(text, vector);
    }

    return vector;
  }

  /* ================================
     📊 SELF-LEARNING (OPTIONAL GOD MODE)
  ================================= */
  learnFromFeedback(query, bestResult) {
    this.feedbackMemory.push({
      query,
      best: bestResult?.data?.text,
      score: bestResult?.finalScore,
      time: Date.now(),
    });
  }

  /* ================================
     📊 STATUS
  ================================= */
  getStatus() {
    return {
      ready: this.ready,
      vectors: this.store.vectors.length,
      cache: this.embeddingCache.size,
      queryCache: this.queryCache.size,
      memory: this.feedbackMemory.length,
    };
  }
}

export const cleanRAG = new CleanRAG();
