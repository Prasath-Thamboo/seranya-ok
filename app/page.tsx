import Image from "next/image";
import Link from "next/link";
import { LuCheck, LuArrowRight, LuWind, LuBrain, LuActivity, LuLeaf, LuBookOpen, LuUsers } from "react-icons/lu";
import Reveal from "@/components/home/Reveal";
import StatsCounters from "@/components/home/StatsCounters";
import JoinCTA from "@/components/home/JoinCTA";
import PricingGate from "@/components/home/PricingGate";
import FooterCTA from "@/components/home/FooterCTA";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { fetchRandomBackground, fetchRandomBackgrounds } from "@/lib/queries/RandomBackgroundQuery";
import { UnitModel } from "@/lib/models/UnitModels";
import { fetchPosts } from "@/lib/queries/PostQueries";
import { fetchPublishedTutorials } from "@/lib/queries/TutorialQueries";
import { fetchPublishedDefinitions } from "@/lib/queries/DefinitionQueries";

export const revalidate = 300;

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-center text-xs font-sans uppercase tracking-[0.22em] text-accent">
    {children}
  </p>
);

export default async function Home() {
  const [fetchedUnits, fetchedPosts, fetchedTutorials, fetchedDefinitions, bgImage, secImages] =
    await Promise.allSettled([
      fetchUnits(),
      fetchPosts(),
      fetchPublishedTutorials(),
      fetchPublishedDefinitions(),
      fetchRandomBackground(),
      fetchRandomBackgrounds(4),
    ]);

  const units: UnitModel[] =
    fetchedUnits.status === "fulfilled"
      ? [...fetchedUnits.value]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
      : [];

  const postCount = fetchedPosts.status === "fulfilled" ? fetchedPosts.value.length : 0;
  const tutorialCount = fetchedTutorials.status === "fulfilled" ? fetchedTutorials.value.length : 0;
  const definitionCount = fetchedDefinitions.status === "fulfilled" ? fetchedDefinitions.value.length : 0;
  const backgroundImage =
    bgImage.status === "fulfilled" ? bgImage.value : "/images/backgrounds/placeholder.jpg";
  const sectionImages = secImages.status === "fulfilled" ? secImages.value.slice(0, 4) : [];

  return (
    <main className="bg-page font-sans text-ink">

      {/* ── HERO ── */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-page">
        <Image
          src={backgroundImage}
          alt="Seranya"
          fill
          style={{ objectFit: "cover" }}
          priority
          sizes="100vw"
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-page" />

        <Reveal as="div" immediate className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mb-8">
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya"
              width={148}
              height={54}
              className="mx-auto drop-shadow"
            />
          </div>

          <h1 className="mb-4 font-serif text-5xl font-medium leading-tight text-white md:text-7xl text-shadow-sm">
            Seranya
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-white/90 md:text-xl text-shadow-sm">
            Un univers bouddhiste et yogique. Retrouvez la paix intérieure et fusionnez avec votre être profond.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/univers"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Explorer <LuArrowRight className="h-4 w-4" />
            </Link>
            <JoinCTA />
          </div>
        </Reveal>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 pt-1.5">
            <div className="h-2.5 w-1.5 rounded-full bg-white/70 [animation:breathe_2.6s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <Reveal className="relative z-10 overflow-hidden bg-page px-6 py-24">
        {sectionImages[0] && (
          <Image src={sectionImages[0]} alt="" fill style={{ objectFit: "cover" }} className="scale-110 opacity-[0.05]" />
        )}
        <div className="relative z-10 mx-auto max-w-5xl">
          <Eyebrow>L&apos;univers en chiffres</Eyebrow>
          <h2 className="mb-16 text-center font-serif text-3xl font-medium text-ink md:text-4xl">
            Ce que nous avons construit
          </h2>

          <StatsCounters
            initialPostCount={postCount}
            initialTutorialCount={tutorialCount}
            initialDefinitionCount={definitionCount}
          />
        </div>
      </Reveal>

      {/* ── DERNIÈRES ENTITÉS ── */}
      {units.length > 0 && (
        <Reveal className="relative overflow-hidden bg-sunken px-6 py-24">
          <div className="relative z-10 mx-auto max-w-6xl">
            <Eyebrow>Découverte</Eyebrow>
            <h2 className="mb-4 text-center font-serif text-3xl font-medium text-ink md:text-4xl">
              Dernières entités
            </h2>
            <p className="mx-auto mb-16 max-w-xl text-center text-ink-soft">
              Plongez dans notre encyclopédie et découvrez les entités de l&apos;univers Seranya.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {units.map((unit, i) => (
                <Link
                  key={unit.id}
                  href={`/univers/units/${unit.id}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-line shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-calm group-hover:scale-105"
                    style={{ backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                  {i === 0 && (
                    <div className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-sans uppercase tracking-[0.15em] text-ink-invert">
                      Nouveau
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center">
                    {unit.profileImage && (
                      <Image
                        src={unit.profileImage}
                        alt={unit.title}
                        width={64}
                        height={64}
                        className="mb-3 rounded-full object-cover ring-2 ring-white/60"
                      />
                    )}
                    <h3 className="font-serif text-lg font-medium text-white">{unit.title}</h3>
                    <p className="mt-1 text-sm text-white/80 line-clamp-2">{unit.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/univers"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-8 py-3.5 text-sm font-sans text-ink transition-all duration-200 hover:border-accent hover:text-accent"
              >
                Voir tout l&apos;univers <LuArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      )}

      {/* ── ENGAGEMENTS ── */}
      <Reveal className="relative overflow-hidden bg-page px-6 py-24">
        <div className="relative z-10 mx-auto max-w-5xl">
          <Eyebrow>Pourquoi Seranya</Eyebrow>
          <h2 className="mb-16 text-center font-serif text-3xl font-medium text-ink md:text-4xl">
            Notre engagement
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Sérénité",
                desc: "Un espace pensé pour la paix intérieure et le ressourcement, loin du bruit du monde.",
                icon: <LuLeaf className="h-6 w-6" />,
                href: "/univers",
              },
              {
                title: "Connaissance",
                desc: "Une encyclopédie vivante de l'univers bouddhiste et yogique, enrichie en permanence.",
                icon: <LuBookOpen className="h-6 w-6" />,
                href: "/encyclopedie",
              },
              {
                title: "Communauté",
                desc: "Des membres partageant les mêmes valeurs, unis par la quête du bonheur authentique.",
                icon: <LuUsers className="h-6 w-6" />,
                href: "/contact",
              },
            ].map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="flex h-full flex-col rounded-2xl border border-line bg-raised p-7 shadow-sm transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 text-accent">{f.icon}</div>
                <h3 className="mb-3 font-serif text-lg font-medium text-ink">{f.title}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── ÉVEIL ── */}
      <Reveal className="relative overflow-hidden border-t border-line bg-sunken px-6 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-soft/60 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-sans uppercase tracking-[0.22em] text-accent">
              Le pouvoir du yoga
            </p>
            <h2 className="mb-6 font-serif text-3xl font-medium text-ink md:text-4xl">Éveil</h2>
            <p className="mb-8 leading-relaxed text-ink-soft">
              Souplesse, force, respiration, sérénité intérieure : découvrez pourquoi le yoga
              transforme durablement le corps et l&apos;esprit, et comment il peut changer votre
              quotidien dès la première séance.
            </p>
            <Link
              href="/eveil"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-sans text-ink-invert shadow-md transition-all duration-300 ease-calm hover:-translate-y-0.5 hover:bg-accent-hover"
            >
              Découvrir Éveil <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <LuActivity className="h-6 w-6" />, label: "Le corps" },
              { icon: <LuBrain className="h-6 w-6" />, label: "L'esprit" },
              { icon: <LuWind className="h-6 w-6" />, label: "Le souffle" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-raised p-6 text-center shadow-sm"
              >
                <div className="text-accent">{item.icon}</div>
                <span className="text-xs font-sans uppercase tracking-[0.15em] text-ink-soft">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── TARIFICATION ── */}
      <PricingGate>
        <Reveal className="bg-page px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>Accès</Eyebrow>
            <h2 className="mb-16 text-center font-serif text-3xl font-medium text-ink md:text-4xl">
              Une tarification simple
            </h2>

            <div className="flex flex-col overflow-hidden rounded-3xl border border-line bg-raised shadow-md md:flex-row">
              <div className="flex-1 p-8 md:p-10">
                <h3 className="mb-4 font-serif text-xl font-medium text-ink">Abonnement mensuel</h3>
                <p className="mb-8 text-sm text-ink-soft">
                  Accédez à l&apos;intégralité du contenu exclusif : articles, ressources membres, et plus encore.
                </p>
                <div className="space-y-3">
                  {[
                    "Accès à tous les articles",
                    "Ressources exclusives des membres",
                    "T-shirt officiel (bientôt)",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-ink-soft">
                      <LuCheck className="flex-shrink-0 text-accent" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-sunken p-8 md:min-w-[220px] md:p-10">
                <span className="mb-2 text-sm font-sans text-ink-muted">Par mois</span>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-medium text-ink">5€</span>
                  <span className="text-sm text-ink-muted">/mois</span>
                </div>
                <Link
                  href="/subscription"
                  className="w-full rounded-full bg-accent px-6 py-3 text-center text-sm font-sans text-ink-invert transition-all duration-200 hover:bg-accent-hover"
                >
                  Commencer
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </PricingGate>

      {/* ── CTA FINAL ── */}
      <Reveal className="relative overflow-hidden bg-sunken px-6 py-28">
        <FooterCTA />
      </Reveal>

    </main>
  );
}
