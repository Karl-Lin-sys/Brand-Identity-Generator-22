import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Code2, Printer } from 'lucide-react';
import { BrandBible } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandBible: BrandBible;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  brandBible,
}) => {
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'json'>('css');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const cssTokens = `:root {
  /* Brand Colors */
  --brand-primary: ${brandBible.colorPalette[0]?.hex};
  --brand-secondary: ${brandBible.colorPalette[1]?.hex};
  --brand-accent: ${brandBible.colorPalette[2]?.hex};
  --brand-neutral-light: ${brandBible.colorPalette[3]?.hex};
  --brand-neutral-dark: ${brandBible.colorPalette[4]?.hex};

  /* Typography */
  --font-header: "${brandBible.typography.headerFont.name}", sans-serif;
  --font-body: "${brandBible.typography.bodyFont.name}", sans-serif;
}`;

  const tailwindTokens = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${brandBible.colorPalette[0]?.hex}',
          secondary: '${brandBible.colorPalette[1]?.hex}',
          accent: '${brandBible.colorPalette[2]?.hex}',
          light: '${brandBible.colorPalette[3]?.hex}',
          dark: '${brandBible.colorPalette[4]?.hex}',
        },
      },
      fontFamily: {
        header: ['"${brandBible.typography.headerFont.name}"', 'sans-serif'],
        body: ['"${brandBible.typography.bodyFont.name}"', 'sans-serif'],
      },
    },
  },
};`;

  const jsonExport = JSON.stringify(brandBible, null, 2);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'css':
        return cssTokens;
      case 'tailwind':
        return tailwindTokens;
      case 'json':
        return jsonExport;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandBible.companyName.toLowerCase().replace(/\s+/g, '-')}-brand-bible.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-scale-in">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Export Brand Guidelines & Tokens</h3>
            <p className="text-xs text-slate-500">
              Integrate tokens into web codebases or download the full Brand Bible specification.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'css' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CSS Variables
            </button>
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tailwind' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tailwind Config
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'json' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raw JSON
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            {activeTab === 'json' && (
              <button
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON</span>
              </button>
            )}
          </div>
        </div>

        {/* Code Content Box */}
        <div className="mt-3">
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed border border-slate-800">
            <code>{getActiveContent()}</code>
          </pre>
        </div>

        {/* Print Option Footer */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Need a formatted physical handbook? Use your browser's Print dialog.</span>
          </span>
          <button
            onClick={() => {
              onClose();
              window.print();
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            Open Print View
          </button>
        </div>
      </div>
    </div>
  );
};
