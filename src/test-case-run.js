import { extractCaseFromFolder } from "./modules/cases/ai/ingestion/nlpExtractor.js";

const result = await extractCaseFromFolder(
  "./src/legal-library/cases"
);

console.log(JSON.stringify(result, null, 2));
