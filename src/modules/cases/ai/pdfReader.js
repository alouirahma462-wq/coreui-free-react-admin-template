import fs from "fs"
const pdf = require("pdf-parse")

// 📄 قراءة PDF القانون
export const readLegalPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath)
  const data = await pdf(buffer)
  return data.text
}

// ✂️ تقسيم النص
export const chunkText = (text, size = 800) => {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}
