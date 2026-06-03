import { ai } from "../client.js"

export const judgeEngine = async (caseText, analysis) => {

  const prompt = `
أنت قاضي حكم نهائي.

بناء على التحليل التالي:

${analysis}

والقضية:
${caseText}

أعطني:

1. verdict (guilty / not_guilty / pending)
2. confidence (0-1)
3. حكم مختصر
4. توصية قانونية
`

  const res = await ai(prompt)

  return {
    verdict: "pending",
    confidence: 0.7,
    judgment: res
  }
}
