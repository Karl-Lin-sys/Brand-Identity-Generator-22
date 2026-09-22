import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '15mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' });
  });

  // 1. Generate Complete Brand Bible Structured Blueprint
  app.post('/api/brand/generate', async (req, res) => {
    try {
      const { companyName, mission, industry, vibe, targetAudience, imageSize = '1K' } = req.body;

      if (!mission || !mission.trim()) {
        return res.status(400).json({ error: 'Company mission is required' });
      }

      const client = getGeminiClient();

      if (!client) {
        // Return rich curated fallback brand identity if no API key is configured yet
        const fallback = generateCuratedBrandBible({ companyName, mission, industry, vibe, targetAudience, imageSize });
        return res.json({ brandBible: fallback, source: 'curated-template' });
      }

      const systemPrompt = `You are an elite Brand Strategist and Creative Director at a world-class design studio (like Pentagram or Collins).
Analyze the company name and mission, and generate a comprehensive, highly cohesive "Brand Bible" data structure.
Ensure the color palette has EXACTLY 5 high-contrast, harmonious colors:
1. Primary (dominant brand identifier)
2. Secondary (complementary supporting tone)
3. Accent (high-energy focal color for CTAs and highlights)
4. Neutral Light (clean, warm or cool background white/tint)
5. Neutral Dark (deep, rich text and boundary charcoal/navy/ink)

Every color must have strict, practical usage notes (what it is for, when NOT to use it).
Google font pairings must feature one expressive Header font and one highly legible, modern Body font readily available on Google Fonts (e.g., Space Grotesk, Syne, Playfair Display, Cinzel, Plus Jakarta Sans, Outfit, DM Sans, Lora, Work Sans).
Provide detailed logo generation prompts suitable for modern minimalist, vector, and editorial visual marks.`;

      const userPrompt = `Company Name: "${companyName || 'Apex Technologies'}"
Mission Description: "${mission}"
Industry/Category: "${industry || 'Technology & Lifestyle'}"
Aesthetic / Vibe: "${vibe || 'Modern, Sophisticated, High-Craft'}"
Target Audience: "${targetAudience || 'Modern professionals and forward-thinking enterprises'}"

Generate the complete structured Brand Bible JSON following the schema.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              elevatorPitch: { type: Type.STRING },
              brandStory: { type: Type.STRING },
              brandArchetype: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['name', 'description'],
              },
              brandVoice: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                    role: { type: Type.STRING },
                    usage: { type: Type.STRING },
                    rgb: { type: Type.STRING },
                    textColorRecommendation: { type: Type.STRING },
                  },
                  required: ['name', 'hex', 'role', 'usage', 'rgb', 'textColorRecommendation'],
                },
              },
              typography: {
                type: Type.OBJECT,
                properties: {
                  headerFont: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      weights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      reason: { type: Type.STRING },
                    },
                    required: ['name', 'category', 'weights', 'reason'],
                  },
                  bodyFont: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      weights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      reason: { type: Type.STRING },
                    },
                    required: ['name', 'category', 'weights', 'reason'],
                  },
                  hierarchyScale: {
                    type: Type.OBJECT,
                    properties: {
                      h1: { type: Type.STRING },
                      h2: { type: Type.STRING },
                      h3: { type: Type.STRING },
                      body: { type: Type.STRING },
                      caption: { type: Type.STRING },
                    },
                    required: ['h1', 'h2', 'h3', 'body', 'caption'],
                  },
                  sampleHeading: { type: Type.STRING },
                  sampleBody: { type: Type.STRING },
                },
                required: ['headerFont', 'bodyFont', 'hierarchyScale', 'sampleHeading', 'sampleBody'],
              },
              primaryLogo: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  prompt: { type: Type.STRING },
                  style: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  clearSpaceRule: { type: Type.STRING },
                  minSize: { type: Type.STRING },
                },
                required: ['title', 'prompt', 'style', 'rationale', 'clearSpaceRule', 'minSize'],
              },
              secondaryMarks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING },
                    prompt: { type: Type.STRING },
                    style: { type: Type.STRING },
                    rationale: { type: Type.STRING },
                    usageContext: { type: Type.STRING },
                  },
                  required: ['title', 'type', 'prompt', 'style', 'rationale', 'usageContext'],
                },
              },
              dosAndDonts: {
                type: Type.OBJECT,
                properties: {
                  dos: { type: Type.ARRAY, items: { type: Type.STRING } },
                  donts: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['dos', 'donts'],
              },
            },
            required: [
              'companyName',
              'tagline',
              'elevatorPitch',
              'brandStory',
              'brandArchetype',
              'brandVoice',
              'colorPalette',
              'typography',
              'primaryLogo',
              'secondaryMarks',
              'dosAndDonts',
            ],
          },
        },
      });

      const parsedData = JSON.parse(response.text || '{}');

      // Map into structured BrandBible
      const brandBible = {
        id: 'bb-' + Date.now(),
        companyName: parsedData.companyName || companyName || 'Company',
        mission,
        tagline: parsedData.tagline || 'Crafted with intent and vision',
        elevatorPitch: parsedData.elevatorPitch || '',
        brandArchetype: parsedData.brandArchetype || { name: 'The Creator', description: 'Inventive, expressive and daring.' },
        brandVoice: parsedData.brandVoice || ['Authoritative', 'Clarity-driven', 'Modern'],
        colorPalette: (parsedData.colorPalette || []).slice(0, 5),
        typography: parsedData.typography,
        primaryLogo: {
          id: 'mark-primary',
          title: parsedData.primaryLogo?.title || 'Primary Brand Mark',
          type: 'primary' as const,
          prompt: parsedData.primaryLogo?.prompt || `Minimalist modern vector logo symbol for ${companyName}, clean geometry, vector emblem on clean isolated background`,
          style: parsedData.primaryLogo?.style || 'Vector Geometric Minimalist',
          rationale: parsedData.primaryLogo?.rationale || 'Core visual mark anchoring all formal brand collateral.',
          clearSpaceRule: parsedData.primaryLogo?.clearSpaceRule || 'Maintain clear space equal to 1.5x the height of the inner glyph.',
          minSize: parsedData.primaryLogo?.minSize || '32px digital / 12mm print',
          imageSize: imageSize as ('1K' | '2K' | '4K'),
          aspectRatio: '1:1' as const,
        },
        secondaryMarks: (parsedData.secondaryMarks || []).map((m: any, idx: number) => ({
          id: `mark-sec-${idx + 1}`,
          title: m.title || `Secondary Mark ${idx + 1}`,
          type: (m.type || 'monogram') as any,
          prompt: m.prompt || `Secondary monogram badge emblem mark for ${companyName}, minimalist clean design`,
          style: m.style || 'Sub-mark / Iconographic',
          rationale: m.rationale || 'Specialized mark for condensed or responsive applications.',
          usageContext: m.usageContext || 'Favicons, app icons, and social media stamps.',
          imageSize: imageSize as ('1K' | '2K' | '4K'),
          aspectRatio: '1:1' as const,
        })),
        dosAndDonts: parsedData.dosAndDonts || {
          dos: ['Keep sufficient clear space', 'Use consistent typography weights'],
          donts: ['Never distort or rotate the logo mark', 'Never apply drop shadows or glow filters'],
        },
        brandStory: parsedData.brandStory || mission,
        createdAt: new Date().toISOString(),
      };

      res.json({ brandBible, source: 'gemini' });
    } catch (error: any) {
      console.error('Brand Bible Generation error:', error);
      // If error occurs, fallback gracefully to structured brand Bible so user is never blocked
      const fallback = generateCuratedBrandBible({
        companyName: req.body.companyName,
        mission: req.body.mission,
        industry: req.body.industry,
        vibe: req.body.vibe,
        targetAudience: req.body.targetAudience,
        imageSize: req.body.imageSize || '1K',
      });
      res.json({ brandBible: fallback, source: 'fallback', errorMsg: error.message });
    }
  });

  // 2. Generate High-Quality Logo Image with gemini-3-pro-image-preview & Image Size Affordance (1K, 2K, 4K)
  app.post('/api/brand/generate-logo', async (req, res) => {
    try {
      const {
        prompt,
        imageSize = '1K',
        aspectRatio = '1:1',
        style = 'Minimalist vector logo emblem',
        companyName = 'Brand',
        markType = 'primary',
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const client = getGeminiClient();
      if (!client) {
        // Return a high-aesthetic procedural SVG / canvas data URL preview when key is not yet set
        const svgFallback = generateProceduralBrandMark(companyName, markType, style);
        return res.json({
          imageUrl: svgFallback,
          source: 'procedural-preview',
          imageSize,
          aspectRatio,
          notice: 'Connect your Gemini API Key in Settings > Secrets to generate using gemini-3-pro-image-preview.',
        });
      }

      // Format rich prompt for logo design excellence
      const enhancedPrompt = `A professional, world-class brand identity graphic logo design. 
Subject: ${prompt}.
Style: ${style}, graphic design vector emblem, clean lines, solid shapes, isolated against a crisp solid white background.
Negative space precision, mathematically balanced proportions, no blurry artifacts, no photorealistic noise, pristine corporate identity craft.
Aspect ratio: ${aspectRatio}. High-resolution clarity.`;

      // Model: gemini-3-pro-image-preview as required by prompt
      const targetSize = ['1K', '2K', '4K'].includes(imageSize) ? imageSize : '1K';

      let response;
      try {
        response = await client.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: targetSize as any,
            },
          },
        });
      } catch (primaryModelErr: any) {
        console.warn('gemini-3-pro-image-preview attempt failed, trying gemini-3.1-flash-image fallback:', primaryModelErr.message);
        // Fallback to gemini-3.1-flash-image or gemini-3-pro-image
        response = await client.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [{ text: enhancedPrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
              imageSize: targetSize as any,
            },
          },
        });
      }

      let generatedImageUrl: string | null = null;
      let textFeedback: string | null = null;

      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          } else if (part.text) {
            textFeedback = part.text;
          }
        }
      }

      if (!generatedImageUrl) {
        // If the model produced only text, create procedural vector fallback
        const svgFallback = generateProceduralBrandMark(companyName, markType, style);
        return res.json({
          imageUrl: svgFallback,
          source: 'procedural-fallback',
          imageSize: targetSize,
          feedback: textFeedback,
        });
      }

      res.json({
        imageUrl: generatedImageUrl,
        source: 'gemini-3-pro-image-preview',
        imageSize: targetSize,
        aspectRatio,
        prompt: enhancedPrompt,
      });
    } catch (error: any) {
      console.error('Logo Generation error:', error);
      const svgFallback = generateProceduralBrandMark(req.body.companyName || 'Brand', req.body.markType || 'primary', req.body.style || 'Vector');
      res.json({
        imageUrl: svgFallback,
        source: 'procedural-error-fallback',
        errorMsg: error.message,
        imageSize: req.body.imageSize || '1K',
      });
    }
  });

  // 3. Multi-turn Chat interface with Gemini
  // Model selection:
  // - gemini-3.1-pro-preview for complex tasks
  // - gemini-3.5-flash for general tasks
  // - gemini-3.1-flash-lite for tasks that should happen fast
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, modelChoice = 'gemini-3.5-flash', taskType = 'general', brandContext } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Determine model based on explicit modelChoice or taskType
      let model = modelChoice;
      if (taskType === 'complex') {
        model = 'gemini-3.1-pro-preview';
      } else if (taskType === 'fast') {
        model = 'gemini-3.1-flash-lite';
      } else if (taskType === 'general' && !modelChoice) {
        model = 'gemini-3.5-flash';
      }

      const client = getGeminiClient();
      if (!client) {
        // Friendly offline advice
        return res.json({
          role: 'model',
          text: `As your Brand Strategist, I recommend auditing the visual hierarchy and contrast ratio of your palette. When applying your primary mark, ensure adequate negative space and test readability across 16px to 512px viewports. (Tip: Configure your GEMINI_API_KEY to activate live reasoning with ${model}!)`,
          modelUsed: model,
        });
      }

      let systemInstruction = `You are an elite Brand Strategist and Creative Director at a world-class brand agency.
Your role:
- Critically review and elevate brand missions, vision, positioning, and taglines.
- Advise on color psychology, accessibility (WCAG AA/AAA compliance), and palette 60-30-10 distribution rules.
- Evaluate typography pairings: optical sizes, x-height balance, kerning, and hierarchy.
- Critique logo concepts, monograms, secondary marks, and packaging guidelines.
- Advise on market distinctiveness and trademark viability.
Always deliver concise, structured, actionable advice with sophisticated design vocabulary.`;

      if (brandContext) {
        systemInstruction += `\n\nActive Brand Context:
- Company Name: ${brandContext.companyName}
- Mission: ${brandContext.mission}
- Tagline: ${brandContext.tagline}
- Brand Voice: ${brandContext.brandVoice ? brandContext.brandVoice.join(', ') : 'Modern, Refined'}
- Primary Colors: ${brandContext.colorPalette ? brandContext.colorPalette.map((c: any) => `${c.name} (${c.hex}) - ${c.role}`).join(', ') : ''}
- Header Font: ${brandContext.typography?.headerFont?.name || 'Playfair Display'}
- Body Font: ${brandContext.typography?.bodyFont?.name || 'Plus Jakarta Sans'}`;
      }

      // Convert messages to Gemini format
      const formattedContents = messages.map((m: any) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const response = await client.models.generateContent({
        model,
        contents: formattedContents,
        config: {
          systemInstruction,
        },
      });

      res.json({
        role: 'model',
        text: response.text || 'I have analyzed your brand parameters. Let me know if you would like deeper guidelines on typography scale or color accessibility.',
        modelUsed: model,
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        error: error.message || 'Failed to process chat message',
        fallbackText: 'I experienced a connection hiccup while analyzing your brand query. Please verify your connection or try another model tier.',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Identity Generator server running on http://0.0.0.0:${PORT}`);
  });
}

