import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

// ✅ CORS config
const allowedOrigins = [
  "https://wabi-roti.onrender.com",
  "https://wabi-roti.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// ✅ Gemini API initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let model;
try {
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} catch (error) {
  console.error("❌ Gemini മോഡൽ ഇൻഷിയലൈസ് ചെയ്യാൻ കഴിഞ്ഞില്ല:", error);
}

const fallbackJokes = [
  "ഇത് ചപ്പാത്തിയാണോ, പഴയ ഭൂമിയുടെ ചിത്രം ആണോ?",
  "പൊള്ളലുകൾ കണ്ടപ്പോൾ തോന്നി, അടുപ്പിന് നേരെ റോക്കറ്റ് ഇറങ്ങിയെന്നു!",
  "വൃത്താകാരം കാണാൻ കണ്ണാടിയും വേണം!",
  "ചന്ദ്രഗ്രഹണത്തിന്റെ ബോണസ് വേർഷൻ പോലെ!",
  "അടുപ്പിനൊപ്പം ആർട്ട് ക്ലാസ് പോയിട്ടുണ്ടോ?",
  "പൊള്ളൽ ഇങ്ങനെ വന്നാൽ അടുപ്പിനും PTSD ഉണ്ടാകും!",
  "വൃത്തം വരയ്ക്കാൻ സ്കെയിലും കോമ്പസും മറന്നോ?",
  "ചപ്പാത്തിക്ക്‌ സ്വന്തമായി GPS വേണം, വഴികേടായി തോന്നുന്നു!",
  "ഇത് ചപ്പാത്തിയോ, കറുത്ത ചന്ദ്രൻ്റെ സിമുലേഷൻ ആണോ?",
  "പൊള്ളലുകൾക്ക് ISO സർട്ടിഫിക്കറ്റ് കൊടുക്കാം!"
];

app.post('/api/get-malayalam-comment', async (req, res) => {
  try {
    const { roundness, burn_count } = req.body;
    console.log("📥 ലഭിച്ച ഇൻപുട്ട്:", { roundness, burn_count });

    if (!model) {
      return res.status(500).json({ error: "Gemini മോഡൽ റെഡി അല്ല." });
    }

    if (typeof roundness !== 'number' || typeof burn_count !== 'number') {
      return res.status(400).json({ error: "roundness, burn_count നമ്പറാകണം." });
    }

    const prompt = `
നിങ്ങൾ കേരളത്തിൽ നിന്നുള്ള ഒരു കല്യാണക്കാരൻ...
(remaining prompt unchanged)
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = (response.text() || "").trim();

    if (!text || /[a-zA-Z]/.test(text)) {
      text = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({ comment: text });

  } catch (error) {
    const fallback = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(500).json({ comment: fallback, error: error.message || "Comment generation failed." });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🟢 Node.js server running on port ${PORT}`);
});
