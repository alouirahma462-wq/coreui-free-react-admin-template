import { openai } from "../../client.js"

// 🧠 تحويل النص إلى vector
export const createEmbedding = async (text) => {

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  })

  return response.data[0].embedding
}
