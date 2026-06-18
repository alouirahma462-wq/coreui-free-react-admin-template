import { supabase } from "../supabaseClient.js"
import { createEmbedding } from "./embeddings.js"

// 📚 تخزين مواد القانون
export const storeLawChunks = async (chunks) => {
  for (const chunk of chunks) {

    const embedding = await createEmbedding(chunk.text)

    await supabase.from("law_chunks").insert({
      content: chunk.text,
      page: chunk.page,
      embedding
    })
  }
}
