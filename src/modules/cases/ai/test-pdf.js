const fs = require("fs")
const pdfParse = require("pdf-parse")

const run = async () => {

  const pdfPath =
    "src/legal-library/pdf/code-penal.pdf"

  const dataBuffer = fs.readFileSync(pdfPath)

  const data = await pdfParse(dataBuffer)

  console.log("📄 أول 1000 حرف:")
  console.log(data.text.slice(0, 1000))

  console.log("📏 طول النص:")
  console.log(data.text.length)
}

run()
