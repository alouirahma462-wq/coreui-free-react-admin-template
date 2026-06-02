export const ai = async (prompt) => {
  const res = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3.2:1b",
      prompt,
      stream: false
    })
  })

  const data = await res.json()
  return data.response
}
