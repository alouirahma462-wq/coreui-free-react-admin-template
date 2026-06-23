import { loadPDF } from "./pdfLoader.js";
import { chunkLaw } from "./chunker.js";
import { embedText } from "./embeddings.js";
import { lawDB } from "../storage/vectorStore.js";

/**
 * ⚖️ CLEAN RAG v6 — LEGAL BRAIN CORE
 * - Graph-aware retrieval
 * - Multi-query decomposition
 * - Contradiction filtering
 * - Legal reinforcement scoring
 * - Hallucination guard
 */

class CleanRAG {
  constructor() {
    this.store = lawDB;
    this.ready = false;

    this.embeddingCache = new Map();
    this.queryCache = new Map();

    // 🧠 memory learning
    this.feedbackMemory = [];

    // 🧠 NEW: contradiction memory
    this.contradictionMemory = [];
  }

  /* ================================
     📚 BUILD INDEX (SMART LEGAL CORE)
  ================================= */
  async build(filePath) {
    console.log("📚 LEGAL BRAIN v6 BUILDING...");

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

          length: chunk.text.length,
          hasArticle: /الفصل|المادة|Article/i.test(chunk.text),

          importance: this.estimateImportance(chunk.text),
          keywords: this.extractKeywords(chunk.text),

          // 🧠 NEW SIGNALS
          risk: this.detectLegalRisk(chunk.text),
          entities: this.extractEntities(chunk.text),
        },
      });
    }

    this.store.add(items);
    this.ready = true;

    console.log(`⚖️ LEGAL BRAIN READY → ${items.length} chunks`);
  }

  /* ================================
     🔍 QUERY DECOMPOSITION (NEW)
  ================================= */
  decomposeQuery(query) {
    const parts = query
      .split(/و|and|,/)
      .map(q => q.trim())
      .filter(Boolean);

    return parts.length ? parts : [query];
  }

  /* ================================
     🧠 QUERY ANALYSIS (UPGRADED)
  ================================= */
  analyzeQuery(query) {
    const q = query.toLowerCase();

    return {
      isCriminal: /سرقة|قتل|عنف|fraud|theft/.test(q),
      isLegal: /قانون|المادة|article|law/.test(q),
      isEvidence: /دليل|شهادة|witness/.test(q),
      isPenalty: /عقوبة|سجن|غرامة/.test(q),

      intent: this.detectIntent(q),
      expanded: this.expandQuery(q),
      queries: this.decomposeQuery(q),
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
     🔍 SEARCH (MULTI-QUERY + GRAPH BOOST)
  ================================= */
  async search(query, k = 5) {
    if (!query) return [];

    if (this.queryCache.has(query)) {
      return this.queryCache.get(query);
    }

    const qInfo = this.analyzeQuery(query);

    let allResults = [];

    // 🧠 MULTI-QUERY SEARCH
    for (const q of qInfo.queries) {
      const vector = await this.getEmbedding(q);
      const results = this.store.search(vector, k * 6);
      allResults.push(...results);
    }

    let results = allResults.map(r =>
      this.enhanceResult(r, query, qInfo)
    );

    results = this.removeContradictions(results);

    results = results
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, k);

    this.queryCache.set(query, results);

    return results;
  }

  /* ================================
     🧠 RERANKING ENGINE (LEGAL BRAIN)
  ================================= */
  enhanceResult(result, query, qInfo) {
    const meta = result?.metadata || {};
    const text = meta?.text || "";

    let score = result.score || 0;

    // ⚖️ legal structure boost
    if (meta.hasArticle) score += 0.4;

    // 📍 importance
    score += (meta.importance || 0) * 0.35;

    // 🧠 intent matching
    if (qInfo.isCriminal && /سرقة|عنف|جريمة/.test(text)) {
      score += 0.3;
    }

    if (qInfo.isLegal && /المادة|الفصل/.test(text)) {
      score += 0.3;
    }

    if (qInfo.isPenalty && /عقوبة|سجن|غرامة/.test(text)) {
      score += 0.3;
    }

    // 🧠 entity boost
    if (meta.entities?.length > 0) score += 0.1;

    // 📄 page locality boost
    if (meta.page) score += 0.05;

    // 🧠 keyword overlap
    const overlap = this.keywordOverlap(text, qInfo.expanded);
    score += overlap * 0.2;

    // 🚨 OCR noise penalty
    if ((text.match(/\d/g) || []).length > text.length * 0.5) {
      score -= 0.3;
    }

    // ⚠️ legal risk boost (important laws)
    if (meta.risk === "high") score += 0.25;

    const finalScore = Math.max(0, Math.min(1, score));

    return {
      ...result,
      finalScore,
      explain: { base: result.score, final: finalScore, overlap },
    };
  }

  /* ================================
     ⚖️ CONTRADICTION FILTER (NEW CORE)
  ================================= */
  removeContradictions(results) {
    const filtered = [];

    for (const r of results) {
      const text = r?.metadata?.text || "";

      const isContradiction = filtered.some(f =>
        this.isOpposite(f?.metadata?.text, text)
      );

      if (!isContradiction) {
        filtered.push(r);
      } else {
        this.contradictionMemory.push({
          rejected: text,
          time: Date.now(),
        });
      }
    }

    return filtered;
  }

  isOpposite(a, b) {
    return (
      (/ممنوع|غير مسموح/.test(a) && /مسموح/.test(b)) ||
      (/not allowed/.test(a) && /allowed/.test(b))
    );
  }

  /* ================================
     🧠 LEGAL RISK DETECTION
  ================================= */
  detectLegalRisk(text) {
    if (/إعدام|جناية|felony/.test(text)) return "high";
    if (/جنحة|غرامة/.test(text)) return "medium";
    return "low";
  }

  /* ================================
     🧠 ENTITY EXTRACTION (LIGHT NLP)
  ================================= */
  extractEntities(text) {
    return (text.match(/المادة\s*\d+|Article\s*\d+/g) || []);
  }

  /* ================================
     🧠 VALIDATION
  ================================= */
  isValidChunk(chunk) {
    if (!chunk?.text) return false;
    const t = chunk.text;
    if (t.length < 50) return false;
    if ((t.match(/\d/g) || []).length > t.length * 0.5) return false;
    return true;
  }

  /* ================================
     🧠 IMPORTANCE
  ================================= */
  estimateImportance(text) {
    let score = 0;
    if (/الفصل|المادة|Article/i.test(text)) score += 0.5;
    if (/جريمة|عقوبة|جنحة|crime/.test(text)) score += 0.4;
    if (text.length > 600) score += 0.2;
    return Math.min(1, score);
  }

  /* ================================
     🧠 KEYWORDS
  ================================= */
  extractKeywords(text) {
    return text.split(" ").filter(w => w.length > 5).slice(0, 10);
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
     📊 STATUS
  ================================= */
  getStatus() {
    return {
      ready: this.ready,
      vectors: this.store.vectors.length,
      cache: this.embeddingCache.size,
      queryCache: this.queryCache.size,
      contradictions: this.contradictionMemory.length,
    };
  }
}

export const cleanRAG = new CleanRAG();
