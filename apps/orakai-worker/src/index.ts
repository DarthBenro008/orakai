import { Hono } from 'hono'
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: Bun.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://orakai.xyz",
    "X-Title": "Orakai",
  },
});

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/fetch', async (c) => {
  console.log('fetching')
  try {
    const response = await openai.chat.completions.create({
      model: 'google/gemini-2.5-pro-exp-03-25:free',
      messages: [
        {
          role: 'user',
          content: 'Translate ‘I would like to go to cafe for dinner’ to French, reply in single phrase, nothing else',
        },
      ],
    })
    console.log('fetched', response)
    return c.json({ result: response.choices[0].message.content })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to fetch' }, 500)
  }
})

export default {
  idleTimeout: 30,
  port: 3001,
  fetch: app.fetch,
}
