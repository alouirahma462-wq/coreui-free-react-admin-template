import { buildIndex } from "./src/modules/cases/ai/rag/buildIndex.js";
import { searchRelevantArticles } from "./src/modules/cases/ai/rag/search.js";

await buildIndex();

const results = await searchRelevantArticles(
  "سرقة هاتف في تونس"
);

console.log(results);
