/**
 * Utility to dynamically inject Google Fonts into document head
 */
const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string) {
  if (!fontName || typeof document === 'undefined') return;
  const sanitized = fontName.trim();
  if (loadedFonts.has(sanitized)) return;

  try {
    const formattedFamily = sanitized.replace(/\s+/g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap`;
    
    // Check if already in DOM
    const existing = document.querySelector(`link[href*="${formattedFamily}"]`);
    if (existing) {
      loadedFonts.add(sanitized);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    loadedFonts.add(sanitized);
  } catch (err) {
    console.warn(`Could not load font ${fontName}:`, err);
  }
}
