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

  // 🔥 تحويل آمن 100%
  let vector = null

  if (output?.data) {
    vector = Array.from(output.data)
  } else if (Array.isArray(output)) {
    vector = output.flat()
  } else {
    throw new Error("Invalid embedding output")
  }

  // تنظيف القيم
  vector = vector
    .map(Number)
    .filter(v => Number.isFinite(v))

  if (vector.length === 0) {
    throw new Error("Empty embedding vector")
  }

  return vector
}
