import { ai } from "../client.js"

console.log("🚀 FILE STARTED")

const run = async () => {
  console.log("📥 BEFORE AI CALL")

  const res = await ai("مرحبا")
  console.log("📤 AI RESPONSE:", res)
}

run()
