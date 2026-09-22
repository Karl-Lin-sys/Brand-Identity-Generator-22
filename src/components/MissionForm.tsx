import React, { useState } from 'react';
import { Sparkles, ArrowRight, Layers, Sliders, Eye, Wand2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ImageSizeAffordance } from '../types';
import { MISSION_PRESETS, MissionPreset } from '../data/presets';

interface MissionFormProps {
  onGenerate: (data: {
    companyName: string;
    mission: string;
    industry: string;
    vibe: string;
    targetAudience: string;
    imageSize: ImageSizeAffordance;
  }) => void;
  isLoading: boolean;
  selectedSize: ImageSizeAffordance;
  onSizeChange: (size: ImageSizeAffordance) => void;
}

const INDUSTRIES = [
  'Technology & AI',
  'Sustainability & Eco',
  'Luxury & Lifestyle',
  'Health & BioTech',
  'FinTech & Venture',
  'Art & Architecture',
  'Food & Culinary',
  'Consumer Goods',
];

const VIBES = [
  'Modern Minimalist',
  'Bold & Disruptive',
  'Luxury & Heritage',
  'Organic & Earthy',
  'Playful & Kinetic',
  'Architectural & Precision',
];

export const MissionForm: React.FC<MissionFormProps> = ({
  onGenerate,
  isLoading,
  selectedSize,
  onSizeChange,
}) => {
  const [companyName, setCompanyName] = useState('Aura Dynamics');
  const [mission, setMission] = useState(
    'Empowering humanity to harmonize renewable energy infrastructure with architectural elegance, transforming cities into regenerative breathing ecosystems.'
  );
  const [industry, setIndustry] = useState('Sustainability & Eco');
  const [vibe, setVibe] = useState('Modern Minimalist');
  const [targetAudience, setTargetAudience] = useState(
    'Urban planners, progressive architects, and forward-thinking municipal developers.'
  );

  const applyPreset = (preset: MissionPreset) => {
    setCompanyName(preset.name);
    setMission(preset.mission);
    setIndustry(preset.industry);
    setVibe(preset.vibe);
    setTargetAudience(preset.targetAudience);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mission.trim()) return;
    onGenerate({
      companyName: companyName.trim() || 'Modern Enterprise',
      mission: mission.trim(),
      industry,
      vibe,
      targetAudience,
      imageSize: selectedSize,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Brand Bible & Visual Identity System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-sans">
          Translate Your Mission into a Definite Brand Identity
        </h1>
        <p className="mt-3 text-slate-600 text-base leading-relaxed">
          Describe your purpose. Generate a complete Brand Bible featuring a primary logo, secondary marks,
          a calibrated 5-color palette with usage rules, and live Google Font pairings.
        </p>
      </div>

      {/* Preset Inspiration Pills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Quick Sample Missions
          </span>
          <span className="text-xs text-slate-400">Click to autofill</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MISSION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-left p-2.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-800 group-hover:text-indigo-700 truncate">
                {preset.name}
              </div>
              <div className="text-slate-500 text-[11px] truncate mt-0.5">{preset.industry}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* Row 1: Company Name & Industry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Company / Brand Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Luminary Labs"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Industry Domain
            </label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Mission Statement */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="mission" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
              Company Mission & Core Purpose
            </label>
            <span className="text-[11px] text-slate-400">Be as descriptive or ambitious as you like</span>
          </div>
          <textarea
            id="mission"
            rows={4}
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            placeholder="Describe what your company does, who you serve, the core conviction behind your work, and how you change your customers' world..."
            className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900 leading-relaxed resize-y"
            required
          />
        </div>

        {/* Row 3: Aesthetic Vibe & Target Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vibe" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Aesthetic Direction / Vibe
            </label>
            <select
              id="vibe"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
            >
              {VIBES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
              Primary Audience
            </label>
            <input
              id="targetAudience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Modern developers, high-end consumers"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-900"
            />
          </div>
        </div>

        {/* Image Generation Configuration with Affordance for 1K, 2K, 4K */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Logo Rendering Engine
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Generates vector-style marks and badges. Specify desired resolution output:
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
              {(['1K', '2K', '4K'] as ImageSizeAffordance[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    selectedSize === size
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !mission.trim()}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-indigo-600 active:bg-indigo-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Brand Bible & Generating Marks...</span>
              </span>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
                <span>Generate Comprehensive Brand Bible</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Feature Highlights Guarantee */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-white border border-slate-100 text-slate-600 text-xs">
          <span className="font-semibold text-slate-900 block mb-1">Primary & Secondary Marks</span>
          Rendered at {selectedSize} resolution with clear-space rules and vector geometry.
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-100 text-slate-600 text-xs">
          <span className="font-semibold text-slate-900 block mb-1">5-Color Hex System</span>
          Calibrated 60-30-10 distribution, RGB formulas, and strict dos & don'ts.
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-100 text-slate-600 text-xs">
          <span className="font-semibold text-slate-900 block mb-1">Live Google Font Pairings</span>
          Expressive header & body hierarchy loaded dynamically into real DOM.
        </div>
      </div>
    </div>
  );
};
