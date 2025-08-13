import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say hello' }],
    });
    console.log('OpenAI test response:', response.choices[0].message.content);
  } catch (err) {
    console.error('OpenAI test error:', err);
  }
}

test();
