import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Applique la négociation de locale à toutes les routes sauf :
  // les routes API, les internes Next/Vercel et les fichiers statiques.
  // `/admin/*` passe par ici mais reste toujours servi en `fr`
  // (aucune chaîne d'admin n'est traduite).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
