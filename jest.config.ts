import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Utiliser ts-jest pour les fichiers TypeScript
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Notez que ce fichier est un .js
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Pour gérer les imports CSS
    '^@/(.*)$': '<rootDir>/$1', // Pour les alias d'import (aligné sur tsconfig paths)
  },
  transform: {
    // jsx: 'react-jsx' surcharge le tsconfig ('preserve', requis par le compilateur Next.js)
    // car ts-jest a besoin de JSX compilé en JS exécutable par Node.
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
