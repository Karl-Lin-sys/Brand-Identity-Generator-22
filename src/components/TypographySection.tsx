import React, { useEffect, useState } from 'react';
import { Type, Sparkles, ExternalLink, RefreshCw, Check } from 'lucide-react';
import { TypographySystem, FontSpec } from '../types';
import { loadGoogleFont } from '../utils/fontLoader';

interface TypographySectionProps {
  typography: TypographySystem;
  onUpdatePairing?: (headerFont: FontSpec, bodyFont: FontSpec) => void;
}

const POPULAR_PAIRINGS = [
  {
    name: 'Modern Editorial',
    header: { name: 'Playfair Display', category: 'Serif' as const, weights: ['600', '700'], reason: 'Sophisticated contrast with poetic editorial grace.' },
    body: { name: 'Plus Jakarta Sans', category: 'Sans-Serif' as const, weights: ['400', '500'], reason: 'Open apertures and high x-height for optimal digital ergonomics.' },
  },
  {
    name: 'Engineered Precision',
    header: { name: 'Space Grotesk', category: 'Display' as const, weights: ['500', '700'], reason: 'Mechanical character forms with tech-forward distinctiveness.' },
    body: { name: 'Inter', category: 'Sans-Serif' as const, weights: ['400', '500'], reason: 'Hyper-legible interface workhorse optimized for screens.' },
  },
  {
    name: 'Kinetic Avant-Garde',
    header: { name: 'Syne', category: 'Display' as const, weights: ['700', '800'], reason: 'Sculptural, wide proportions evoking creative confidence.' },
    body: { name: 'DM Sans', category: 'Sans-Serif' as const, weights: ['400', '500'], reason: 'Geometric calmness that lets the expressive header breathe.' },
  },
  {
    name: 'Quiet Luxury',
    header: { name: 'Cinzel', category: 'Serif' as const, weights: ['500', '700'], reason: 'Classical Roman inscriptional proportions that denote timeless prestige.' },
    body: { name: 'Outfit', category: 'Sans-Serif' as const, weights: ['400', '500'], reason: 'Contemporary geometric smoothness creating balanced juxtaposition.' },
  },
];

