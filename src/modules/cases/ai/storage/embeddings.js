import { pipeline } from "@xenova/transformers";

let embedder = null;

// 🧠 CACHE (speed boost)
const cache = new Map();

/**
 * 🧠 Load embedding model once (lazy init)
 */
export const getEmbedder = async () => {
  if (!embedder) {
    console.log("📦 Loading embedding model (GOD CORE v3)...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Embedding model ready");
  }

  return embedder;
};

/**
 * 🧠 SAFE FALLBACK VECTOR (prevents system crash)
 */
const fallbackVector = () =>
  new Array(384).fill(0.0001);

/**
 * 🧠 TEXT NORMALIZATION (legal-safe)
 */
function normalizeText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n/g, " ")
    .trim()
    .slice(0, 8000); // prevent overload
}

/**
 * 🧠 MAIN EMBEDDING ENGINE (RAG-GRADE)
 */
export const embedText = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      return fallbackVector();
    }

    const cleanText = normalizeText(text);

    // ================================
    // 🧠 CACHE CHECK
    // ================================
    if (cache.has(cleanText)) {
      return cache.get(cleanText);
    }

    const model = await getEmbedder();

    const output = await model(cleanText, {
      pooling: "mean",
      normalize: true,
    });

    let vector = Array.from(output.data);

    // ================================
    // 🧹 VECTOR SANITIZATION
    // ================================
    vector = vector.map((v) => {
      if (!isFinite(v) || isNaN(v)) return 0;
      return v;
    });

    // ================================
    // ⚖️ VALIDATION (CRITICAL)
    // ================================
    if (!vector.length || vector.length < 100) {
      return fallbackVector();
    }

    // ================================
    // 💾 CACHE STORE
    // ================================
    cache.set(cleanText, vector);

    return vector;

  } catch (err) {
    console.error("❌ embedText error:", err.message);

    // 🧠 NEVER BREAK PIPELINE
    return fallbackVector();
  }
};
