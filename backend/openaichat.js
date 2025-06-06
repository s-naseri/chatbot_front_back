// openaiChat.js
import { openai } from './embedding.js';

export async function getOpenAIResponseWithContext(userMessage, contextText, temperature = 0.6, maxTokens = 512) {
  try {
    // If no context provided, return fixed response immediately
    if (!contextText || contextText.trim().length === 0) {
      return "در حیطه تخصص من نیست.";
    }

    const systemContent = `شما یک دستیار هوشمند هستید که فقط باید بر اساس متن زیر به سوال کاربر پاسخ دهید.پاسخ ها را خلاصه کن تاتوکن کمتری مصرف شود ولی از اطلاعات کاسته نشود. اگر پاسخ در متن نیست، بگویید "در حیطه تخصص من نیست." پاسخ را فقط به زبان فارسی بدهید. متن مرتبط:\n${contextText}`;

    const messages = [
      { role: "system", content: systemContent },
      { role: "user", content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature,
      max_tokens: maxTokens,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message || error);
    return "متاسفانه در دریافت پاسخ از OpenAI مشکلی پیش آمد.";
  }
}
