import { pipeline } from "@xenova/transformers";

let embedder = null;

export const getEmbedder = async () => {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embedder;
};

export const embedText = async (text) => {
  const model = await getEmbedder();

  const output = await model(text, {
    pooling: "mean",
    normalize: true
  });

  let vector = Array.from(output.data);

  vector = vector.map(Number).filter(v => Number.isFinite(v));

  if (vector.length !== 384) {
    throw new Error("Invalid embedding size");
  }

  return vector;
};
