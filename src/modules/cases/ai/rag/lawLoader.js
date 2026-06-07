import { buildLegalChunks } from "../pdfReader.js"
import path from "path"
import fs from "fs"

const LAW_PATH = path.resolve("src/legal-library/pdf")

export const loadAllLaws = async () => {
  try {

    console.log("📚 Loading laws from:", LAW_PATH)

    const files = fs.readdirSync(LAW_PATH)
      .filter(file => file.endsWith(".pdf"))

    let allChunks = []

    for (const file of files) {

      const filePath = path.join(LAW_PATH, file)

      console.log("📄 Processing PDF:", file)

      const chunks = await buildLegalChunks(filePath)

      if (Array.isArray(chunks)) {
        allChunks.push(...chunks)
      } else {
        console.warn("⚠️ No chunks returned from:", file)
      }
    }

    console.log("✅ Total chunks loaded:", allChunks.length)

    return allChunks

  } catch (err) {
    console.error("❌ loadAllLaws error:", err)
    return []
  }
}
