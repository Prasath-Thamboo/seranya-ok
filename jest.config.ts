import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Utiliser ts-jest pour les fichiers TypeScript
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Notez que ce fichier est un .js
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Pour gérer les imports CSS
    '^@/(.*)$': '<rootDir>/src/$1', // Pour les alias d'import
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Utiliser ts-jest pour les fichiers TypeScript et JSX
  },
  transformIgnorePatterns: ['/node_modules/'],
};

export default config;
