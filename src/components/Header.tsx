import React from 'react';
import { Compass, Sparkles, MessageSquare, Download, Printer, ArrowLeft } from 'lucide-react';
import { ImageSizeAffordance } from '../types';

interface HeaderProps {
  companyName?: string;
  hasBrandBible: boolean;
  selectedSize: ImageSizeAffordance;
  onSizeChange: (size: ImageSizeAffordance) => void;
  onOpenChat: () => void;
  onOpenExport: () => void;
  onReset: () => void;
  unreadChatCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  companyName,
  hasBrandBible,
  selectedSize,
  onSizeChange,
  onOpenChat,
  onOpenExport,
  onReset,
  unreadChatCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity Logo & Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Generator Home"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-indigo-600 transition-colors">
              <Compass className="w-5 h-5 text-indigo-400 group-hover:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 tracking-tight text-base font-sans">
                  {hasBrandBible && companyName ? companyName : 'Brand Bible'}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Identity Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {hasBrandBible ? 'Official Brand Bible Guidelines' : 'Autonomous Brand Identity Generator'}
              </p>
            </div>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Image Resolution Selector (Affordance for 1K, 2K, 4K) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200" title="Image Generation Resolution Affordance">
            <span className="text-[11px] font-medium text-slate-500 px-1.5 hidden lg:inline">Res:</span>
            {(['1K', '2K', '4K'] as ImageSizeAffordance[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedSize === size
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {hasBrandBible && (
            <>
              <button
                onClick={() => window.print()}
                type="button"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={onOpenExport}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Export Brand Tokens"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </>
          )}

          {/* Chat with Gemini Brand Strategist */}
          <button
            onClick={onOpenChat}
            type="button"
            className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Creative Director</span>
            <span className="sm:hidden">Advisor</span>
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadChatCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
