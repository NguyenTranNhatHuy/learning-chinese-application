import { http } from "./http";

export async function checkGrammar(text, lang = "zh") {
  const res = await http.post("/ai/grammar", { text, lang });
  return res.data;
}
