require('@testing-library/jest-dom');

// antd (via responsiveObserver) appelle window.matchMedia dès le montage de
// composants comme Form/Row, absent de jsdom par défaut.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
