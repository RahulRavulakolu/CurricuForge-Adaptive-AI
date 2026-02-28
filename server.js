import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
	console.warn('OPENAI_API_KEY not set. Set it in .env before starting the server.');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const useGroq = !!process.env.GROQ_API_KEY && !!process.env.GROQ_API_URL;

app.post('/api/llm', async (req, res) => {
	try {
		const { prompt, response_json_schema, temperature = 0.2, model } = req.body;

		const system = `You are an assistant that must respond with valid JSON only that matches the requested schema. Do not add any explanatory text.`;

		// Determine if we should use Groq
		const useGroq = !!process.env.GROQ_API_KEY;
		const defaultModel = useGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini';
		const selectedModel = model || defaultModel;

		let client;
		if (useGroq) {
			client = new OpenAI({
				apiKey: process.env.GROQ_API_KEY,
				baseURL: process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1'
			});
		} else {
			client = openai;
		}

		const messages = [
			{ role: 'system', content: system },
			{ role: 'user', content: prompt }
		];

		const completion = await client.chat.completions.create({
			model: selectedModel,
			messages,
			temperature,
			response_format: response_json_schema ? { type: 'json_object' } : undefined
		});

		const content = completion.choices?.[0]?.message?.content || '';

		// Attempt to extract JSON substring if it's not already clean
		const jsonMatch = content.match(/\{[\s\S]*\}/);
		const jsonString = jsonMatch ? jsonMatch[0] : content;

		try {
			const parsed = JSON.parse(jsonString);
			return res.json(parsed);
		} catch (e) {
			return res.status(502).json({ error: 'Failed to parse JSON from LLM', raw: content });
		}
	} catch (err) {
		console.error('LLM proxy error:', err);
		return res.status(500).json({ error: err.message || 'LLM proxy failed' });
	}
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`LLM proxy listening on http://localhost:${port}`));
