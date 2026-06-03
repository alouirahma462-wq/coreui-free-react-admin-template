import dotenv from "dotenv";
dotenv.config();

import { ai } from "../client.js";

const run = async () => {
  const res = await ai("تم سرقة هاتف في الشارع");
  console.log(res);
};

run();
