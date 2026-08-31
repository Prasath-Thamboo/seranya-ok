import type { Config } from 'tailwindcss';

/**
 * Seranya — refonte "premium apaisé" (lot 1 : fondations).
 *
 * Stratégie de migration : les composants existants utilisent massivement les
 * échelles de couleurs Tailwind par défaut (bg-green-500, text-gray-300, …).
 * Plutôt qu'un big-bang qui renommerait toutes les classes d'un coup, ce lot
 * REMAPPE les échelles de teintes vives (green/teal/red/yellow/blue/indigo/…)
 * vers la nouvelle palette minérale chaude. Résultat : le vert néon disparaît
 * partout instantanément, sans casser une seule className. Les lots suivants
 * feront le nettoyage structurel (surfaces sombres, casse typographique, etc.).
 */

const sage = {
  50: '#F3F5F1',
  100: '#E9EDE4',
  200: '#D6DECC',
  300: '#BAC7AC',
  400: '#9DAE8B',
  500: '#7A8B6F', // accent signature
  600: '#6B7A61',
  700: '#56634F',
  800: '#454F41',
  900: '#3A4237',
  950: '#1F241D',
};

const terracotta = {
  50: '#FBF1ED',
  100: '#F5E0D8',
  200: '#E9BFB0',
  300: '#DB9B85',
  400: '#C6745A',
  500: '#A9553D', // accent chaud secondaire / erreur adoucie
  600: '#914534',
  700: '#74372A',
  800: '#5C2E24',
  900: '#4C281F',
  950: '#29140F',
};

const gold = {
  50: '#FBF6EC',
  100: '#F3E8CF',
  200: '#E6D0A0',
  300: '#D6B673',
  400: '#C4A05C',
  500: '#B08D57', // touche de luxe / warning adouci / CHAMPION
  600: '#977748',
  700: '#785D3A',
  800: '#614B31',
  900: '#51402B',
  950: '#2D2216',
};

const slate = {
  50: '#F2F4F5',
  100: '#E3EAED',
  200: '#C7D3D8',
  300: '#A1B4BC',
  400: '#7C949F',
  500: '#5F7684', // bleu ardoise : info / rôle ADMIN
  600: '#4E626E',
  700: '#404E58',
  800: '#364149',
  900: '#2F383E',
  950: '#1B2126',
};

/** Neutres chauds — remplacent le gris froid Tailwind (texte, lignes, méta). */
const sand = {
  50: '#FAF7F2', // fond de page (ivoire chaud)
  100: '#F5F0E8',
  200: '#EFE7DA', // sections alternées (sable)
  300: '#E4DACB', // bordures subtiles
  400: '#D3C6B2', // bordures marquées
  500: '#9A8E7D', // texte muted / méta
  600: '#6E6255', // texte secondaire
  700: '#4A4238',
  800: '#352F28',
  900: '#2B241D', // texte principal (brun très foncé chaud)
  950: '#1C1813',
};

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ---- Tokens sémantiques (à privilégier dans le code neuf) ---- */
        page: sand[50],
        raised: '#FFFDF9',
        sunken: sand[200],
        ink: {
          DEFAULT: sand[900],
          soft: sand[600],
          muted: sand[500],
          invert: sand[50],
        },
        line: {
          DEFAULT: sand[300],
          strong: sand[400],
        },
        accent: {
          DEFAULT: sage[500],
          hover: sage[600],
          soft: sage[100],
          contrast: sand[50],
        },
        warm: {
          DEFAULT: terracotta[500],
          soft: terracotta[50],
        },
        gilt: {
          DEFAULT: gold[500],
          soft: gold[50],
        },
        success: { DEFAULT: '#6F8A6A', soft: '#E7EEE4' },
        danger: { DEFAULT: terracotta[500], soft: terracotta[50] },
        warning: { DEFAULT: gold[500], soft: gold[50] },
        info: { DEFAULT: slate[500], soft: slate[100] },

        /* ---- Remap des échelles Tailwind vives -> palette premium ----
           (compat : garde toutes les classNames existantes fonctionnelles) */
        green: sage,
        emerald: sage,
        teal: sage,
        lime: sage,
        red: terracotta,
        rose: terracotta,
        orange: terracotta,
        yellow: gold,
        amber: gold,
        blue: slate,
        indigo: slate,
        sky: slate,
        cyan: slate,
        violet: slate,
        purple: slate,
        sand,
      },
      fontFamily: {
        /* Corps / UI : sans humaniste douce */
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        kanit: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /* Titres / moments de marque : serif élégante discrète */
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'serif'],
        oxanium: ['var(--font-serif)', 'Georgia', 'serif'],
        optimus: ['var(--font-serif)', 'Georgia', 'serif'],
        /* Ancien "iceberg" : neutralisé en sans propre le temps de nettoyer
           les call-sites (uppercase/tracking-widest) dans les lots suivants. */
        iceberg: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2.25rem',
      },
      boxShadow: {
        /* Élévations douces et chaudes — plus aucun halo coloré/néon */
        xs: '0 1px 2px rgba(43,36,29,0.04)',
        sm: '0 1px 2px rgba(43,36,29,0.04), 0 1px 3px rgba(43,36,29,0.06)',
        DEFAULT: '0 4px 16px rgba(43,36,29,0.07)',
        md: '0 8px 30px rgba(43,36,29,0.08)',
        lg: '0 20px 50px rgba(43,36,29,0.10)',
        xl: '0 28px 70px rgba(43,36,29,0.12)',
        'white-glow': '0 8px 30px rgba(43,36,29,0.08)',
      },
      transitionTimingFunction: {
        /* Courbe "respiration" : sortie lente et posée */
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
