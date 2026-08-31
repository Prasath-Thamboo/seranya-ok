"use client";

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchClassById } from "@/lib/queries/ClassQueries";
import { ClassModel } from "@/lib/models/ClassModels";
import Masonry from "react-masonry-css";
import { LuBookOpen, LuImage, LuNewspaper } from "react-icons/lu";
import Badge from "@/components/Badge";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { Image as AntImage, Skeleton } from "antd";
import { getImageUrl } from "@/utils/image";
import { UploadModel } from "@/lib/models/ClassModels";
import MiniLoader from "@/components/MiniLoader";
import { ColorContext } from "@/context/ColorContext";
import CommentSection from "@/components/CommentSection";
import SubscriptionLock from "@/components/SubscriptionLock";

const ClassDetailPage = () => {
  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

  const { color, setColor } = useContext(ColorContext);
  const [classe, setClasse] = useState<ClassModel | null>(null);
  const [activeSection, setActiveSection] = useState("biographie");
  const [showContent, setShowContent] = useState(true);
  const [relatedUnits, setRelatedUnits] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingClasse, setLoadingClasse] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasse = async () => {
      if (id) {
        try {
          const fetchedClasse = await fetchClassById(id);
          if (fetchedClasse) {
            const findUpload = (type: string) =>
              fetchedClasse.uploads?.find((u: UploadModel) => u.type === type);

            fetchedClasse.headerImage = findUpload("HEADERIMAGE") ? getImageUrl(findUpload("HEADERIMAGE")!.path) : "";
            fetchedClasse.profileImage = findUpload("PROFILEIMAGE") ? getImageUrl(findUpload("PROFILEIMAGE")!.path) : "";
            fetchedClasse.footerImage = findUpload("FOOTERIMAGE") ? getImageUrl(findUpload("FOOTERIMAGE")!.path) : "";

            if (fetchedClasse.units && fetchedClasse.units.length > 0) {
              setRelatedUnits(
                fetchedClasse.units.map((unit: any) => {
                  const up = unit.uploads?.find((u: any) => u.type === "PROFILEIMAGE");
                  return {
                    id: unit.id,
                    title: unit.title,
                    profileImage: up ? getImageUrl(up.path) : null,
                    color: unit.color || null,
                    type: unit.type || "UNIT",
                  };
                })
              );
            }

            setClasse(fetchedClasse);
            setColor(fetchedClasse.color || "var(--accent)");
          }
        } catch (error) {
          console.error("Error fetching class:", error);
        } finally {
          setLoadingClasse(false);
        }
      }
    };

    const fetchUserSubscriptionStatus = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setIsSubscribed(currentUser.isSubscribed);
      } catch (error) {
        console.error("Failed to fetch user subscription status:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchClasse();
    fetchUserSubscriptionStatus();
  }, [id, setColor]);

  const handleMenuClick = (section: string) => {
    setShowContent(false);
    setTimeout(() => {
      setActiveSection(section);
      setShowContent(true);
    }, 350);
  };

  const accent = color && color.startsWith("#") ? color : "var(--accent)";

  const SECTIONS = [
    { key: "biographie", label: "Biographie", icon: <LuBookOpen className="h-5 w-5" /> },
    { key: "nouvelles", label: "Nouvelles", icon: <LuNewspaper className="h-5 w-5" /> },
    { key: "galerie", label: "Galerie", icon: <LuImage className="h-5 w-5" /> },
  ];

  return (
    <div className="relative min-h-screen w-full bg-page font-sans text-ink">
      {/* Bandeau image */}
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-sunken">
        {!loadingClasse && classe?.headerImage && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${classe.headerImage})` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-transparent to-page" />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {loadingClasse ? (
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: 280 }} />
          ) : (
            <>
              <h1 className="font-serif text-4xl font-medium text-white text-shadow-sm sm:text-5xl lg:text-6xl">
                {classe?.title}
              </h1>
              {classe?.subtitle && (
                <p className="mt-4 max-w-xl text-base text-white/90 text-shadow-sm sm:text-lg">{classe.subtitle}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div className="relative z-20 -mt-24 flex justify-center">
        <div
          className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-4 border-page bg-raised shadow-lg"
          style={{ boxShadow: `0 0 0 3px ${accent}33, 0 20px 50px rgba(43,36,29,0.14)` }}
        >
          {loadingClasse ? (
            <MiniLoader />
          ) : (
            <AntImage
              src={classe?.profileImage || ""}
              alt={`${classe?.title}`}
              width={176}
              height={176}
              className="h-full w-full rounded-full object-cover"
              preview={false}
            />
          )}
        </div>
      </div>

      {!loadingClasse && classe?.quote && (
        <blockquote className="mx-auto mt-12 max-w-2xl px-6 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-ink-soft">&laquo; {classe.quote} &raquo;</p>
        </blockquote>
      )}

      {!loadingClasse && classe?.intro && (
        <div className="mx-auto mt-10 max-w-3xl px-6 text-center">
          <p className="text-lg italic leading-relaxed text-ink-muted">{classe.intro}</p>
        </div>
      )}

      <div className="mx-auto mt-16 max-w-6xl px-6 lg:flex lg:items-start lg:gap-10">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:w-1/4">
          <div className="rounded-2xl border border-line bg-raised p-6 shadow-sm">
            <div className="flex flex-col items-center gap-4">
              {loadingClasse ? (
                <Skeleton.Avatar active size={96} shape="circle" />
              ) : (
                <div
                  className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
                  style={{ boxShadow: `0 0 0 2px ${accent}33` }}
                >
                  <AntImage
                    src={classe?.profileImage || ""}
                    alt={`${classe?.title}`}
                    width={96}
                    height={96}
                    className="h-full w-full rounded-full object-cover"
                    preview={false}
                  />
                </div>
              )}
              <h2 className="font-serif text-lg font-medium text-ink">{classe?.title}</h2>
            </div>

            <nav className="mt-8">
              <ul className="space-y-2">
                {SECTIONS.map((s) => {
                  const isActive = activeSection === s.key;
                  return (
                    <li key={s.key}>
                      <button
                        onClick={() => handleMenuClick(s.key)}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-200 ${
                          isActive
                            ? "border-l-2 bg-accent-soft text-accent"
                            : "border-l-2 border-transparent text-ink-soft hover:bg-sunken hover:text-ink"
                        }`}
                        style={isActive ? { borderLeftColor: accent } : undefined}
                      >
                        {s.icon}
                        <span className="font-sans text-sm">{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {relatedUnits.length > 0 && (
              <div className="mt-8 space-y-6 border-t border-line pt-6">
                <h3 className="text-center font-sans text-xs uppercase tracking-[0.18em] text-ink-muted">Unités liées</h3>
                {relatedUnits.map((ru) => (
                  <Link href={`/univers/units/${ru.id}`} key={ru.id}>
                    <div className="group flex cursor-pointer flex-col items-center">
                      <div
                        className="mb-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105"
                        style={{ boxShadow: `0 0 0 2px ${ru.color || accent}33` }}
                      >
                        <AntImage
                          src={ru.profileImage}
                          alt={ru.title}
                          width={80}
                          height={80}
                          className="h-full w-full rounded-full object-cover"
                          preview={false}
                        />
                      </div>
                      <h3 className="font-serif text-sm font-medium text-ink">{ru.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Section active */}
        <div className={`mt-10 lg:mt-0 lg:w-3/4 transition-opacity duration-500 ${showContent ? "opacity-100" : "opacity-0"}`}>
          {activeSection === "biographie" && (
            <section className="mx-auto max-w-3xl">
              <h2 className="mb-8 font-serif text-3xl font-medium text-ink">Biographie</h2>
              {loadingClasse ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <div
                  className="text-lg leading-relaxed text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-medium first-letter:text-ink [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: classe?.bio || "<p>Aucune biographie disponible.</p>" }}
                />
              )}
            </section>
          )}

          {activeSection === "galerie" && (
            <section className="mx-auto max-w-3xl">
              <h2 className="mb-8 font-serif text-3xl font-medium text-ink">Galerie</h2>
              <Masonry breakpointCols={{ default: 3, 1100: 2, 700: 1 }} className="-ml-4 flex w-auto" columnClassName="pl-4">
                {classe?.gallery && classe.gallery.length > 0 ? (
                  classe.gallery.map((imgUrl, index) => (
                    <div key={index} className="relative mb-4">
                      <AntImage
                        src={getImageUrl(imgUrl)}
                        alt={`${classe.title} — image ${index + 1}`}
                        width="100%"
                        className="w-full rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                        style={{ objectFit: "cover", aspectRatio: "16/9" }}
                        preview={{ src: imgUrl }}
                      />
                    </div>
                  ))
                ) : (
                  <Skeleton.Image active />
                )}
              </Masonry>
            </section>
          )}

          {activeSection === "nouvelles" && (
            <section className="mx-auto max-w-3xl">
              <h2 className="mb-8 font-serif text-3xl font-medium text-ink">Nouvelles</h2>
              {loadingUser || loadingClasse ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : !isSubscribed ? (
                <div className="relative min-h-[320px] rounded-2xl border border-line bg-sunken">
                  <SubscriptionLock message="Les nouvelles sont réservées aux abonnés" minHeight={320} />
                </div>
              ) : classe?.story ? (
                <div
                  className="text-lg leading-relaxed text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:font-medium first-letter:text-ink [&_p]:mb-4"
                  dangerouslySetInnerHTML={{ __html: classe.story }}
                />
              ) : (
                <p className="text-ink-muted">Pas de nouvelles pour le moment.</p>
              )}
            </section>
          )}
        </div>
      </div>

      {classe && (
        <div className="mx-auto max-w-4xl px-6 pb-20">
          <CommentSection classId={classe.id} />
        </div>
      )}
    </div>
  );
};

export default ClassDetailPage;
