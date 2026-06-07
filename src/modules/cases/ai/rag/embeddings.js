import { pipeline } from "@xenova/transformers"

let embedder = null

// =========================
// INIT MODEL (lazy load)
// =========================
export const getEmbedder = async () => {
  if (!embedder) {
    console.log("🧠 Loading embedding model...")

    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )

    console.log("✅ Embedding model loaded")
  }

  return embedder
}

// =========================
// EMBED TEXT (FIXED)
// =========================
export const embedText = async (text) => {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("embedText expects string")
    }

    const model = await getEmbedder()

    const output = await model(text, {
      pooling: "mean",
      normalize: true
    })

    // 🔥 SAFE extraction (important fix)
    let vector = output

    if (output?.data) {
      vector = output.data
    } else if (Array.isArray(output)) {
      vector = output
    } else if (output?.[0]) {
      vector = output[0]
    }

    const finalVector = Array.from(vector)

    // 🧪 DEBUG (remove later)
    console.log("📏 EMBED DIM:", finalVector.length)

    return finalVector

  } catch (err) {
    console.error("❌ embedText error:", err)
    return []
  }
}
