import { createEmbedding } from "../rag/embeddings.js"

const run = async () => {

  const text = `
  تم الاعتداء على شخص وسرقة هاتفه باستعمال العنف
  `

  const embedding = await createEmbedding(text)

  console.log(embedding.length)

  console.log(embedding.slice(0, 10))
}

run()
