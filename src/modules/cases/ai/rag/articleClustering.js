export const clusterArticles = (articles) => {
  const clusters = {
    theft: [],
    violence: [],
    fraud: [],
    unknown: [],
  };

  for (const a of articles) {
    const text = a.text;

    if (text.includes("سرقة")) clusters.theft.push(a);
    else if (text.includes("عنف")) clusters.violence.push(a);
    else if (text.includes("تحيل")) clusters.fraud.push(a);
    else clusters.unknown.push(a);
  }

  return clusters;
};
