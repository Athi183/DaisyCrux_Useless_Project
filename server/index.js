import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Gemini API initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let model;
try {
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} catch (error) {
  console.error("❌ Gemini മോഡൽ ഇൻഷിയലൈസ് ചെയ്യാൻ കഴിഞ്ഞില്ല:", error);
}

// ✅ Fallback Malayalam jokes
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
      console.error("❌ Gemini മോഡൽ റെഡി അല്ല.");
      return res.status(500).json({ error: "Gemini മോഡൽ റെഡി അല്ല." });
    }

    if (typeof roundness !== 'number' || typeof burn_count !== 'number') {
      return res.status(400).json({ error: "roundness, burn_count നമ്പറാകണം." });
    }

    const prompt = `
നിങ്ങൾ കേരളത്തിൽ നിന്നുള്ള ഒരു കല്യാണക്കാരൻ, പറ്റാപ്പുകളോടെ സംസാരിക്കുന്ന ഒരു സുഹൃത്ത്.
ഒരു ചപ്പാത്തി വിശകലന വിദഗ്ധനായിട്ട്, ഞാൻ കൊടുക്കുന്ന roundness, burn_count മൂല്യങ്ങൾ നോക്കി
ചിരിപ്പിക്കുന്ന രീതിയിൽ, **മലയാളത്തിൽ മാത്രം** അഭിപ്രായം പറയണം.

നിയമങ്ങൾ:
1. മറുപടി **മലയാളത്തിൽ മാത്രം** വേണം.
2. സുഹൃത്ത് പോലെ, തമാശയും പുഞ്ചിരിയും നിറഞ്ഞ രീതിയിൽ സംസാരിക്കുക.
3. Roundness → ചപ്പാത്തിയുടെ വൃത്താകാരത്തെ കുറിച്ച് പറയണം.
4. Burn_count → എത്ര ‘കറുത്തുപൊള്ളിയ’ പാടുകൾ ഉണ്ടെന്ന് പറഞ്ഞ് കളിയാക്കണം.
5. മറുപടി 1–3 വാക്യങ്ങളിൽ ഒതുക്കണം.

ഉദാഹരണം:
- "ഇത് ചപ്പാത്തിയാണോ, ഇല്ലെങ്കിൽ പഴകിയ ചന്ദ്രൻ്റെ ചിത്രം ആണോ?"
- "പൊള്ളലുകൾ കണ്ടപ്പോൾ തോന്നി, അടുപ്പിന് നേരെ ഷൂട്ട് ചെയ്തെന്നു!"

ഇപ്പോൾ, roundness = ${roundness}, burn_count = ${burn_count}.
IMPORTANT: മറുപടി മലയാളത്തിൽ മാത്രമേ വരിക. If you reply in English, your answer will be rejected.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = (response.text() || "").trim();

    // ✅ Fallback if Gemini gives empty or English text
    if (!text || /[a-zA-Z]/.test(text)) {
      console.warn("⚠️ Gemini English/Empty മറുപടി നൽകി. Fallback joke ഉപയോഗിക്കുന്നു.");
      text = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    }

    // ✅ Ensure UTF-8 output
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.json({ comment: text });

  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    const fallback = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(500).json({ comment: fallback, error: error.message || "Comment generation failed." });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🟢 Node.js സെർവർ പ്രവർത്തിക്കുന്നു: http://localhost:${PORT}`));
