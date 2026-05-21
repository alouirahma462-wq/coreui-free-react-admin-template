import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

//
// 🧠 قراءة PDF قانوني بشكل احترافي
// يحافظ على ترتيب الصفحات + ينظف النص + جاهز للـ RAG
//
export const readLegalPDF = async (filePath) => {
  const data = new Uint8Array(fs.readFileSync(filePath))

  const pdf = await pdfjsLib.getDocument({ data }).promise

  let pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // 🧹 تنظيف النص
    const pageText = content.items
      .map(item => item.str)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()

    pages.push({
      pageNumber: i,
      text: pageText
    })
  }

  return pages
}

//
// ✂️ تقسيم ذكي للنص (RAG chunks)
// يحافظ على المعنى القانوني
//
export const chunkText = (text, size = 1000) => {
  const chunks = []

  const sentences = text
    .replace(/\n/g, " ")
    .split(".")

  let current = ""

  for (const sentence of sentences) {
    const clean = sentence.trim()

    if (!clean) continue

    if ((current + clean).length > size) {
      chunks.push(current.trim())
      current = clean + ". "
    } else {
      current += clean + ". "
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks
}

//
// 📚 تحويل PDF كامل إلى chunks جاهزة للـ AI
//
export const buildLegalChunks = async (filePath) => {
  const pages = await readLegalPDF(filePath)

  const chunks = []

  for (const page of pages) {
    const pageChunks = chunkText(page.text)

    pageChunks.forEach((chunk, index) => {
      chunks.push({
        page: page.pageNumber,
        chunkIndex: index,
        text: chunk
      })
    })
  }

  return chunks
}
