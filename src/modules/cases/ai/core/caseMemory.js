class CaseMemory {
  constructor() {
    this.cases = [];
  }

  addCase(caseData) {
    this.cases.push({
      ...caseData,
      timestamp: Date.now(),
    });
  }

  searchSimilar(caseText) {
    return this.cases
      .map((c) => ({
        ...c,
        similarity: this.simpleMatch(c.text, caseText),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);
  }

  simpleMatch(a, b) {
    const aWords = a.split(" ");
    const bWords = b.split(" ");
    return aWords.filter((w) => bWords.includes(w)).length;
  }
}

export const caseMemory = new CaseMemory();
