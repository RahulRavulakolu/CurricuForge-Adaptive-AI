import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDB } from './src/lib/mongodb.js';
import { ObjectId } from 'mongodb';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Curriculum API Endpoints
app.post('/api/curricula', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('curricula');
		const data = req.body;

		const newCurriculum = {
			...data,
			created_date: new Date().toISOString(),
			updated_date: new Date().toISOString(),
			status: data.status || 'draft'
		};

		const result = await collection.insertOne(newCurriculum);
		res.status(201).json({ _id: result.insertedId, ...newCurriculum });
	} catch (err) {
		console.error('Error creating curriculum:', err);
		res.status(500).json({ error: 'Failed to create curriculum' });
	}
});

app.get('/api/curricula', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('curricula');
		const items = await collection.find({}).sort({ created_date: -1 }).toArray();
		res.json({ items, total: items.length });
	} catch (err) {
		console.error('Error fetching curricula:', err);
		res.status(500).json({ error: 'Failed to fetch curricula' });
	}
});

app.get('/api/curricula/:id', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('curricula');
		const item = await collection.findOne({ _id: new ObjectId(req.params.id) });
		if (!item) return res.status(404).json({ error: 'Curriculum not found' });
		res.json(item);
	} catch (err) {
		console.error('Error fetching curriculum:', err);
		res.status(500).json({ error: 'Failed to fetch curriculum' });
	}
});

app.put('/api/curricula/:id', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('curricula');
		const data = req.body;
		const result = await collection.findOneAndUpdate(
			{ _id: new ObjectId(req.params.id) },
			{ $set: { ...data, updated_date: new Date().toISOString() } },
			{ returnDocument: 'after' }
		);
		if (!result) return res.status(404).json({ error: 'Curriculum not found' });
		res.json(result);
	} catch (err) {
		console.error('Error updating curriculum:', err);
		res.status(500).json({ error: 'Failed to update curriculum' });
	}
});

app.delete('/api/curricula/:id', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('curricula');
		const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
		if (result.deletedCount === 0) return res.status(404).json({ error: 'Curriculum not found' });
		res.json({ success: true });
	} catch (err) {
		console.error('Error deleting curriculum:', err);
		res.status(500).json({ error: 'Failed to delete curriculum' });
	}
});

// Course API Endpoints
app.post('/api/courses', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('courses');
		const data = req.body;
		const newCourse = {
			...data,
			created_date: new Date().toISOString(),
			updated_date: new Date().toISOString()
		};
		const result = await collection.insertOne(newCourse);
		res.status(201).json({ _id: result.insertedId, ...newCourse });
	} catch (err) {
		console.error('Error creating course:', err);
		res.status(500).json({ error: 'Failed to create course' });
	}
});

app.get('/api/courses', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('courses');
		const items = await collection.find({}).sort({ created_date: -1 }).toArray();
		res.json({ items, total: items.length });
	} catch (err) {
		console.error('Error fetching courses:', err);
		res.status(500).json({ error: 'Failed to fetch courses' });
	}
});

app.get('/api/courses/:id', async (req, res) => {
	try {
		const db = getDB();
		const collection = db.collection('courses');
		const item = await collection.findOne({ _id: new ObjectId(req.params.id) });
		if (!item) return res.status(404).json({ error: 'Course not found' });
		res.json(item);
	} catch (err) {
		console.error('Error fetching course:', err);
		res.status(500).json({ error: 'Failed to fetch course' });
	}
});

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - send all other requests to index.html
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3001;

// Initialize database then start server
const startServer = async () => {
	try {
		console.log('Connecting to MongoDB...');
		await connectDB();
		app.listen(port, () => {
			console.log(`Server listening on port ${port}`);
			console.log(`Database connected and server ready!`);
		});
	} catch (err) {
		console.error('SERVER FATAL: Failed to connect to MongoDB on startup or initialize server:');
		console.error(err);
		process.exit(1);
	}
};

startServer();
