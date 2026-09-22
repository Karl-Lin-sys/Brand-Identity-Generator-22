import React from 'react';
import { BrandBible } from '../types';
import { Smartphone, CreditCard, Layout, PackageCheck, Sparkles } from 'lucide-react';

interface MockupSectionProps {
  brandBible: BrandBible;
}

export const MockupSection: React.FC<MockupSectionProps> = ({ brandBible }) => {
  const primaryColor = brandBible.colorPalette.find((c) => c.role === 'Primary')?.hex || '#1D4ED8';
  const secondaryColor = brandBible.colorPalette.find((c) => c.role === 'Secondary')?.hex || '#06B6D4';
  const accentColor = brandBible.colorPalette.find((c) => c.role === 'Accent')?.hex || '#F59E0B';
  const neutralLight = brandBible.colorPalette.find((c) => c.role === 'Neutral Light')?.hex || '#F8FAFC';
  const neutralDark = brandBible.colorPalette.find((c) => c.role === 'Neutral Dark')?.hex || '#0F172A';

  const headerFont = `"${brandBible.typography.headerFont?.name || 'Space Grotesk'}", sans-serif`;
  const bodyFont = `"${brandBible.typography.bodyFont?.name || 'Plus Jakarta Sans'}", sans-serif`;

  const logoImg = brandBible.primaryLogo.imageUrl;
  const secondaryMarkImg = brandBible.secondaryMarks[0]?.imageUrl || logoImg;

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          Brand Collateral & Live Mockups
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Dynamic preview of your identity across physical and digital customer touchpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mockup 1: Premium Business Card (Front & Back) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Corporate Stationery • Dual-Sided Business Card
              </span>
            </div>

            <div className="space-y-4 py-2">
              {/* Card Front (Dark / Primary Anchor) */}
              <div
                className="aspect-[1.75/1] w-full rounded-xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.01]"
                style={{ backgroundColor: neutralDark, color: '#ffffff' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {secondaryMarkImg ? (
                      <img
                        src={secondaryMarkImg}
                        alt="Mark"
                        className="w-8 h-8 object-contain rounded-md"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-md bg-white/10" />
                    )}
                    <span className="font-bold text-sm tracking-tight" style={{ fontFamily: headerFont }}>
                      {brandBible.companyName}
                    </span>
                  </div>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>

                <div>
                  <span className="text-xs text-slate-400 block tracking-wider uppercase font-mono">
                    Official Identity
                  </span>
                  <p className="text-[11px] text-slate-300 italic mt-0.5 line-clamp-1" style={{ fontFamily: bodyFont }}>
                    {brandBible.tagline}
                  </p>
                </div>
              </div>

              {/* Card Back (Clean Light / Executive) */}
              <div
                className="aspect-[1.75/1] w-full rounded-xl p-6 flex flex-col justify-between border shadow-sm relative overflow-hidden transition-transform hover:scale-[1.01]"
                style={{ backgroundColor: neutralLight, borderColor: '#e2e8f0', color: neutralDark }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm tracking-tight" style={{ fontFamily: headerFont }}>
                      Alexandra Vance
                    </h4>
                    <span className="text-[11px] text-slate-500 block font-medium">
                      Chief Executive & Founder
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    EXECUTIVE
                  </span>
                </div>

                <div className="flex items-end justify-between text-[11px] text-slate-600 font-mono">
                  <div>
                    <span>contact@{brandBible.companyName.toLowerCase().replace(/\s+/g, '')}.com</span>
                    <br />
                    <span>+1 (555) 019-2834</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold" style={{ color: primaryColor }}>
                      {brandBible.companyName.toLowerCase().replace(/\s+/g, '')}.io
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 mt-4 block">
            Specs: 3.5" × 2" • 600gsm Cotton Matte • Foil Accent
          </span>
        </div>

        {/* Mockup 2: Smartphone App & Splash Interface */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Digital Touchpoint • Mobile App Splash Experience
              </span>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="w-56 h-[340px] rounded-[36px] bg-slate-900 p-2.5 shadow-xl border-4 border-slate-800 relative">
                {/* Dynamic Screen */}
                <div
                  className="w-full h-full rounded-[28px] p-5 flex flex-col justify-between items-center text-center relative overflow-hidden"
                  style={{ backgroundColor: neutralDark }}
                >
                  {/* Speaker notch */}
                  <div className="w-16 h-3 bg-black/40 rounded-full mx-auto" />

                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div
                      className="w-16 h-16 rounded-2xl p-2 flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      {logoImg ? (
                        <img
                          src={logoImg}
                          alt="Mobile App Mark"
                          className="w-12 h-12 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-base tracking-tight" style={{ fontFamily: headerFont }}>
                        {brandBible.companyName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-[150px] mx-auto line-clamp-2" style={{ fontFamily: bodyFont }}>
                        {brandBible.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <button
                      type="button"
                      className="w-full py-2 rounded-xl text-xs font-bold shadow-md transition-all"
                      style={{ backgroundColor: primaryColor, color: '#ffffff' }}
                    >
                      Enter Platform
                    </button>
                    <span className="text-[10px] text-slate-500 block">v2.4.0 • Enterprise Core</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="text-[11px] text-slate-400 mt-4 block text-center">
            Adaptive icon rendering tested across iOS / Android super-ellipses.
          </span>
        </div>

        {/* Mockup 3: Web Hero Experience */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Web Interface Hero Component
            </span>
          </div>

          <div
            className="rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            style={{ backgroundColor: neutralLight }}
          >
            {/* Fake browser bar */}
            <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="mx-auto font-mono text-[11px] text-slate-400">
                https://www.{brandBible.companyName.toLowerCase().replace(/\s+/g, '')}.com
              </span>
            </div>

            {/* Hero content */}
            <div className="p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-2xs"
                style={{ backgroundColor: `${secondaryColor}20`, color: primaryColor }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                <span>{brandBible.brandArchetype.name} Archetype</span>
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight"
                style={{ fontFamily: headerFont }}
              >
                {brandBible.tagline}
              </h1>

              <p
                className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
                style={{ fontFamily: bodyFont }}
              >
                {brandBible.elevatorPitch}
              </p>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  Get Started
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                >
                  Read Brand Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
