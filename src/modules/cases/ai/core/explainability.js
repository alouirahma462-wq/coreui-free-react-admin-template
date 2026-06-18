export const explainDecision = (results) => {
  return {
    decision_path: results.map((r) => ({
      article: r.article,
      score: r.final_score,
      reason: r.text.slice(0, 120),
    })),

    final_reasoning:
      "تم اختيار المواد بناءً على أعلى تطابق بين الوقائع والنصوص القانونية",
  };
};
