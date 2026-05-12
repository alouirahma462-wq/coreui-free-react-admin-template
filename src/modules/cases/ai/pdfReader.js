import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

export const readLegalPDF = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath))

  const pdf = await pdfjsLib.getDocument({ data }).promise

  let text = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items.map(item => item.str).join(" ")
    text += strings + "\n"
  }

  return text
}

export const chunkText = (text, size = 800) => {
  const chunks = []
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}
