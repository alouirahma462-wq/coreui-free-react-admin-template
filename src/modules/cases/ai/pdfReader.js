import fs from "fs"
import pdfParsePkg from "pdf-parse"

const pdfParse = pdfParsePkg.default || pdfParsePkg

export const readLegalPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath)
  const data = await pdfParse(buffer)
  return data.text
}

export const chunkText = (text, size = 800) => {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}
