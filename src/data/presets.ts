export interface MissionPreset {
  id: string;
  name: string;
  industry: string;
  vibe: string;
  mission: string;
  targetAudience: string;
}

export const MISSION_PRESETS: MissionPreset[] = [
  {
    id: 'eco-roast',
    name: 'Verdant Roast',
    industry: 'Food & Sustainability',
    vibe: 'Organic & Earthy',
    mission: 'Pioneering zero-waste regenerative coffee sourcing by partnering directly with shade-grown biodiverse farms and using 100% compostable mycelium packaging.',
    targetAudience: 'Conscious urban consumers, specialty coffee enthusiasts, and zero-waste advocates.',
  },
  {
    id: 'pulse-ai',
    name: 'Synapse Core',
    industry: 'Technology & AI',
    vibe: 'Cyber Tech & Minimalist',
    mission: 'Democratizing distributed neural infrastructure by providing autonomous, zero-latency inference engines for privacy-first edge computing.',
    targetAudience: 'DevOps engineers, systems architects, and enterprise AI innovators.',
  },
  {
    id: 'solis-atelier',
    name: 'Solis Atelier',
    industry: 'Luxury & Heritage',
    vibe: 'Luxury & Heritage',
    mission: 'Reimagining timeless Mediterranean architectural ceramics through hand-thrown techniques, natural mineral glazes, and heirloom durability.',
    targetAudience: 'Interior designers, high-end residential collectors, and architectural enthusiasts.',
  },
  {
    id: 'stride-health',
    name: 'Stride Labs',
    industry: 'Health & Wellness',
    vibe: 'Bold & Disruptive',
    mission: 'Empowering everyday athletes with continuous metabolic biomechanics and adaptive recovery protocols tailored to individual cellular circadian rhythms.',
    targetAudience: 'Marathoners, endurance athletes, and functional wellness practitioners.',
  },
];
