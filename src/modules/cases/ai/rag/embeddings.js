import { pipeline } from "@xenova/transformers"

let embedder = null

export const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    )
  }
  return embedder
}

export const embedText = async (text) => {
  const model = await getEmbedder()

  const output = await model(text, {
    pooling: "mean",
    normalize: true
  })

  // 🔥 FIX: force clean array + remove nested issues
  const vector = Array.from(output.data || output)

  if (!Array.isArray(vector)) {
    throw new Error("Embedding failed: not array")
  }

  return vector
}
