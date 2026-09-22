import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  Layout,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowLeft,
  Share2,
  FileCheck2,
  Quote,
  ShieldAlert,
} from 'lucide-react';
import { BrandBible, LogoMark, ImageSizeAffordance, FontSpec } from '../types';
import { LogoSection } from './LogoSection';
import { PaletteSection } from './PaletteSection';
import { TypographySection } from './TypographySection';
import { MockupSection } from './MockupSection';

interface BrandBibleViewProps {
  brandBible: BrandBible;
  onReset: () => void;
  onOpenChat: () => void;
  onRegenerateMark: (markId: string, prompt: string, size: ImageSizeAffordance, style: string) => Promise<void>;
  isRegeneratingMark: boolean;
  onUpdatePairing: (headerFont: FontSpec, bodyFont: FontSpec) => void;
}

type TabType = 'overview' | 'logos' | 'palette' | 'typography' | 'mockups' | 'rules';

export const BrandBibleView: React.FC<BrandBibleViewProps> = ({
  brandBible,
  onReset,
  onOpenChat,
  onRegenerateMark,
  isRegeneratingMark,
  onUpdatePairing,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const primaryHex = brandBible.colorPalette[0]?.hex || '#1D4ED8';
  const secondaryHex = brandBible.colorPalette[1]?.hex || '#06B6D4';
  const accentHex = brandBible.colorPalette[2]?.hex || '#F59E0B';

  const headerFontFamily = `"${brandBible.typography.headerFont.name}", sans-serif`;
  const bodyFontFamily = `"${brandBible.typography.bodyFont.name}", sans-serif`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Banner Navigation & Quick Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Mission Description</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Brand Bible Status:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>Complete Identity Suite</span>
          </span>
        </div>
      </div>

      {/* Brand Hero Executive Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: primaryHex }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>{brandBible.brandArchetype.name} Archetype</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
              style={{ fontFamily: headerFontFamily }}
            >
              {brandBible.companyName}
            </h1>

            <p
              className="text-lg sm:text-xl font-medium text-slate-700 tracking-tight"
              style={{ fontFamily: headerFontFamily }}
            >
              "{brandBible.tagline}"
            </p>

            <p
              className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl"
              style={{ fontFamily: bodyFontFamily }}
            >
              {brandBible.elevatorPitch}
            </p>

            {/* Voice Traits Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
                Tone of Voice:
              </span>
              {brandBible.brandVoice.map((voice, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {voice}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Mark Preview Stamp */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            <div className="w-48 h-48 rounded-2xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center shadow-xs">
              {brandBible.primaryLogo.imageUrl ? (
                <img
                  src={brandBible.primaryLogo.imageUrl}
                  alt={brandBible.companyName}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-xs text-slate-400">Primary Mark</div>
              )}
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-mono">
              Primary Seal • {brandBible.primaryLogo.imageSize || '1K'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation Navigation Bar */}
      <div className="border-b border-slate-200 sticky top-16 z-30 bg-white/95 backdrop-blur-md pt-2">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Foundation & Story', icon: Layers },
            { id: 'logos', label: 'Logo Suite (1K/2K/4K)', icon: Sparkles },
            { id: 'palette', label: '5-Color Hex System', icon: Palette },
            { id: 'typography', label: 'Google Font Pairings', icon: Type },
            { id: 'mockups', label: 'Live Mockups', icon: Layout },
            { id: 'rules', label: "Do's & Don'ts", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {/* Tab 1: Overview & Foundation */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mission & Purpose */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Quote className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-base">Core Purpose & Mission</h3>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed" style={{ fontFamily: bodyFontFamily }}>
                  {brandBible.mission}
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                  <strong className="text-slate-800 block mb-1">Strategic Foundation:</strong>
                  Every design artifact in this Brand Bible directly translates this purpose into visible visual vocabulary.
                </div>
              </div>

              {/* Brand Archetype & Story */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Layers className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 text-base">Archetype: {brandBible.brandArchetype.name}</h3>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {brandBible.brandArchetype.description}
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Narrative Narrative Backbone:
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed italic">
                    "{brandBible.brandStory}"
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Quick Links to Specific Sections */}
            <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-indigo-950 text-sm">Need creative counsel or positioning refinement?</h4>
                <p className="text-xs text-indigo-800/80 mt-0.5">
                  Engage our Gemini Brand Strategist chatbot to critique color contrast, test taglines, or explore trademark boundaries.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenChat}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Creative Director Chat</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Logo Suite */}
        {activeTab === 'logos' && (
          <div className="animate-fade-in">
            <LogoSection
              brandBible={brandBible}
              onRegenerateMark={onRegenerateMark}
              isRegenerating={isRegeneratingMark}
            />
          </div>
        )}

        {/* Tab 3: Color Palette */}
        {activeTab === 'palette' && (
          <div className="animate-fade-in">
            <PaletteSection palette={brandBible.colorPalette} />
          </div>
        )}

        {/* Tab 4: Typography System */}
        {activeTab === 'typography' && (
          <div className="animate-fade-in">
            <TypographySection
              typography={brandBible.typography}
              onUpdatePairing={onUpdatePairing}
            />
          </div>
        )}

        {/* Tab 5: Live Mockups */}
        {activeTab === 'mockups' && (
          <div className="animate-fade-in">
            <MockupSection brandBible={brandBible} />
          </div>
        )}

        {/* Tab 6: Dos and Don'ts */}
        {activeTab === 'rules' && (
          <div className="space-y-8 animate-fade-in">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Brand Governance & Identity Rules
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Strict guardrails to protect brand equity, consistency, and visual integrity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO's */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">Mandatory Standards (Do's)</h3>
                </div>
                <ul className="space-y-3">
                  {brandBible.dosAndDonts.dos.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DONT's */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-slate-900 text-base">Strict Prohibitions (Don'ts)</h3>
                </div>
                <ul className="space-y-3">
                  {brandBible.dosAndDonts.donts.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✕
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
