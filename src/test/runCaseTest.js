import dotenv from "dotenv";
dotenv.config();

import { runLegalAI } from "../modules/cases/ai/pipeline/runLegalAI.js";

const caseText = `
تم سرقة هاتف محمول من شخص في الطريق العام
مع وجود شاهد وتناقض في أقوال المشتبه به
`;

async function test() {
  console.log("🧪 START TEST CASE\n");

  const result = await runLegalAI(caseText);

  console.log("\n================ RESULT ================\n");
  console.dir(result, { depth: null });

  console.log("\n🧪 DONE\n");
}

test();
