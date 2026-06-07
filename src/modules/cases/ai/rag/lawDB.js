export const loadLawsIntoVectorDB = async (articles) => {
  console.log("⚙️ Starting embedding + indexing...")

  if (!Array.isArray(articles)) {
    throw new Error("articles must be array")
  }

  const items = []

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i]
    if (!article?.text) continue

    const vector = await embedText(article.text)

    if (!Array.isArray(vector)) continue

    if (vector.length !== 384) {
      console.log("❌ bad vector size", vector.length)
      continue
    }

    items.push({
      vector: vector.map(Number), // 🔥 مهم
      metadata: {
        id: article.id ?? i,
        text: article.text
      }
    })

    if (i % 50 === 0) {
      console.log(`📌 Indexed ${i}/${articles.length}`)
    }
  }

  console.log("📦 Sending to VectorStore...")

  if (items.length === 0) {
    throw new Error("No valid items")
  }

  lawDB.add(items)

  console.log("✅ DONE:", items.length)
}
