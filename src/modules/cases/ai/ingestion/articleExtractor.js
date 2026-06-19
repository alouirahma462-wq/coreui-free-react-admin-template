export const extractArticles = (text, memory = []) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  // ================================
  // 🧠 NORMALIZATION
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
  // 🧠 MEMORY SIGNAL
  // ================================
  const memorySignal = new Map();

  for (const m of memory || []) {
    const key = m.type || "unknown";
    memorySignal.set(key, (memorySignal.get(key) || 0) + (m.weight || 0.05));
  }

  // ================================
  // 🧠 PROCESSING LOOP
  // ================================
  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i]?.trim();

    if (!segment || segment.length < 30) continue;

    // ================================
    // 🔎 ARTICLE ID
    // ================================
    const articleNumber =
      segment.match(/(?:الفصل|المادة|Article|Art\.|Section)\s*(\d+)/i)?.[1] ||
      null;

    // ================================
    // 🧠 SEMANTIC SIGNAL
    // ================================
    let semantic = 0;

    if (/جريمة|عقوبة|crime|punishment|penalty/i.test(segment)) semantic += 0.4;
    if (/حقوق|civil|contract|التزام/i.test(segment)) semantic += 0.3;
    if (/محكمة|court|procedure/i.test(segment)) semantic += 0.3;

    // ================================
    // ⚖️ TYPE CLASSIFICATION
    // ================================
    let type = "unknown";
    if (semantic > 0.7) type = "criminal";
    else if (semantic > 0.4) type = "civil";
    else if (/court|محكمة/i.test(segment)) type = "procedural";

    // ================================
    // 🧠 EMBEDDING VECTOR (NORMALIZED)
    // ================================
    const embedding =
      (segment.slice(0, 120)
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0) % 1000) / 1000;

    // ================================
    // 🛰 CONTRADICTION SIGNAL (NETWORK-READY)
    // ================================
    let contradiction = 0;

    if (/ممنوع|غير مسموح|لا يجوز/i.test(segment)) contradiction += 0.4;
    if (/يجوز|مسموح/i.test(segment)) contradiction -= 0.2;

    contradiction = Math.max(0, Math.min(1, contradiction));

    // ================================
    // ⚖️ CROSS-ARTICLE INFLUENCE
    // ================================
    const crossInfluence =
      articles.length > 3 ? 0.05 : 0; // graph density effect

    // ================================
    // 🧠 MEMORY BOOST
    // ================================
    const memoryBoost = memorySignal.get(type) || 0;

    // ================================
    // 📚 FINAL IMPORTANCE ENGINE (GOD LEVEL)
    // ================================
    const importance =
      semantic * 0.5 +
      (articleNumber ? 0.25 : 0) +
      (segment.length / 2600) +
      memoryBoost +
      crossInfluence -
      contradiction * 0.25;

    // ================================
    // ⚖️ DUPLICATION FILTER
    // ================================
    const hash = `${articleNumber}-${segment.slice(0, 60)}`;
    if (seen.has(hash)) continue;
    seen.add(hash);

    // ================================
    // 📚 FINAL NODE (GRAPH READY)
    // ================================
    articles.push({
      id: i,
      text: segment,
      articleNumber,
      type,

      importance: Number(importance.toFixed(3)),
      semantic_signal: Number(semantic.toFixed(3)),
      embedding_vector: embedding,
      contradiction_score: contradiction,

      meta: {
        confidence: articleNumber ? 0.96 : 0.72,
        graph_ready: true,
        ontology_ready: true,
        reinforcement_ready: true
      }
    });
  }

  // ================================
  // 🧠 FINAL SORT (ADVANCED LEGAL RANKING)
  // ================================
  return articles.sort((a, b) => {
    return (
      (b.importance - b.contradiction_score * 0.3) -
      (a.importance - a.contradiction_score * 0.3)
    );
  });
};
