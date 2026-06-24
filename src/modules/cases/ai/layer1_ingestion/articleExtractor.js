export const extractArticles = (text) => {
  if (!text || typeof text !== "string") return [];

  // ================================
  // 🧹 NORMALIZATION (CLEAN CORE)
  // ================================
  const cleanText = text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  // ================================
  // ⚖️ SEGMENTATION ENGINE
  // ================================
  const rawSegments = cleanText.split(
    /(?=(?:الفصل|المادة|Article|Art\.|Section)\s*\d+)/gi
  );

  const articles = [];
  const seen = new Set();

  // ================================
  // 🧠 PROCESSING LOOP
  // ================================
  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i]?.trim();
    if (!segment || segment.length < 30) continue;

    // ================================
    // 🔎 ARTICLE NUMBER
    // ================================
    const articleNumber =
      segment.match(/(?:الفصل|المادة|Article|Art\.|Section)\s*(\d+)/i)?.[1] ||
      null;

    // ================================
    // 🧠 SIMPLE LEGAL SEMANTIC SCORE
    // ================================
    let semantic = 0;

    if (/جريمة|عقوبة|crime|penalty|imprison|سجن/i.test(segment)) semantic += 0.5;
    if (/حقوق|التزام|civil|contract|ملكية/i.test(segment)) semantic += 0.3;
    if (/محكمة|court|قاضي|procedure/i.test(segment)) semantic += 0.2;

    // ================================
    // ⚖️ TYPE CLASSIFICATION (LIGHT)
    // ================================
    let type = "general";

    if (/جريمة|crime|عقوبة|penalty|سجن/i.test(segment)) {
      type = "criminal";
    } else if (/حقوق|التزام|civil|contract|ملكية/i.test(segment)) {
      type = "civil";
    } else if (/محكمة|court|قاضي|procedure/i.test(segment)) {
      type = "procedural";
    }

    // ================================
    // 🧬 SIMPLE EMBEDDING SEED
    // ================================
    const embedding =
      (segment.slice(0, 120)
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000) / 1000;

    // ================================
    // ⚠️ CONTRADICTION SIGNAL (LIGHT ONLY)
    // ================================
    let contradiction = 0;

    if (/ممنوع|لا يجوز|غير مسموح|prohibited/i.test(segment)) {
      contradiction = 0.4;
    }

    if (/يجوز|مسموح|allowed/i.test(segment)) {
      contradiction -= 0.2;
    }

    contradiction = Math.max(0, Math.min(1, contradiction));

    // ================================
    // ⚖️ IMPORTANCE SCORE (SIMPLE BUT STRONG)
    // ================================
    const importance =
      semantic +
      (articleNumber ? 0.2 : 0) +
      Math.min(1, segment.length / 2500) -
      contradiction * 0.2;

    // ================================
    // 🧾 DUPLICATION FILTER
    // ================================
    const hash = `${articleNumber || "x"}-${segment.slice(0, 60)}`;
    if (seen.has(hash)) continue;
    seen.add(hash);

    // ================================
    // 📦 FINAL OUTPUT (LAYER 1 ONLY)
    // ================================
    articles.push({
      id: i,
      text: segment,
      articleNumber,
      type,

      importance: Number(importance.toFixed(3)),
      semantic_signal: Number(semantic.toFixed(3)),
      embedding_seed: embedding,
      contradiction_score: contradiction,

      meta: {
        confidence: articleNumber ? 0.95 : 0.7,
        graph_ready: true,
        rag_ready: true,
        layer: "L1_LEGAL_INGESTION"
      }
    });
  }

  // ================================
  // 📊 FINAL SORT (IMPORTANT FIRST)
  // ================================
  return articles.sort((a, b) => b.importance - a.importance);
};
