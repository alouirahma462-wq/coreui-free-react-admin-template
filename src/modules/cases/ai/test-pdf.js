import { readLegalPDF, chunkText } from "./pdfReader.js"

const run = async () => {
  const text = await readLegalPDF(
    "src/legal-library/pdf/code-penal.pdf"
  )

  console.log("📄 أول 1000 حرف:")
  console.log(text.slice(0, 1000))

  const chunks = chunkText(text)

  console.log("📦 عدد الأجزاء:", chunks.length)
}

run()
