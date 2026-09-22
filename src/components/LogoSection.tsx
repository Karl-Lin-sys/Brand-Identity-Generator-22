import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Download,
  Eye,
  Maximize2,
  ShieldAlert,
  Sliders,
  Check,
  Info,
} from 'lucide-react';
import { BrandBible, LogoMark, ImageSizeAffordance } from '../types';

interface LogoSectionProps {
  brandBible: BrandBible;
  onRegenerateMark: (markId: string, prompt: string, size: ImageSizeAffordance, style: string) => Promise<void>;
  isRegenerating: boolean;
}

export const LogoSection: React.FC<LogoSectionProps> = ({
  brandBible,
  onRegenerateMark,
  isRegenerating,
}) => {
  const [bgMode, setBgMode] = useState<'white' | 'dark' | 'brand' | 'checker'>('white');
  const [editingMarkId, setEditingMarkId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [customSize, setCustomSize] = useState<ImageSizeAffordance>('1K');
  const [customStyle, setCustomStyle] = useState('Vector Geometric Minimalist');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const primaryColorHex = brandBible.colorPalette.find((c) => c.role === 'Primary')?.hex || '#1D4ED8';

  const getBgClass = () => {
    switch (bgMode) {
      case 'white':
        return 'bg-white border-slate-200';
      case 'dark':
        return 'bg-slate-950 border-slate-800 text-white';
      case 'brand':
        return 'border-transparent text-white';
      case 'checker':
        return 'bg-[linear-gradient(45deg,#f1f5f9_25%,transparent_25%),linear-gradient(-45deg,#f1f5f9_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f1f5f9_75%),linear-gradient(-45deg,transparent_75%,#f1f5f9_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] border-slate-200';
      default:
        return 'bg-white';
    }
  };

  const handleOpenRegenModal = (mark: LogoMark) => {
    setEditingMarkId(mark.id);
    setCustomPrompt(mark.prompt);
    setCustomSize(mark.imageSize || '1K');
    setCustomStyle(mark.style || 'Minimalist Vector Emblem');
  };

  const handleConfirmRegenerate = async () => {
    if (!editingMarkId) return;
    await onRegenerateMark(editingMarkId, customPrompt, customSize, customStyle);
    setEditingMarkId(null);
  };

  const downloadImage = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandBible.companyName.toLowerCase().replace(/\s+/g, '-')}-${filename}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedNotification('Prompt copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* Section Header & Visual Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
            Brand Marks & Identity System
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered with model <code className="text-indigo-600 font-mono">gemini-3-pro-image-preview</code> for vector clarity and proportional scale.
          </p>
        </div>

        {/* Canvas Background Preview Toggles */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Canvas:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setBgMode('white')}
              className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                bgMode === 'white' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setBgMode('dark')}
              className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                bgMode === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBgMode('brand')}
              className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                bgMode === 'brand' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Brand
            </button>
            <button
              onClick={() => setBgMode('checker')}
              className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                bgMode === 'checker' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Primary Logo Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                Primary Brand Mark
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {brandBible.primaryLogo.imageSize || '1K'} Resolution
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenRegenModal(brandBible.primaryLogo)}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate (1K/2K/4K)</span>
              </button>

              {brandBible.primaryLogo.imageUrl && (
                <button
                  type="button"
                  onClick={() => downloadImage(brandBible.primaryLogo.imageUrl!, 'primary-mark')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="Download primary logo"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Canvas Display */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div
                className={`w-full aspect-square max-w-[360px] rounded-xl border p-8 flex items-center justify-center relative transition-all duration-300 ${getBgClass()}`}
                style={bgMode === 'brand' ? { backgroundColor: primaryColorHex } : {}}
              >
                {brandBible.primaryLogo.imageUrl ? (
                  <img
                    src={brandBible.primaryLogo.imageUrl}
                    alt={`${brandBible.companyName} Primary Logo`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-6">
                    <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
                    <span className="text-xs text-slate-500">Generating mark with gemini-3-pro-image-preview...</span>
                  </div>
                )}

                {/* Clear Space Exclusion Zone Indicator */}
                <div className="absolute inset-3 border border-dashed border-indigo-400/40 rounded-lg pointer-events-none flex items-start justify-end p-1.5">
                  <span className="text-[10px] font-mono text-indigo-400/80 bg-white/70 backdrop-blur-xs px-1 rounded">
                    Safe Zone 1.5x
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 mt-2">
                Dashed boundary indicates mandatory clear space exclusion zone
              </span>
            </div>

            {/* Specifications & Rationale */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {brandBible.primaryLogo.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {brandBible.primaryLogo.rationale}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Clear Space Rule
                  </span>
                  <span className="text-xs font-medium text-slate-800 mt-1 block">
                    {brandBible.primaryLogo.clearSpaceRule || '1.5x glyph height on all four sides'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Minimum Scale
                  </span>
                  <span className="text-xs font-medium text-slate-800 mt-1 block">
                    {brandBible.primaryLogo.minSize || '32px digital / 12mm print'}
                  </span>
                </div>
              </div>

              {/* Generative Prompt Inspector */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700">Model Synthesis Prompt</span>
                  <button
                    onClick={() => copyPrompt(brandBible.primaryLogo.prompt)}
                    className="text-indigo-600 hover:text-indigo-700 text-[11px] font-medium"
                  >
                    Copy Prompt
                  </button>
                </div>
                <p className="text-slate-500 font-mono text-[11px] leading-relaxed line-clamp-3">
                  {brandBible.primaryLogo.prompt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Marks Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">
              Secondary Marks & Sub-Identities
            </h3>
            <p className="text-xs text-slate-500">
              Responsive adaptations for high-density environments, stamps, social avatars, and app icons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandBible.secondaryMarks.map((mark) => (
            <div
              key={mark.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {mark.type} Mark
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {mark.imageSize || '1K'}
                  </span>
                </div>

                <div
                  className={`w-full aspect-video rounded-xl border p-4 flex items-center justify-center mb-4 transition-all ${getBgClass()}`}
                  style={bgMode === 'brand' ? { backgroundColor: primaryColorHex } : {}}
                >
                  {mark.imageUrl ? (
                    <img
                      src={mark.imageUrl}
                      alt={mark.title}
                      className="max-h-full max-w-[160px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                  )}
                </div>

                <h4 className="font-semibold text-slate-900 text-sm">{mark.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {mark.rationale}
                </p>

                <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-medium text-slate-500 block text-[11px]">Best Used For:</span>
                  <span className="text-slate-800 font-medium text-xs mt-0.5 block">
                    {mark.usageContext || 'Favicons, stamps, social icons, hardware engraving'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenRegenModal(mark)}
                  disabled={isRegenerating}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Mark</span>
                </button>

                {mark.imageUrl && (
                  <button
                    type="button"
                    onClick={() => downloadImage(mark.imageUrl!, mark.type)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regeneration Modal with Resolution Affordance (1K, 2K, 4K) */}
      {editingMarkId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Configure Logo Generation</span>
              </h3>
              <button
                onClick={() => setEditingMarkId(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Resolution Affordance (gemini-3-pro-image-preview)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as ImageSizeAffordance[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setCustomSize(size)}
                      className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                        customSize === size
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {size} Output
                      <span className="block text-[10px] font-normal text-slate-400">
                        {size === '1K' ? '1024x1024' : size === '2K' ? '2048x2048' : '4096x4096'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Design Style Preset
                </label>
                <select
                  value={customStyle}
                  onChange={(e) => setCustomStyle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Vector Geometric Minimalist">Vector Geometric Minimalist</option>
                  <option value="Monogram Lettermark Emblem">Monogram Lettermark Emblem</option>
                  <option value="Modern Line Art & Negative Space">Modern Line Art & Negative Space</option>
                  <option value="Heritage Seal & Circular Crest">Heritage Seal & Circular Crest</option>
                  <option value="Abstract Monolith / Dynamic Glyph">Abstract Monolith / Dynamic Glyph</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Generation Prompt
                </label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingMarkId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRegenerate}
                disabled={isRegenerating}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                {isRegenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Generate {customSize} Mark</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
