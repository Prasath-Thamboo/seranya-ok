import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaArrowRight, FaLungs, FaBrain, FaHeartbeat } from "react-icons/fa";
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
      ? [...fetchedUnits.value].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 3)
      : [];

  const postCount = fetchedPosts.status === "fulfilled" ? fetchedPosts.value.length : 0;
  const tutorialCount = fetchedTutorials.status === "fulfilled" ? fetchedTutorials.value.length : 0;
  const definitionCount = fetchedDefinitions.status === "fulfilled" ? fetchedDefinitions.value.length : 0;
  const backgroundImage =
    bgImage.status === "fulfilled" ? bgImage.value : "/images/backgrounds/placeholder.jpg";
  const sectionImages = secImages.status === "fulfilled" ? secImages.value.slice(0, 4) : [];

  return (
    <main className="bg-black text-white font-kanit">

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <Image
          src={backgroundImage}
          alt="Seranya"
          fill
          style={{ objectFit: "cover" }}
          priority
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black" />

        <Reveal as="div" immediate className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="mb-8">
            <Image
              src="/logos/seranyaicon.png"
              alt="Seranya"
              width={160}
              height={58}
              className="mx-auto drop-shadow-2xl"
            />
          </div>

          <h1 className="font-iceberg uppercase text-5xl md:text-7xl font-bold tracking-widest mb-4 text-white text-shadow-sm">
            Seranya
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-xl mx-auto text-shadow-sm">
            Un univers bouddhiste et yogique. Atteignez la paix intérieure et fusionnez avec votre être profond.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/univers"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95"
            >
              Explorer <FaArrowRight className="w-4 h-4" />
            </Link>
            <JoinCTA />
          </div>
        </Reveal>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-2.5 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <Reveal className="relative z-10 py-20 px-6 overflow-hidden">
        {sectionImages[0] && (
          <Image src={sectionImages[0]} alt="" fill style={{ objectFit: "cover" }} className="opacity-10 blur-sm scale-110" />
        )}
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
            L&apos;univers en chiffres
          </p>
          <h2 className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-16">
            Ce que nous avons construit
          </h2>

          <StatsCounters
            initialPostCount={postCount}
            initialTutorialCount={tutorialCount}
            initialDefinitionCount={definitionCount}
          />
        </div>
      </Reveal>

      {/* ── RECENT UNITS ── */}
      {units.length > 0 && (
        <Reveal className="relative py-20 px-6 overflow-hidden">
          {sectionImages[1] && (
            <Image src={sectionImages[1]} alt="" fill style={{ objectFit: "cover" }} className="opacity-10 blur-sm scale-110" />
          )}
          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
              Découverte
            </p>
            <h2 className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-4">
              Dernières entités
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
              Plongez dans notre encyclopédie et découvrez les entités de l&apos;univers Seranya.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {units.map((unit, i) => (
                <Link
                  key={unit.id}
                  href={`/univers/units/${unit.id}`}
                  className="group block relative rounded-2xl overflow-hidden aspect-[3/4] border border-gray-800 hover:border-green-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {i === 0 && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-iceberg uppercase tracking-widest rounded-full">
                      Nouveau
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                    {unit.profileImage && (
                      <Image
                        src={unit.profileImage}
                        alt={unit.title}
                        width={64}
                        height={64}
                        className="rounded-full ring-2 ring-green-400/50 mb-3 object-cover"
                      />
                    )}
                    <h3 className="font-iceberg uppercase text-white font-bold text-lg">{unit.title}</h3>
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{unit.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/univers"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-gray-700 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:border-green-400 hover:text-green-400 transition-all duration-200"
              >
                Voir tout l&apos;univers <FaArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      )}

      {/* ── FEATURES ── */}
      <Reveal className="relative py-20 px-6 overflow-hidden">
        {sectionImages[2] && (
          <Image src={sectionImages[2]} alt="" fill style={{ objectFit: "cover" }} className="opacity-10 blur-sm scale-110" />
        )}
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
            Pourquoi Seranya
          </p>
          <h2 className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-16">
            Notre engagement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Sérénité",
                desc: "Un espace pensé pour la paix intérieure et le ressourcement, loin du bruit du monde.",
                icon: "✦",
                href: "/univers",
              },
              {
                title: "Connaissance",
                desc: "Une encyclopédie vivante de l'univers bouddhiste et yogique, enrichie en permanence.",
                icon: "◈",
                href: "/encyclopedie",
              },
              {
                title: "Communauté",
                desc: "Des membres partageant les mêmes valeurs, unis par la quête du bonheur authentique.",
                icon: "❋",
                href: "/contact",
              },
            ].map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="h-full flex flex-col p-6 rounded-2xl border border-gray-800 bg-gray-950 hover:border-green-400/40 transition-colors"
              >
                <div className="text-green-400 text-2xl mb-4">{f.icon}</div>
                <h3 className="font-iceberg uppercase text-white text-lg mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── ÉVEIL (bienfaits du yoga) ── */}
      <Reveal className="relative py-20 px-6 overflow-hidden border-t border-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
              Le pouvoir du yoga
            </p>
            <h2 className="text-3xl md:text-4xl font-iceberg uppercase text-white mb-6">
              Éveil
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Souplesse, force, respiration, sérénité intérieure : découvrez pourquoi
              le yoga transforme durablement le corps et l&apos;esprit, et comment il
              peut changer votre quotidien dès la première séance.
            </p>
            <Link
              href="/eveil"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95"
            >
              Découvrir Éveil <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <FaHeartbeat className="w-6 h-6" />, label: "Le corps" },
              { icon: <FaBrain className="w-6 h-6" />, label: "L'esprit" },
              { icon: <FaLungs className="w-6 h-6" />, label: "Le souffle" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-800 bg-gray-950 text-center"
              >
                <div className="text-green-400">{item.icon}</div>
                <span className="text-gray-300 font-kanit uppercase text-xs tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── PRICING ── */}
      <PricingGate>
        <Reveal className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-green-400 font-iceberg uppercase tracking-widest text-sm mb-2">
              Accès
            </p>
            <h2 className="text-3xl md:text-4xl font-iceberg uppercase text-center text-white mb-16">
              Une tarification simple
            </h2>

            <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden flex flex-col md:flex-row">
              <div className="flex-1 p-8 md:p-10">
                <h3 className="font-iceberg uppercase text-xl text-white mb-4">Abonnement mensuel</h3>
                <p className="text-gray-400 text-sm mb-8">
                  Accédez à l&apos;intégralité du contenu exclusif : articles, ressources membres, et plus encore.
                </p>
                <div className="space-y-3">
                  {[
                    "Accès à tous les articles",
                    "Ressources exclusives des membres",
                    "T-shirt officiel (bientôt)",
                  ].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                      <FaCheck className="text-green-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-8 md:p-10 bg-gray-900 md:min-w-[220px]">
                <span className="text-gray-400 text-sm font-kanit mb-2">Par mois</span>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold font-iceberg text-white">5€</span>
                  <span className="text-gray-400 text-sm">/mois</span>
                </div>
                <Link
                  href="/subscription"
                  className="w-full text-center px-6 py-3 bg-green-500 text-white font-iceberg uppercase tracking-widest text-sm rounded-md hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-200 active:scale-95"
                >
                  Commencer
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </PricingGate>

      {/* ── CTA FINAL ── */}
      <Reveal className="relative py-32 px-6 overflow-hidden">
        {sectionImages[3] && (
          <Image src={sectionImages[3]} alt="" fill style={{ objectFit: "cover" }} className="opacity-10 blur-sm scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <FooterCTA />
      </Reveal>

    </main>
  );
}
