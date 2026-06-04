import { ai } from "../client.js";

const run = async () => {
  const result = await ai("تم سرقة هاتف في الشارع");
  console.log("AI RESULT:");
  console.log(result);
};

run();
