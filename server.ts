import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI client (Server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    studio: 'Bounce Fitness Studio',
    location: 'Chikmagalur, Karnataka',
    timestamp: new Date().toISOString(),
  });
});

// 1. Google Maps Grounded Studio Neighborhood & Route Guide
app.post('/api/gemini/maps-info', async (req, res) => {
  try {
    const { query } = req.body;
    const prompt = query || 'What are the landmarks, roads, and directions to reach Gundappa Gowda Arcade, Kalyananagara, MG Road in Chikmagalur, Karnataka for Bounce Fitness Studio?';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: 13.3153,
              longitude: 75.7754,
            },
          },
        },
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      success: true,
      text,
      groundingChunks,
    });
  } catch (error: any) {
    console.error('Error fetching Maps grounded info:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve Maps grounded information',
    });
  }
});

// 2. Low-latency Fitness Advisor (using gemini-3.1-flash-lite)
app.post('/api/gemini/fitness-advisor', async (req, res) => {
  try {
    const { goal, experienceLevel, preferredDays, injuries, additionalNotes } = req.body;

    const prompt = `You are the Head Coach AI at Bounce Fitness Studio in Chikmagalur, Karnataka.
A prospective or current member has provided their fitness profile:
- Primary Goal: ${goal || 'General fitness and strength'}
- Experience Level: ${experienceLevel || 'Beginner'}
- Days Available per Week: ${preferredDays || '3-4 days'}
- Injuries/Limitations: ${injuries || 'None'}
- Notes: ${additionalNotes || 'Looking to start consistently'}

Our studio offers 4 primary core programs:
1. Gym Training (Strength & conditioning, free weights, progressive resistance)
2. Personal Training (1-on-1 personalized attention, technique, accountability)
3. Zumba (High-energy dance fitness, music, cardio conditioning)
4. CrossFit (Functional high-intensity movements, athletic stamina, community)

Provide a sharp, motivating, structured recommendation:
1. Recommended Program (Pick the single best match, or a hybrid e.g. Gym + Zumba).
2. Weekly Workout Structure (Sample breakdown for their available days).
3. First 30-Day Focus (Key habits and consistency milestones).
4. Direct Invitation to book a session at Bounce Fitness Studio Chikmagalur.

Keep the tone energetic, athletic, welcoming, and concise (under 250 words).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    res.json({
      success: true,
      recommendation: response.text || 'Consistent training starts with your first step.',
    });
  } catch (error: any) {
    console.error('Error in fitness advisor:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate fitness recommendation',
    });
  }
});

// 3. Multimodal Workout Video / Photo Form & Movement Analyzer (using gemini-3.8-flash)
app.post('/api/gemini/analyze-form', async (req, res) => {
  try {
    const { fileBase64, mimeType, exerciseName, focusNotes } = req.body;

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({ success: false, error: 'Media file base64 and mimeType are required' });
    }

    const cleanBase64 = fileBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');

    const mediaPart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `You are an elite Strength & Conditioning coach at Bounce Fitness Studio Chikmagalur.
Analyze this exercise clip/image of a user performing: ${exerciseName || 'a fitness movement'}.
Special user focus: ${focusNotes || 'Overall posture and alignment'}.

Provide a structured, encouraging biomechanical feedback review:
1. **Movement Identification & Posture Assessment**: Spine alignment, bar path/hand/foot placement, core engagement.
2. **Key Strengths**: What was done correctly.
3. **Form Corrections / Risk Factors**: Areas to refine to protect joints and maximize power.
4. **Actionable Coaching Cue**: A single cue to remember for the next set (e.g., "Screw your feet into the floor").

Note: Always add a disclaimer that in-person guidance with our certified trainers at Bounce Fitness Studio is recommended for tailored technique adjustments.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [mediaPart, textPart] },
    });

    res.json({
      success: true,
      analysis: response.text || 'Analysis complete.',
    });
  } catch (error: any) {
    console.error('Error analyzing form:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze movement video or image',
    });
  }
});

// 4. Studio Visuals & Motivation Generator (gemini-3.1-flash-lite-image)
app.post('/api/gemini/generate-art', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', imageSize = '1K' } = req.body;
    const fullPrompt = `A premium cinematic athletic fitness photography for Bounce Fitness Studio in Chikmagalur: ${prompt}. Dark charcoal gym aesthetic, dramatic rim lighting, athletic discipline, modern iron dumbbells, barbell, motivational gym atmosphere.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
    });

    let imageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ success: false, error: 'No image data returned from model' });
    }

    res.json({
      success: true,
      imageUrl,
      resolution: imageSize,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Image generation failed',
    });
  }
});

// Vite middleware integration for dev, static serving for production
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Bounce Fitness Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