export const TypographySection: React.FC<TypographySectionProps> = ({
  typography,
  onUpdatePairing,
}) => {
  const [testHeading, setTestHeading] = useState(
    typography.sampleHeading || 'Architecting Purpose Through Deliberate Form'
  );
  const [testBody, setTestBody] = useState(
    typography.sampleBody ||
      'Great brand identities do not simply catch the eye—they organize reality for the audience, establishing trust before a single word is read.'
  );

  // Load Google Fonts into the DOM
  useEffect(() => {
    if (typography.headerFont?.name) {
      loadGoogleFont(typography.headerFont.name);
    }
    if (typography.bodyFont?.name) {
      loadGoogleFont(typography.bodyFont.name);
    }
  }, [typography.headerFont?.name, typography.bodyFont?.name]);

  const headerFontFamily = `"${typography.headerFont?.name || 'Space Grotesk'}", sans-serif`;
  const bodyFontFamily = `"${typography.bodyFont?.name || 'Plus Jakarta Sans'}", sans-serif`;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Google Font Pairings & Typographic System
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic live Google Fonts integration with optical scale ratio and live testing canvas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`https://fonts.google.com/specimen/${encodeURIComponent(typography.headerFont?.name || 'Space Grotesk')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <span>{typography.headerFont?.name} on Google Fonts</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Font Spec Cards: Header & Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Font Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Display / Header Typeface
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {typography.headerFont?.category}
              </span>
            </div>

            <div className="py-4 border-y border-slate-100 my-2">
              <span
                className="text-4xl sm:text-5xl font-bold text-slate-900 block leading-tight tracking-tight"
                style={{ fontFamily: headerFontFamily }}
              >
                {typography.headerFont?.name}
              </span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                Weights: {typography.headerFont?.weights?.join(', ') || '500, 700'}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Strategic Pairing Rationale
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {typography.headerFont?.reason}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Usage: H1, H2, Hero statements, pull quotes</span>
            <span className="font-mono text-indigo-600 font-medium">Google Fonts API</span>
          </div>
        </div>

        {/* Body Font Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                Text / Body Typeface
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {typography.bodyFont?.category}
              </span>
            </div>

            <div className="py-4 border-y border-slate-100 my-2">
              <span
                className="text-4xl sm:text-5xl font-medium text-slate-900 block leading-tight tracking-tight"
                style={{ fontFamily: bodyFontFamily }}
              >
                {typography.bodyFont?.name}
              </span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                Weights: {typography.bodyFont?.weights?.join(', ') || '400, 500, 600'}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Strategic Pairing Rationale
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {typography.bodyFont?.reason}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Usage: Long-form reading, UI controls, navigation, captions</span>
            <span className="font-mono text-indigo-600 font-medium">Google Fonts API</span>
          </div>
        </div>
      </div>

      {/* Preset Font Alternatives */}
      {onUpdatePairing && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Curated Designer Pairing Alternatives
            </span>
            <span className="text-xs text-slate-400">Click to instantly swap</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {POPULAR_PAIRINGS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onUpdatePairing(p.header, p.body)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-xs group"
              >
                <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                  {p.name}
                </div>
                <div className="text-slate-600 text-[11px] mt-1">
                  <span className="font-semibold">{p.header.name}</span> + {p.body.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Live Typographic Playground */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-sans">
                Interactive Specimen Playground
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Type directly into the inputs below to test the pairing with your own brand headlines and copy.
              </p>
            </div>
            <span className="text-xs font-mono px-2 py-1 bg-slate-100 rounded text-slate-600">
              Live CSS Render
            </span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Custom Headline Test
              </label>
              <input
                type="text"
                value={testHeading}
                onChange={(e) => setTestHeading(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Custom Paragraph Test
              </label>
              <textarea
                rows={2}
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Live Preview Area */}
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.15]"
              style={{ fontFamily: headerFontFamily }}
            >
              {testHeading}
            </h1>

            <p
              className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl"
              style={{ fontFamily: bodyFontFamily }}
            >
              {testBody}
            </p>

            <div className="pt-4 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-200/80">
              <span>Display: <strong className="text-slate-800">{typography.headerFont?.name}</strong></span>
              <span>•</span>
              <span>Body: <strong className="text-slate-800">{typography.bodyFont?.name}</strong></span>
            </div>
          </div>

          {/* Typographic Scale Hierarchy Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Standard Typographic Hierarchy Scale
            </h4>
            <div className="divide-y divide-slate-100 text-xs border border-slate-100 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-50 grid grid-cols-12 font-semibold text-slate-600">
                <span className="col-span-3">Element</span>
                <span className="col-span-4">Specification</span>
                <span className="col-span-5">Sample</span>
              </div>
              <div className="p-3 grid grid-cols-12 items-center">
                <span className="col-span-3 font-semibold text-slate-800">H1 Hero Headline</span>
                <span className="col-span-4 text-slate-500 font-mono text-[11px]">{typography.hierarchyScale?.h1 || '48px / 1.1 line-height'}</span>
                <span className="col-span-5 font-bold text-slate-900 text-lg truncate" style={{ fontFamily: headerFontFamily }}>
                  Grand Vision Ahead
                </span>
              </div>
              <div className="p-3 grid grid-cols-12 items-center">
                <span className="col-span-3 font-semibold text-slate-800">H2 Section Heading</span>
                <span className="col-span-4 text-slate-500 font-mono text-[11px]">{typography.hierarchyScale?.h2 || '32px / 1.25 line-height'}</span>
                <span className="col-span-5 font-semibold text-slate-900 text-base truncate" style={{ fontFamily: headerFontFamily }}>
                  Core Purpose & Architecture
                </span>
              </div>
              <div className="p-3 grid grid-cols-12 items-center">
                <span className="col-span-3 font-semibold text-slate-800">H3 Subsection</span>
                <span className="col-span-4 text-slate-500 font-mono text-[11px]">{typography.hierarchyScale?.h3 || '22px / 1.35 line-height'}</span>
                <span className="col-span-5 font-semibold text-slate-900 text-sm truncate" style={{ fontFamily: headerFontFamily }}>
                  Strategic Capabilities
                </span>
              </div>
              <div className="p-3 grid grid-cols-12 items-center">
                <span className="col-span-3 font-semibold text-slate-800">Body Standard</span>
                <span className="col-span-4 text-slate-500 font-mono text-[11px]">{typography.hierarchyScale?.body || '16px / 1.6 line-height'}</span>
                <span className="col-span-5 text-slate-700 text-xs truncate" style={{ fontFamily: bodyFontFamily }}>
                  Effortless reading rhythm across high-density layouts.
                </span>
              </div>
              <div className="p-3 grid grid-cols-12 items-center">
                <span className="col-span-3 font-semibold text-slate-800">Caption / Meta</span>
                <span className="col-span-4 text-slate-500 font-mono text-[11px]">{typography.hierarchyScale?.caption || '13px / 1.4 line-height'}</span>
                <span className="col-span-5 text-slate-400 text-[11px] truncate uppercase tracking-wider" style={{ fontFamily: bodyFontFamily }}>
                  Est. 2026 • Confidential
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
