import { runLegalAI } from "../runLegalAI.js"

console.log("🚀 FILE STARTED")

const caseText = `
تم الاعتداء على شخص في الشارع وأخذ هاتفه بالقوة مع وجود شهود.
`

async function main() {
  console.log("📥 BEFORE AI CALL")

  const result = await runLegalAI(caseText)

  console.log("📤 AFTER AI CALL")

  console.log("RESULT:")
  console.log(result)
}

main()
