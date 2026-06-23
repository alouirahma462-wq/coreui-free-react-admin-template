export const buildArticles = (pages, memoryBank = []) => {
  const articles = [];

  let current = null;

  // ================================
  // 🧠 GLOBAL MEMORY CONTEXT (NEW)
  // ================================
  const memoryIndex = new Map();

  for (const mem of memoryBank || []) {
    const key = mem?.articleNumber || mem?.title;
    if (key) memoryIndex.set(key, mem);
  }

  let bufferConfidence = 0;

  for (const page of pages || []) {
    const text = page?.text || "";

    const lines = text.split(/\n|\.|\r|؛/g);

    for (const line of lines) {
      const clean = line?.trim();
      if (!clean) continue;

      // ================================
      // 🔎 ARTICLE DETECTION
      // ================================
      const articleMatch = clean.match(
        /(?:الفصل|المادة|Article)\s*(\d+)/i
      );

      const articleNumber = articleMatch?.[1] || null;
      const isArticle = !!articleMatch;

      // ================================
      // 🧠 MEMORY MATCHING (CROSS-CASE LEARNING)
      // ================================
      const memoryBoost =
        memoryIndex.has(articleNumber)
          ? 0.25
          : 0;

      const semanticSignal =
        /قانون|محكمة|جريمة|عقوبة|تنفيذ|حق|التزام|crime|law|court/i.test(clean)
          ? 0.2
          : 0;

      const contradictionHint =
        /ممنوع|غير مسموح|لا يجوز|prohibited|not allowed/i.test(clean)
          ? 0.15
          : 0;

      // ================================
      // 🧠 START NEW ARTICLE NODE
      // ================================
      if (isArticle) {
        if (current) articles.push(current);

        current = {
          id: articles.length + 1,
          title: clean,
          articleNumber,
          text: clean,
          page: page.pageNumber,

          // ================================
          // 🧠 CORE SIGNALS
          // ================================
          importance: 0.55 + semanticSignal + memoryBoost,
          continuityScore: 0,
          contradictionHint,

          // ================================
          // 🧠 GRAPH READY LINKS
          // ================================
          references: [],
          related_articles: []
        };

        bufferConfidence = 0.7;
        continue;
      }

      // ================================
      // 🧠 CONTINUATION LOGIC
      // ================================
      if (current) {
        current.text += " " + clean;

        bufferConfidence = Math.min(
          1,
          bufferConfidence + clean.length / 4000
        );

        current.continuityScore = bufferConfidence;

        current.importance =
          (current.importance || 0.5) +
          semanticSignal * 0.1 +
          memoryBoost * 0.05;
      }
    }
  }

  // ================================
  // 🧠 FINAL PUSH
  // ================================
  if (current) articles.push(current);

  // ================================
  // 🛰️ CROSS-ARTICLE LINKING ENGINE
  // ================================
  const linked = articles.map((a, i, arr) => {
    const related = arr
      .filter(
        (b) =>
          b !== a &&
          (b.articleNumber === a.articleNumber ||
            Math.abs(b.importance - a.importance) < 0.1)
      )
      .slice(0, 3)
      .map((r) => r.articleNumber || r.id);

    return {
      ...a,

      related_articles: related,

      // ================================
      // 🧠 FINAL GOD SCORE
      // ================================
      score: Number(
        (
          (a.importance || 0.5) * 0.5 +
          (a.continuityScore || 0) * 0.3 +
          (a.contradictionHint || 0) * 0.15 +
          (a.memoryBoost || 0) * 0.2
        ).toFixed(3)
      ),

      // ================================
      // 🧠 AI READY FLAGS
      // ================================
      graph_ready: true,
      memory_ready: true,
      embedding_ready: true,
      ontology_ready: true
    };
  });

  // ================================
  // ⚖️ SORT BY LEGAL IMPORTANCE
  // ================================
  return linked.sort((a, b) => b.score - a.score);
};
