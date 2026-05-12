import fs from "fs"
import pdf from "pdf-parse"
import { readFile } from "fs/promises"

const run = async () => {
  const pdfPath = "src/legal-library/pdf/code-penal.pdf"

  const dataBuffer = await readFile(pdfPath)

  const data = await pdf(dataBuffer)

  console.log("📄 أول 1000 حرف:")
  console.log(data.text.slice(0, 1000))

  console.log("📏 طول النص:")
  console.log(data.text.length)
}

run()
