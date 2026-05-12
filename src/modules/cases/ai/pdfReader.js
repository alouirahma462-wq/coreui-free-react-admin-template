import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

// 📄 قراءة PDF قانوني
export const readLegalPDF = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath))

  const pdf = await pdfjsLib.getDocument({ data }).promise

  let text = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(item => item.str).join(" ") + "\n"
  }

  return text
}

// ✂️ تقسيم النص
export const chunkText = (text, size = 800) => {
  const chunks = []

  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size))
  }

  return chunks
}
