import { loadAllLaws } from "../rag/lawLoader.js"
import { extractArticles } from "../rag/articleExtractor.js"
import { searchRelevantArticles } from "../rag/lawSearch.js"
import { legalEngine } from "../legalEngine.js"

export const runJudge = async (caseText) => {

  const lawText = loadAllLaws()
  const articles = extractArticles(lawText)
  const relevant = searchRelevantArticles(articles, caseText)

  const report = await legalEngine(caseText, relevant)

  return report
}
