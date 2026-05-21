import { runJudge } from "./src/modules/cases/ai/engine/judgeEngine.js"

const caseText = `
تم الاعتداء على شخص وأخذ هاتفه بالقوة في الطريق العام مع وجود شهود وكاميرا
`

const result = await runJudge(caseText)

console.log(result)
