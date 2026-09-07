// Root layout obligatoire pour l'App Router.
// Les balises <html> / <body> et toute la configuration réelle vivent dans
// `app/[locale]/layout.tsx` (rendu locale-aware). Ce fichier ne fait que
// transmettre les enfants.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
