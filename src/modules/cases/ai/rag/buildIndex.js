import { lawDB } from "./lawDB.js";
import { embedText } from "./embeddings.js";

export const buildIndex = async () => {
  const chunks = await loadAllLaws();

  const enriched = [];

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i].text;

    const vector = await embedText(text);

    enriched.push({
      text,
      vector,
      id: i
    });
  }

  lawDB.add(enriched);

  console.log("✅ INDEX READY");
};
