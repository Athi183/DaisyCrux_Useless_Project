import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let model;
try {
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} catch (error) {
  console.error("Failed to initialize Gemini model:", error);
}

app.post('/api/get-malayalam-comment', async (req, res) => {
  try {
    const { roundness, burn_count } = req.body;
    console.log("Received input:", { roundness, burn_count });

    if (!model) {
      console.error("❌ Gemini model is not initialized.");
      return res.status(500).json({ error: "Gemini model not initialized." });
    }

    if (typeof roundness !== 'number' || typeof burn_count !== 'number') {
      return res.status(400).json({ error: "Invalid input. roundness and burn_count must be numbers." });
    }

    const prompt = `
      You are a funny friend from Kerala, India...
      (your existing prompt)
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ comment: text.trim() });

  } catch (error) {
    // 🔥 Print the full error object
    console.error("❌ Gemini API Error:", error);
    
    // Also send the error message in response for debugging (remove later)
    res.status(500).json({ error: error.message || "Failed to generate comment." });
  }
});


const PORT = 5001;
app.listen(PORT, () => console.log(`🟢 Node.js server running on http://localhost:${PORT}`));
