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
