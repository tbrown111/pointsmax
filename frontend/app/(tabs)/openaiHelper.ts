import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "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", 
  dangerouslyAllowBrowser: true,
});

export const askOpenAI = async (prompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Error querying OpenAI:", err);
    return "Something went wrong!";
  }
};
