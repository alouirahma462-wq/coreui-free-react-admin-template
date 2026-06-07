import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"

//
// 🧠 LEGAL PDF READER (LexisNexis Ready)
// stable + safe + no crashes
//

export const readLegalPDF = async (filePath) => {
  try {

    if (!fs.existsSync(filePath)) {
      throw new Error("PDF file not found: " + filePath)
    }

    const buffer = fs.readFileSync(filePath)

    if (!buffer || buffer.length === 0) {
      throw new Error("PDF is empty (0 bytes)")
    }

    const data = new Uint8Array(buffer)

    const pdf = await pdfjsLib.getDocument({
      data,
      disableWorker: true // 🔥 مهم جداً في Node / Codespaces
    }).promise

    let pages = []

    for (let i = 1; i <= pdf.numPages; i++) {

      const page = await pdf.getPage(i)
      const content = await page.getTextContent()

      const text = content.items
        .map(item => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()

      // 🔥 تجاهل الصفحات الفارغة
      if (!text || text.length < 5) continue

      pages.push({
        pageNumber: i,
        text
      })
    }

    return pages

  } catch (err) {
    console.error("❌ readLegalPDF ERROR:", err.message)
    return []
  }
}

//
// ✂️ SMART CHUNKING (Legal optimized)
//

export const chunkText = (text, size = 1200) => {
  try {

    if (!text) return []

    const chunks = []

    const sentences = text
      .replace(/\n/g, " ")
      .split(/[.؟!]/g) // 🔥 أفضل للقانون العربي

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

  } catch (err) {
    console.error("❌ chunkText error:", err.message)
    return []
  }
}

//
// 📚 BUILD LEGAL CHUNKS (RAG READY)
//

export const buildLegalChunks = async (filePath) => {
  try {

    const pages = await readLegalPDF(filePath)

    if (!pages.length) return []

    const chunks = []

    for (const page of pages) {

      const pageChunks = chunkText(page.text)

      for (let i = 0; i < pageChunks.length; i++) {

        chunks.push({
          page: page.pageNumber,
          chunkIndex: i,
          text: pageChunks[i]
        })
      }
    }

    return chunks

  } catch (err) {
    console.error("❌ buildLegalChunks ERROR:", err.message)
    return []
  }
}
