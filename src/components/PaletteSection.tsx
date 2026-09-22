import React, { useState } from 'react';
import { Copy, Check, Info, ShieldCheck, AlertCircle } from 'lucide-react';
import { BrandColor } from '../types';

interface PaletteSectionProps {
  palette: BrandColor[];
}

// Calculate relative luminance for WCAG contrast
function getLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const PaletteSection: React.FC<PaletteSectionProps> = ({ palette }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const copyAllPalette = () => {
    const text = palette.map((c) => `${c.name} (${c.role}): ${c.hex} | ${c.usage}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedHex('ALL');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            5-Color Chromatic Palette System
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Calibrated 60-30-10 distribution with prescriptive usage rules and contrast metrics.
          </p>
        </div>

        <button
          onClick={copyAllPalette}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          {copiedHex === 'ALL' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied All Colors!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Palette Hexes</span>
            </>
          )}
        </button>
      </div>

      {/* 60-30-10 Visual Proportional Distribution Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>60-30-10 Brand Weight Hierarchy</span>
          <span className="text-[11px] text-slate-400 font-normal">
            Primary (60%) • Supporting (30%) • Focal Accent (10%)
          </span>
        </div>

        <div className="h-10 w-full rounded-xl overflow-hidden flex shadow-inner border border-slate-200/60">
          <div
            className="h-full flex items-center justify-center text-white text-[11px] font-bold tracking-wider transition-all duration-300 relative group cursor-pointer"
            style={{ width: '50%', backgroundColor: palette[0]?.hex || '#1D4ED8' }}
            onClick={() => copyToClipboard(palette[0]?.hex)}
            title="Primary (60% dominant visual balance)"
          >
            <span className="drop-shadow-xs truncate px-2">{palette[0]?.name} (60%)</span>
          </div>

          <div
            className="h-full flex items-center justify-center text-[11px] font-bold tracking-wider transition-all duration-300 relative group cursor-pointer"
            style={{
              width: '25%',
              backgroundColor: palette[1]?.hex || '#06B6D4',
              color: palette[1]?.textColorRecommendation || '#000',
            }}
            onClick={() => copyToClipboard(palette[1]?.hex)}
            title="Secondary (30% supporting balance)"
          >
            <span className="drop-shadow-xs truncate px-2">{palette[1]?.name} (25%)</span>
          </div>

          <div
            className="h-full flex items-center justify-center text-[11px] font-bold tracking-wider transition-all duration-300 relative group cursor-pointer"
            style={{
              width: '10%',
              backgroundColor: palette[2]?.hex || '#F59E0B',
              color: palette[2]?.textColorRecommendation || '#000',
            }}
            onClick={() => copyToClipboard(palette[2]?.hex)}
            title="Accent (10% focal touchpoints)"
          >
            <span className="drop-shadow-xs truncate px-1">Accent</span>
          </div>

          <div
            className="h-full flex items-center justify-center text-slate-800 text-[11px] font-bold tracking-wider transition-all duration-300 relative group cursor-pointer"
            style={{ width: '8%', backgroundColor: palette[3]?.hex || '#F8FAFC' }}
            onClick={() => copyToClipboard(palette[3]?.hex)}
            title="Neutral Light (Background canvas)"
          >
            <span className="truncate px-1">Light</span>
          </div>

          <div
            className="h-full flex items-center justify-center text-white text-[11px] font-bold tracking-wider transition-all duration-300 relative group cursor-pointer"
            style={{ width: '7%', backgroundColor: palette[4]?.hex || '#0F172A' }}
            onClick={() => copyToClipboard(palette[4]?.hex)}
            title="Neutral Dark (Ink / Typography)"
          >
            <span className="truncate px-1">Dark</span>
          </div>
        </div>
      </div>

      {/* 5 Color Cards with Extensive Usage Notes */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {palette.map((color, index) => {
          const contrastAgainstWhite = getContrastRatio(color.hex, '#ffffff').toFixed(1);
          const contrastAgainstBlack = getContrastRatio(color.hex, '#000000').toFixed(1);
          const isCopied = copiedHex === color.hex;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              {/* Color Swatch Header */}
              <div>
                <div
                  className="h-32 w-full p-3 flex flex-col justify-between relative group cursor-pointer transition-transform duration-200"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyToClipboard(color.hex)}
                  title="Click to copy hex code"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        backgroundColor: color.textColorRecommendation === '#ffffff' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
                        color: color.textColorRecommendation,
                      }}
                    >
                      {color.role}
                    </span>

                    <span
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                      style={{
                        backgroundColor: color.textColorRecommendation === '#ffffff' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
                        color: color.textColorRecommendation,
                      }}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span
                      className="font-mono text-xs font-bold tracking-wider"
                      style={{ color: color.textColorRecommendation }}
                    >
                      {color.hex}
                    </span>
                    {isCopied && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md"
                        style={{
                          backgroundColor: color.textColorRecommendation === '#ffffff' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)',
                          color: color.textColorRecommendation,
                        }}
                      >
                        Copied!
                      </span>
                    )}
                  </div>
                </div>

                {/* Details & Usage Guidelines */}
                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{color.name}</h4>
                    <span className="font-mono text-[11px] text-slate-400 block mt-0.5">
                      {color.rgb}
                    </span>
                  </div>

                  {/* Prescriptive Usage Notes */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="font-semibold text-slate-700 block text-[11px] mb-1">
                      Prescriptive Usage Note:
                    </span>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {color.usage}
                    </p>
                  </div>

                  {/* Contrast Score Indicator */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Contrast:</span>
                    <span className="font-mono font-medium">
                      {parseFloat(contrastAgainstWhite) > 4.5 ? 'AA White (Pass)' : 'Dark Text Rec.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Copy Action */}
              <div className="p-3 pt-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(color.hex)}
                  className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Hex</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
