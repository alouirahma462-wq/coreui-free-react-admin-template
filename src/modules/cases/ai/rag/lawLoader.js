import { buildLegalChunks } from "../pdfReader.js"
import path from "path"
import fs from "fs"

const LAW_PATH = "src/legal-library/pdf"

export const loadAllLaws = async () => {
  const files = fs.readdirSync(LAW_PATH)

  let allChunks = []

  for (const file of files) {
    const filePath = path.join(LAW_PATH, file)

    const chunks = await buildLegalChunks(filePath)

    allChunks = allChunks.concat(chunks)
  }

  return allChunks
}
