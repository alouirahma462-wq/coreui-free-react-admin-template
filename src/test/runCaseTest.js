import dotenv from "dotenv";
dotenv.config();

import { runLegalAI } from "../modules/cases/ai/pipeline/runLegalAI.js";

async function test() {
  console.log("🧪 START TEST CASE");

  const caseText = `
    تم سرقة هاتف من شخص في الطريق العام،
    شاهد الواقعة شخص آخر،
    المشتبه به ينكر لكنه متناقض في أقواله
  `;

  const result = await runLegalAI(caseText);

  console.log("\n================ FINAL RESULT ================\n");

  console.dir(result, {
    depth: null
  });

  console.log("\n🧪 TEST DONE");
}

test();
