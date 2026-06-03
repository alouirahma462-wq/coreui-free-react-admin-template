import { runLegalAI } from "../runLegalAI.js"

const testCase = `
تم الاعتداء على شخص في الشارع وأخذ هاتفه بالقوة مع وجود شهود.
`

console.log("🚀 FILE STARTED")

const result = await runLegalAI(testCase)

console.log("📊 RESULT:")
console.dir(result, { depth: null })
