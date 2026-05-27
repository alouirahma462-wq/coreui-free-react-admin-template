import { runLegalAI } from "../runLegalAI.js"

const caseText = `
تم الاعتداء على شخص في الشارع وأخذ هاتفه بالقوة مع وجود شهود.
`

const result = await runLegalAI(caseText)

console.log(JSON.stringify(result, null, 2))
