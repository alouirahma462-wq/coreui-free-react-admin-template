import { supabase } from "../supabaseClient.js"
import { createEmbedding } from "./embeddings.js"

// 🧠 بحث قانوني ذكي
export const searchLaw = async (query) => {

  const queryEmbedding = await createEmbedding(query)

  const { data, error } = await supabase.rpc("match_law_chunks", {
    query_embedding: queryEmbedding,
    match_threshold: 0.75,
    match_count: 5
  })

  if (error) {
    console.error(error)
    return []
  }

  return data
}
