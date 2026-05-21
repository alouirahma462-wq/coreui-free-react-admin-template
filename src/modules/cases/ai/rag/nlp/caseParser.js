export const parseCase = (text) => {
  return {
    facts: text,
    actors: {
      victim: text.includes("شخص") ? "موجود" : "غير محدد",
      accused: "غير محدد"
    }
  }
}