// Procedural vector generator for instant previews or fallback
function generateProceduralBrandMark(name: string, type: string, style: string): string {
  const initials = (name || 'Brand')
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('') || 'BI';

  const hash = (name || 'brand').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hue = hash % 360;
  const secondaryHue = (hue + 45) % 360;

  let innerContent = '';
  if (type === 'monogram') {
    innerContent = `
      <rect width="600" height="600" rx="300" fill="hsl(${hue}, 70%, 15%)" />
      <circle cx="300" cy="300" r="240" fill="none" stroke="hsl(${hue}, 80%, 65%)" stroke-width="8" stroke-dasharray="12 12" />
      <text x="300" y="360" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="160" fill="#ffffff" text-anchor="middle" letter-spacing="4">${initials}</text>
    `;
  } else if (type === 'badge') {
    innerContent = `
      <rect width="600" height="600" rx="40" fill="hsl(${hue}, 65%, 12%)" />
      <polygon points="300,100 480,200 480,400 300,500 120,400 120,200" fill="none" stroke="hsl(${secondaryHue}, 90%, 60%)" stroke-width="12" />
      <circle cx="300" cy="300" r="110" fill="hsl(${hue}, 80%, 55%)" />
      <text x="300" y="325" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="80" fill="#ffffff" text-anchor="middle">${initials}</text>
      <text x="300" y="440" font-family="Space Grotesk, sans-serif" font-weight="600" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="8">EST. 2026</text>
    `;
  } else {
    // Primary mark
    innerContent = `
      <rect width="600" height="600" rx="60" fill="hsl(${hue}, 60%, 8%)" />
      <g transform="translate(150, 130)">
        <path d="M150 0 L300 260 L0 260 Z" fill="hsl(${hue}, 85%, 58%)" opacity="0.9" />
        <path d="M150 70 L250 240 L50 240 Z" fill="hsl(${secondaryHue}, 95%, 68%)" />
        <circle cx="150" cy="180" r="45" fill="#ffffff" />
      </g>
      <text x="300" y="475" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="38" fill="#ffffff" text-anchor="middle" letter-spacing="3">${name.toUpperCase()}</text>
      <text x="300" y="520" font-family="Space Grotesk, sans-serif" font-weight="400" font-size="18" fill="hsl(${hue}, 40%, 75%)" text-anchor="middle" letter-spacing="6">BRAND IDENTITY MARK</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
    ${innerContent}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Curated template generator when Gemini key is waiting or offline
function generateCuratedBrandBible(params: {
  companyName?: string;
  mission: string;
  industry?: string;
  vibe?: string;
  targetAudience?: string;
  imageSize?: string;
}) {
  const company = params.companyName?.trim() || 'Aura Dynamics';
  const size = (params.imageSize || '1K') as '1K' | '2K' | '4K';

  // Choose palette based on mission keywords
  const isEco = /nature|eco|green|clean|earth|health|sustain/i.test(params.mission);
  const isTech = /ai|software|tech|data|crypto|code|cloud|robot/i.test(params.mission);
  const isLuxury = /luxury|fashion|exclusive|premium|beauty|craft|art/i.test(params.mission);

  let colorPalette = [
    {
      name: 'Cobalt Prime',
      hex: '#1D4ED8',
      role: 'Primary',
      usage: 'Dominant identity color (60% weight). Primary logos, hero banners, and primary CTA buttons.',
      rgb: 'rgb(29, 78, 216)',
      textColorRecommendation: '#ffffff',
    },
    {
      name: 'Electric Cyan',
      hex: '#06B6D4',
      role: 'Secondary',
      usage: 'Supporting visual accent (30% weight). Secondary badges, highlights, charts, and interactive focus states.',
      rgb: 'rgb(6, 182, 212)',
      textColorRecommendation: '#111827',
    },
    {
      name: 'Amber Glow',
      hex: '#F59E0B',
      role: 'Accent',
      usage: 'High-contrast focal point (10% weight). Notification badges, success states, and micro-interactions. Use sparingly.',
      rgb: 'rgb(245, 158, 11)',
      textColorRecommendation: '#111827',
    },
    {
      name: 'Snow Drift',
      hex: '#F8FAFC',
      role: 'Neutral Light',
      usage: 'Background canvas, card surface baseline, and generous negative space framing.',
      rgb: 'rgb(248, 250, 252)',
      textColorRecommendation: '#111827',
    },
    {
      name: 'Obsidian Slate',
      hex: '#0F172A',
      role: 'Neutral Dark',
      usage: 'Primary body typography, header titles, deep contrasting borders, and high-impact dark mode elements.',
      rgb: 'rgb(15, 23, 42)',
      textColorRecommendation: '#ffffff',
    },
  ];

  let headerFont = {
    name: 'Space Grotesk',
    category: 'Display',
    weights: ['500', '700'],
    reason: 'Geometric proportions with engineered distinctiveness communicate forward-thinking innovation and structural clarity.',
  };
  let bodyFont = {
    name: 'Plus Jakarta Sans',
    category: 'Sans-Serif',
    weights: ['400', '500', '600'],
    reason: 'High x-height and open apertures deliver effortless readability across both dense data UI and editorial paragraphs.',
  };

  if (isEco) {
    colorPalette = [
      {
        name: 'Forest Emerald',
        hex: '#047857',
        role: 'Primary',
        usage: 'Dominant identity color. Main wordmark, sustainable packaging, and signature elements.',
        rgb: 'rgb(4, 120, 87)',
        textColorRecommendation: '#ffffff',
      },
      {
        name: 'Sage Meadow',
        hex: '#6EE7B7',
        role: 'Secondary',
        usage: 'Supporting wash, pill badges, and environmental infographics.',
        rgb: 'rgb(110, 231, 183)',
        textColorRecommendation: '#111827',
      },
      {
        name: 'Sunlight Ochre',
        hex: '#D97706',
        role: 'Accent',
        usage: 'Focal warmth for urgent alerts, conversion points, and secondary emblems.',
        rgb: 'rgb(217, 119, 6)',
        textColorRecommendation: '#ffffff',
      },
      {
        name: 'Linen Parchment',
        hex: '#FBFBFA',
        role: 'Neutral Light',
        usage: 'Organic canvas background for organic tactile warmth.',
        rgb: 'rgb(251, 251, 250)',
        textColorRecommendation: '#111827',
      },
      {
        name: 'Deep Spruce',
        hex: '#06281D',
        role: 'Neutral Dark',
        usage: 'Editorial headers, long-form reading typography, and solid grounding containers.',
        rgb: 'rgb(6, 40, 29)',
        textColorRecommendation: '#ffffff',
      },
    ];
    headerFont = {
      name: 'Syne',
      category: 'Display',
      weights: ['600', '700', '800'],
      reason: 'Organic curved architecture conveys human-scale vitality and modern eco-luxury.',
    };
    bodyFont = {
      name: 'DM Sans',
      category: 'Sans-Serif',
      weights: ['400', '500', '700'],
      reason: 'Low-contrast geometric cleanliness ensures calm, approachable communication.',
    };
  } else if (isLuxury) {
    colorPalette = [
      {
        name: 'Regal Onyx',
        hex: '#18181B',
        role: 'Primary',
        usage: 'High-status anchor. Embossed marks, luxury packaging, and bold editorial headers.',
        rgb: 'rgb(24, 24, 27)',
        textColorRecommendation: '#ffffff',
      },
      {
        name: 'Champagne Gilt',
        hex: '#D4AF37',
        role: 'Secondary',
        usage: 'Subtle metallic sheen, badge borders, foil accents, and premium callouts.',
        rgb: 'rgb(212, 175, 55)',
        textColorRecommendation: '#111827',
      },
      {
        name: 'Burgundy Velvet',
        hex: '#881337',
        role: 'Accent',
        usage: 'Selective luxury accent for VIP tags, signature stamps, and seasonal highlights.',
        rgb: 'rgb(136, 19, 55)',
        textColorRecommendation: '#ffffff',
      },
      {
        name: 'Alabaster Silk',
        hex: '#FAFAF9',
        role: 'Neutral Light',
        usage: 'Clean gallery canvas with spacious white margins and luxury breathability.',
        rgb: 'rgb(250, 250, 249)',
        textColorRecommendation: '#111827',
      },
      {
        name: 'Midnight Ink',
        hex: '#09090B',
        role: 'Neutral Dark',
        usage: 'Sharp serifs, editorial bodies, and high-contrast bounding lines.',
        rgb: 'rgb(9, 9, 11)',
        textColorRecommendation: '#ffffff',
      },
    ];
    headerFont = {
      name: 'Playfair Display',
      category: 'Serif',
      weights: ['500', '700'],
      reason: 'Exquisite editorial contrast with sharp serifs that evoke heritage, distinction, and grace.',
    };
    bodyFont = {
      name: 'Outfit',
      category: 'Sans-Serif',
      weights: ['400', '500'],
      reason: 'Contemporary balance prevents the layout from feeling archaic, adding modern ease.',
    };
  }

  const primaryMarkSvg = generateProceduralBrandMark(company, 'primary', 'Geometric Minimalist');
  const monogramMarkSvg = generateProceduralBrandMark(company, 'monogram', 'Monogram Glyph');
  const badgeMarkSvg = generateProceduralBrandMark(company, 'badge', 'Heritage Seal');

  return {
    id: 'bb-curated-' + Date.now(),
    companyName: company,
    mission: params.mission,
    tagline: 'Precision craft for an evolving world',
    elevatorPitch: `${company} transforms ${params.industry || 'the landscape'} through a steadfast commitment to purposeful design, architectural integrity, and transformative user experiences.`,
    brandArchetype: {
      name: isLuxury ? 'The Sovereign' : isEco ? 'The Caregiver / Explorer' : 'The Visionary Creator',
      description: 'Dedicated to setting gold standards, fostering deep trust, and illuminating innovative paths forward.',
    },
    brandVoice: [
      'Poised & Deliberate: We communicate with purposeful conviction and zero fluff.',
      'Empathetic & Human: Technology and craftsmanship serve human flourishing.',
      'Forward-Looking: We craft for long-term relevance rather than ephemeral trends.',
    ],
    colorPalette,
    typography: {
      headerFont,
      bodyFont,
      hierarchyScale: {
        h1: '48px / 1.1 line-height (Tight, commanding display)',
        h2: '32px / 1.25 line-height (Section milestones)',
        h3: '22px / 1.35 line-height (Component headers)',
        body: '16px / 1.6 line-height (Generous reading baseline)',
        caption: '13px / 1.4 line-height (Metadata and labeling)',
      },
      sampleHeading: `Empowering Purpose Through Deliberate Identity`,
      sampleBody: `${company} was established on a radical belief: when vision is paired with unyielding craftsmanship, meaningful change is inevitable. Every touchpoint, from the primary seal to our functional palettes, honors that dedication.`,
    },
    primaryLogo: {
      id: 'mark-primary',
      title: 'Primary Identity Mark',
      type: 'primary' as const,
      prompt: `Minimalist modern vector logo symbol for ${company}, balanced geometry, isolated against pure white background, crisp vector silhouette, professional brand mark`,
      style: 'Minimalist Vector Emblem',
      rationale: 'Serves as the primary anchor for all flagship communications, site headers, and formal stationery.',
      clearSpaceRule: 'Maintain an exclusion zone of at least 1.5x the width of the central glyph around all perimeter edges.',
      minSize: '32px digital / 10mm print',
      imageUrl: primaryMarkSvg,
      imageSize: size,
      aspectRatio: '1:1' as const,
    },
    secondaryMarks: [
      {
        id: 'mark-sec-1',
        title: 'Monogram Stamp',
        type: 'monogram' as const,
        prompt: `Monogram icon mark for ${company}, clean geometric lettermark emblem, pure white background, vector icon`,
        style: 'Modern Lettermark Stamp',
        rationale: 'Condensed mark engineered for high-density environments like browser favicons, mobile app icons, and social avatars.',
        usageContext: 'Favicons, 16px to 64px constraints, and discreet hardware debossing.',
        imageUrl: monogramMarkSvg,
        imageSize: size,
        aspectRatio: '1:1' as const,
      },
      {
        id: 'mark-sec-2',
        title: 'Heritage Seal & Badge',
        type: 'badge' as const,
        prompt: `Heritage seal badge emblem for ${company}, circular geometric framing with est 2026, crisp modern vector`,
        style: 'Geometric Seal Badge',
        rationale: 'Expressive secondary mark used for certification badges, packaging tape, physical merchandise, and investor collateral.',
        usageContext: 'Packaging, physical merchandise, event signage, and formal certificates.',
        imageUrl: badgeMarkSvg,
        imageSize: size,
        aspectRatio: '1:1' as const,
      },
    ],
    dosAndDonts: {
      dos: [
        'Always preserve the minimum clear space around all primary and secondary marks.',
        'Use the designated 60-30-10 color distribution to maintain visual hierarchy.',
        'Pair the display header font exclusively with the prescribed body typography.',
        'Ensure WCAG AA contrast (minimum 4.5:1) for all typography placed over color containers.',
      ],
      donts: [
        'Never skew, condense, or rotate the logo geometry.',
        'Never apply bevels, 3D extrusions, or artificial drop shadows to vector marks.',
        'Never place low-contrast body copy over the Accent or Secondary background shades.',
        'Never substitute random unapproved system fonts in brand documentation.',
      ],
    },
    brandStory: `Built to bring clarity to complex modern problems, ${company} combines aesthetic discipline with relentless utility. Our brand identity reflects this duality: bold enough to stand out, disciplined enough to stand the test of time.`,
    createdAt: new Date().toISOString(),
  };
}

startServer();
