import fs from "fs"

const LAW_PATH = "src/legal-library/pdf"

export const loadAllLaws = () => {
  const files = fs.readdirSync(LAW_PATH)

  let allText = ""

  for (const file of files) {
    const content = fs.readFileSync(`${LAW_PATH}/${file}`, "utf-8")
    allText += "\n" + content
  }

  return allText
}
