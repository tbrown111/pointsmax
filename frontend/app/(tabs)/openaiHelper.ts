import { OpenAI } from "openai";

const openai = new OpenAI({
  //apiKey: "",
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
