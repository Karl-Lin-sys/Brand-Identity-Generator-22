export type ImageSizeAffordance = '1K' | '2K' | '4K';

export interface BrandColor {
  name: string;
  hex: string;
  role: 'Primary' | 'Secondary' | 'Accent' | 'Neutral Light' | 'Neutral Dark';
  usage: string;
  rgb: string;
  textColorRecommendation: '#ffffff' | '#111827';
}

export interface FontSpec {
  name: string;
  category: 'Serif' | 'Sans-Serif' | 'Display' | 'Monospace';
  weights: string[];
  reason: string;
}

export interface TypographySystem {
  headerFont: FontSpec;
  bodyFont: FontSpec;
  hierarchyScale: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
    caption: string;
  };
  sampleHeading: string;
  sampleBody: string;
}

export interface LogoMark {
  id: string;
  title: string;
  type: 'primary' | 'monogram' | 'badge' | 'social';
  prompt: string;
  style: string;
  rationale: string;
  imageUrl?: string;
  isGenerating?: boolean;
  imageSize: ImageSizeAffordance;
  aspectRatio: '1:1' | '4:3' | '16:9';
  clearSpaceRule?: string;
  minSize?: string;
  usageContext?: string;
}

export interface BrandBible {
  id: string;
  companyName: string;
  mission: string;
  tagline: string;
  elevatorPitch: string;
  brandArchetype: {
    name: string;
    description: string;
  };
  brandVoice: string[];
  colorPalette: BrandColor[];
  typography: TypographySystem;
  primaryLogo: LogoMark;
  secondaryMarks: LogoMark[];
  dosAndDonts: {
    dos: string[];
    donts: string[];
  };
  brandStory: string;
  createdAt: string;
}

export type ChatModel = 'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: ChatModel;
}
