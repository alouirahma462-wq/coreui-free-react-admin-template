import { pipeline } from "@xenova/transformers";

let embedder = null;

/**
 * 🧠 Load embedding model once
 */
export const getEmbedder = async () => {
  if (!embedder) {
    console.log("📦 Loading embedding model...");
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Embedding model ready");
  }

  return embedder;
};

/**
 * 🧠 Robust embedding function (RAG-safe)
 */
export const embedText = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid text input");
    }

    const model = await getEmbedder();

    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });

    let vector = Array.from(output.data);

    // تنظيف خفيف فقط (بدون تدمير البيانات)
    vector = vector.map((v) => (isNaN(v) ? 0 : v));

    return vector;
  } catch (err) {
    console.error("❌ embedText error:", err.message);
    return [];
  }
};
