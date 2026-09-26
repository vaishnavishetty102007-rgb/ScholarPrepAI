import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Set payload limit for document image uploads
app.use(express.json({ limit: '25mb' }));

// Shared Gemini client with telemetry header as required by skill guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface GenerateRequestBody {
  text?: string;
  image?: {
    mimeType: string;
    data: string; // base64 string without header
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

app.post('/api/study-aid/generate', async (req: Request<{}, {}, GenerateRequestBody>, res: Response) => {
  try {
    const { text, image, difficulty = 'medium' } = req.body;

    if (!text && !image) {
      return res.status(400).json({ error: 'Please provide either study notes text or upload an image.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please check the Secrets panel.',
      });
    }

    const difficultyInstruction = {
      easy: 'Difficulty: EASY. Focus on foundational recall, clear direct definitions, and straightforward concepts directly stated in the text.',
      medium: 'Difficulty: MEDIUM. Focus on conceptual comprehension, distinctions between related ideas, and standard analytical exam questions.',
      hard: 'Difficulty: HARD. Focus on higher-order synthesis, subtle nuances, potential edge cases, and rigorous distractors that test deep understanding.',
    }[difficulty] || 'Difficulty: MEDIUM';

    const systemInstruction = `You are an expert academic tutor and exam preparation assistant. Your goal is to transform raw study materials (text, notes, or uploaded document images) into an interactive, structured study aid.

Always adhere strictly to these constraints:
1. Create the questions and concepts from the uploaded material ONLY. Do not reference the internet or search for more information.
2. Do not hallucinate concepts. If the concept is not available in the material, do not include it in the final quiz.
3. Extract 3–5 core concepts. Explain each concept in 2–3 concise sentences using plain, easy-to-understand language.
4. Generate 3 distinct questions strictly on the source material:
   - Multiple Choice Question (MCQ): 4 options, mark the correct answer with a brief explanation.
   - Short Answer Question: Provide a sample high-scoring answer.
   - Conceptual Application Question: Ask how a key concept applies to a real-world scenario.
5. Flashcard Set: Generate between 5 and 10 flashcards (minimum 5, maximum 10) formatted with "front" (Term or Question) and "back" (Definition or Answer).
6. Target difficulty level: ${difficultyInstruction}
7. Token consumption must remain concise and well under 30K tokens.`;

    const contents: any[] = [];

    if (image && image.data && image.mimeType) {
      // Clean base64 data if it contains a data URL prefix
      const cleanBase64 = image.data.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: image.mimeType,
          data: cleanBase64,
        },
      });
    }

    let promptText = `Please parse the provided study material and generate the complete structured study aid for difficulty level "${difficulty.toUpperCase()}".\n\n`;
    if (text) {
      promptText += `STUDY MATERIAL TEXT:\n"""\n${text.slice(0, 50000)}\n"""\n\n`;
    }
    promptText += `Remember to strictly extract 3–5 key concepts with 2–3 sentence plain language explanations, 3 practice exam questions (1 MCQ with 4 options, 1 Short Answer with sample answer, 1 Conceptual Application with scenario and sample answer), and 5–10 flashcards with front/back based strictly on the material provided.`;

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: 'Clear, informative title for the study topic based strictly on material',
            },
            difficulty: {
              type: Type.STRING,
              description: 'The selected difficulty level (easy, medium, or hard)',
            },
            keyConcepts: {
              type: Type.ARRAY,
              description: '3 to 5 core concepts from the material with 2-3 concise sentences in plain language',
              items: {
                type: Type.OBJECT,
                properties: {
                  concept: { type: Type.STRING, description: 'Concept title or term' },
                  summary: {
                    type: Type.STRING,
                    description: '2 to 3 concise sentences explaining the concept in plain, easy-to-understand language',
                  },
                  keyTakeaway: {
                    type: Type.STRING,
                    description: 'One key takeaway or memory hook from the source material',
                  },
                },
                required: ['concept', 'summary'],
              },
            },
            practiceExam: {
              type: Type.OBJECT,
              description: '3 distinct questions based strictly on the source material',
              properties: {
                mcq: {
                  type: Type.OBJECT,
                  description: 'Multiple Choice Question with 4 options and marked correct answer with explanation',
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Exactly 4 distinct options',
                    },
                    correctAnswerIndex: {
                      type: Type.INTEGER,
                      description: '0-based index of correct option (0, 1, 2, or 3)',
                    },
                    explanation: {
                      type: Type.STRING,
                      description: 'Brief explanation of why the correct option is right based on material',
                    },
                  },
                  required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
                },
                shortAnswer: {
                  type: Type.OBJECT,
                  description: 'Short Answer Question with sample high-scoring answer',
                  properties: {
                    question: { type: Type.STRING },
                    sampleHighScoringAnswer: {
                      type: Type.STRING,
                      description: 'A sample high-scoring answer directly grounded in the material',
                    },
                    rubricPoints: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Core evaluation criteria or key points expected in a high-scoring answer',
                    },
                  },
                  required: ['question', 'sampleHighScoringAnswer'],
                },
                conceptualApplication: {
                  type: Type.OBJECT,
                  description: 'Conceptual Application Question showing how a concept applies to a real-world scenario',
                  properties: {
                    scenario: {
                      type: Type.STRING,
                      description: 'Real-world practical context or scenario strictly relevant to the concept',
                    },
                    question: {
                      type: Type.STRING,
                      description: 'Specific application question asking how the concept applies to this scenario',
                    },
                    sampleAnswer: {
                      type: Type.STRING,
                      description: 'Comprehensive sample answer explaining the application',
                    },
                  },
                  required: ['scenario', 'question', 'sampleAnswer'],
                },
              },
              required: ['mcq', 'shortAnswer', 'conceptualApplication'],
            },
            flashcards: {
              type: Type.ARRAY,
              description: 'Between 5 and 10 flashcards formatted with front and back',
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: 'Term or Question' },
                  back: { type: Type.STRING, description: 'Definition or Answer' },
                },
                required: ['front', 'back'],
              },
            },
          },
          required: ['title', 'keyConcepts', 'practiceExam', 'flashcards'],
        },
      },
    });

    const rawText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseErr) {
      // Fallback in case of markdown formatting
      const cleanJson = rawText.replace(/```(?:json)?/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    // Ensure flashcards length is between 5 and 10
    if (Array.isArray(parsedData.flashcards)) {
      if (parsedData.flashcards.length > 10) {
        parsedData.flashcards = parsedData.flashcards.slice(0, 10);
      }
    }

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating study aid:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process study material. Please try again.',
    });
  }
});

// Endpoint to self-evaluate student's short answer or application response
app.post('/api/study-aid/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, sampleAnswer, studentAnswer, rubricPoints } = req.body;

    if (!studentAnswer || !studentAnswer.trim()) {
      return res.status(400).json({ error: 'Please enter your answer to evaluate.' });
    }

    const evaluationResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are an encouraging academic exam grader. Compare the student's answer to the model answer strictly based on accuracy and concepts covered.
Question: "${question}"
Model High-Scoring Answer: "${sampleAnswer}"
${rubricPoints ? `Key Points: ${JSON.stringify(rubricPoints)}` : ''}
Student's Answer: "${studentAnswer}"

Provide concise grading feedback in JSON format.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoreEstimate: {
              type: Type.STRING,
              description: "e.g., 'Full Credit (100%)', 'Partial Credit (75%)', or 'Needs Work (50%)'",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'What the student explained well',
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'What key concepts or details were missed or could be sharpened',
            },
            tutorAdvice: {
              type: Type.STRING,
              description: '1-2 concise sentences of constructive coaching',
            },
          },
          required: ['scoreEstimate', 'strengths', 'areasToImprove', 'tutorAdvice'],
        },
      },
    });

    const parsed = JSON.parse(evaluationResponse.text || '{}');
    return res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    console.error('Error evaluating answer:', err);
    return res.status(500).json({ error: 'Failed to evaluate answer.' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ScholarPrep Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
