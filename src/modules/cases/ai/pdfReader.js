import fs from "fs"
import * as pdfParse from "pdf-parse"

export const readLegalPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath)

  // pdf-parse في ESM يعطي function مباشرة غالبًا داخل default أو module object
  const parse = pdfParse.default ?? pdfParse

  const data = await parse(buffer)
  return data.text
}

export const chunkText = (text, size = 800) => {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}
