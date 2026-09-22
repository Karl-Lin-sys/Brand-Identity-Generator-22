import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MissionForm } from './components/MissionForm';
import { BrandBibleView } from './components/BrandBibleView';
import { BrandChatDrawer } from './components/BrandChatDrawer';
import { ExportModal } from './components/ExportModal';
import { BrandBible, ImageSizeAffordance, FontSpec } from './types';
import { loadGoogleFont } from './utils/fontLoader';

export default function App() {
  const [brandBible, setBrandBible] = useState<BrandBible | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ImageSizeAffordance>('1K');
  const [isRegeneratingMark, setIsRegeneratingMark] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preload initial fonts for typography showcase
  useEffect(() => {
    loadGoogleFont('Space Grotesk');
    loadGoogleFont('Plus Jakarta Sans');
  }, []);

  const handleGenerateBrandBible = async (formData: {
    companyName: string;
    mission: string;
    industry: string;
    vibe: string;
    targetAudience: string;
    imageSize: ImageSizeAffordance;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Step 1: Generate comprehensive brand bible blueprint
      const response = await fetch('/api/brand/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.brandBible) {
        throw new Error(data.error || 'Failed to generate Brand Bible');
      }

      const generatedBible: BrandBible = data.brandBible;

      // Preload Google Fonts dynamically
      if (generatedBible.typography?.headerFont?.name) {
        loadGoogleFont(generatedBible.typography.headerFont.name);
      }
      if (generatedBible.typography?.bodyFont?.name) {
        loadGoogleFont(generatedBible.typography.bodyFont.name);
      }

      setBrandBible(generatedBible);

      // Step 2: Trigger Logo generation with gemini-3-pro-image-preview
      generateLogoMark(
        generatedBible,
        'mark-primary',
        generatedBible.primaryLogo.prompt,
        formData.imageSize,
        generatedBible.primaryLogo.style,
        generatedBible.companyName,
        'primary'
      );
    } catch (err: any) {
      console.error('Generation failure:', err);
      setErrorMessage(err.message || 'An unexpected error occurred while building the Brand Bible.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateLogoMark = async (
    currentBible: BrandBible,
    markId: string,
    prompt: string,
    size: ImageSizeAffordance,
    style: string,
    companyName: string,
    markType: string
  ) => {
    setIsRegeneratingMark(true);
    try {
      const res = await fetch('/api/brand/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          imageSize: size,
          style,
          companyName,
          markType,
        }),
      });
      const logoData = await res.json();

      if (logoData.imageUrl) {
        setBrandBible((prev) => {
          if (!prev) return prev;
          if (markId === 'mark-primary' || markId === prev.primaryLogo.id) {
            return {
              ...prev,
              primaryLogo: {
                ...prev.primaryLogo,
                imageUrl: logoData.imageUrl,
                imageSize: size,
              },
            };
          } else {
            return {
              ...prev,
              secondaryMarks: prev.secondaryMarks.map((m) =>
                m.id === markId
                  ? {
                      ...m,
                      imageUrl: logoData.imageUrl,
                      imageSize: size,
                    }
                  : m
              ),
            };
          }
        });
      }
    } catch (e) {
      console.warn('Logo generation subtask completed with fallback:', e);
    } finally {
      setIsRegeneratingMark(false);
    }
  };

  const handleRegenerateMark = async (
    markId: string,
    prompt: string,
    size: ImageSizeAffordance,
    style: string
  ) => {
    if (!brandBible) return;
    const isPrimary = markId === 'mark-primary' || markId === brandBible.primaryLogo.id;
    await generateLogoMark(
      brandBible,
      markId,
      prompt,
      size,
      style,
      brandBible.companyName,
      isPrimary ? 'primary' : 'monogram'
    );
  };

  const handleUpdatePairing = (headerFont: FontSpec, bodyFont: FontSpec) => {
    loadGoogleFont(headerFont.name);
    loadGoogleFont(bodyFont.name);
    setBrandBible((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        typography: {
          ...prev.typography,
          headerFont,
          bodyFont,
        },
      };
    });
  };

  const handleReset = () => {
    setBrandBible(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        companyName={brandBible?.companyName}
        hasBrandBible={!!brandBible}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onReset={handleReset}
      />

      {/* Error alert if any */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {!brandBible ? (
          <MissionForm
            onGenerate={handleGenerateBrandBible}
            isLoading={isLoading}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />
        ) : (
          <BrandBibleView
            brandBible={brandBible}
            onReset={handleReset}
            onOpenChat={() => setIsChatOpen(true)}
            onRegenerateMark={handleRegenerateMark}
            isRegeneratingMark={isRegeneratingMark}
            onUpdatePairing={handleUpdatePairing}
          />
        )}
      </main>

      {/* Gemini Multi-turn Chatbot Drawer */}
      <BrandChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        brandBible={brandBible || undefined}
      />

      {/* Brand Export Modal */}
      {brandBible && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          brandBible={brandBible}
        />
      )}
    </div>
  );
}
