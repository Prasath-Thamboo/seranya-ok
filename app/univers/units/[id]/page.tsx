"use client";

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import Masonry from "react-masonry-css";
import { FaBook, FaGithub, FaImage, FaInstagram, FaLock, FaNewspaper, FaTwitter } from "react-icons/fa";
import Badge from "@/components/Badge";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { Image as AntImage, Skeleton } from "antd";
import { getImageUrl } from "@/utils/image";
import { UploadType, ClassModel as ImportedClassModel, UploadModel } from "@/lib/models/ClassModels";
import Footer from "@/components/Footer"; 
import MiniLoader from "@/components/MiniLoader";
import { ColorContext } from "@/context/ColorContext";

interface ClassModel {
  id: string;
  title: string;
  profileImage: string;
  color?: string | null;
}

const UnitDetailPage = () => {
  const params = useParams();
  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : null;

  const { color, setColor } = useContext(ColorContext);
  const [unit, setUnit] = useState<UnitModel | null>(null);
  const [activeSection, setActiveSection] = useState("biographie");
  const [showContent, setShowContent] = useState(true);
  const [relatedClasses, setRelatedClasses] = useState<ClassModel[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingUnit, setLoadingUnit] = useState<boolean>(true);

  useEffect(() => {
    const fetchUnit = async () => {
      if (id) {
        try {
          const fetchedUnit = await fetchUnitById(parseInt(id, 10));
          if (fetchedUnit) {
            if (fetchedUnit.classes && fetchedUnit.classes.length > 0) {
              const classesWithImages: ClassModel[] = fetchedUnit.classes.map((cls) => {
                const profileImageUpload = cls.uploads.find(
                  (upload: UploadModel) => upload.type === UploadType.PROFILEIMAGE
                );
                const profileImage = profileImageUpload ? profileImageUpload.path : null;

                return {
                  id: cls.id,
                  title: cls.title,
                  profileImage: getImageUrl(profileImage),
                  color: cls.color || null,
                };
              });

              setRelatedClasses(classesWithImages);
            }
            setUnit(fetchedUnit);
            // Définir la couleur dans le contexte
            if (fetchedUnit.color) {
              setColor(fetchedUnit.color);
            } else {
              setColor("#008000"); // Teal par défaut
            }
          }
        } catch (error) {
          console.error("Error fetching unit:", error);
        } finally {
          setLoadingUnit(false);
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

    fetchUnit();
    fetchUserSubscriptionStatus();
  }, [id, setColor]);

  const handleSubscriptionClick = () => {
    window.location.href = "/subscription";
  };

  const handleMenuClick = (section: string) => {
    setShowContent(false);
    setTimeout(() => {
      setActiveSection(section);
      setShowContent(true);
    }, 500);
  };

  const loading = loadingUnit || loadingUser;

  return (
    <div className="relative w-full min-h-screen text-white font-iceberg">
      {/* Background Header */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getImageUrl(unit?.headerImage || "")})`,
          backgroundAttachment: "fixed",
          filter: "brightness(25%)",
        }}
      />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative h-screen flex items-center justify-center">
          {loadingUnit ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getImageUrl(unit?.headerImage || "")})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent"></div>

              <div
                className="flex flex-col items-center text-center"
                style={{
                  boxShadow: "0px 60vh 60vh -60vh rgba(0, 0, 0, 0.95)",
                }}
              >
                <h1 className="text-7xl font-iceberg uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {unit?.title || <Skeleton active title={false} paragraph={{ rows: 1 }} />}
                </h1>
                <Badge role={unit?.type || "DEFAULT"} />
                {unit?.subtitle ? (
                  <p className="mt-4 text-xl font-iceberg text-gray-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {unit.subtitle}
                  </p>
                ) : (
                  <Skeleton active paragraph={{ rows: 1 }} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Profil Image Principale */}
        <div className="absolute left-1/2 top-3/5 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div
            className="w-72 h-72 rounded-full overflow-hidden border-4 border-black flex items-center justify-center"
            style={{
              boxShadow: unit?.color
                ? `0 0 20px ${unit.color}, 0 0 40px ${unit.color}, 0 0 60px ${unit.color}`
                : "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            {loadingUnit ? (
              <MiniLoader />
            ) : (
              <AntImage
                src={getImageUrl(unit?.profileImage || "")}
                alt={`${unit?.title} Profile`}
                width={288}
                height={288}
                className="w-full h-full object-cover rounded-full"
                preview={false}
              />
            )}
          </div>
        </div>

        {/* Citation Section */}
        {loadingUnit ? (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : unit?.quote ? (
          <blockquote className="relative text-center max-w-lg mx-auto mt-48 md:mt-56 lg:mt-64">
            <div className="relative z-10">
              <p className="text-xl text-gray-800">
                <em className="relative">
                  <svg
                    className="absolute -top-8 -left-8 w-16 h-16 text-gray-100 sm:h-24 sm:w-24 dark:text-neutral-700"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <span className="relative z-10 dark:text-white">{unit.quote}</span>
                </em>
              </p>
            </div>
          </blockquote>
        ) : null}

        {/* Introduction Section */}
        {loadingUnit ? (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : unit?.intro ? (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-3xl text-gray-400 italic text-lg">
              <p>{unit.intro}</p>
            </div>
          </div>
        ) : null}

        {/* Main Content */}
        <div className="lg:flex lg:items-start lg:justify-center lg:mt-12">
          {/* Sidebar */}
          <div className="lg:w-1/4 p-4 lg:fixed top-0 w-full lg:max-w-sm lg:max-h-screen lg:h-auto flex justify-center z-10 lg:sticky lg:top-24">
            <div className="bg-black p-6 rounded-lg shadow-lg w-full">
              {/* Profil Image et Titre */}
              <div className="flex flex-col items-center space-y-4">
                {loadingUnit ? (
                  <Skeleton.Avatar active size="large" shape="circle" />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center"
                    style={{
                      boxShadow: `${color} 0 0 10px, ${color} 0 0 20px, ${color} 0 0 30px`,
                    }}
                  >
                    <AntImage
                      src={getImageUrl(unit?.profileImage || "")}
                      alt={`${unit?.title} Profile`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                      preview={false}
                    />
                  </div>
                )}
                <h2 className="text-xl font-iceberg text-white mt-2">
                  {unit?.title || <Skeleton active title={false} paragraph={{ rows: 1 }} />}
                </h2>
                <Badge role={unit?.type || "DEFAULT"} />
              </div>

              {/* Navigation des Onglets */}
              <nav className="mt-8">
                <ul className="space-y-4">
                  {/* Biographie */}
                  <li>
                    <button
                      className={`flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 rounded hover:bg-gray-700 hover:text-white ${
                        activeSection === "biographie"
                          ? "border-l-4"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleMenuClick("biographie")}
                      style={{
                        borderLeftColor: activeSection === "biographie" ? color : "transparent",
                        boxShadow: activeSection === "biographie" ? `0 0 10px ${color}` : "none",
                      }}
                    >
                      <FaBook className="text-xl" />
                      <span className="font-iceberg">Biographie</span>
                    </button>
                  </li>

                  {/* Nouvelles */}
                  <li>
                    <button
                      className={`flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 rounded hover:bg-gray-700 hover:text-white ${
                        activeSection === "nouvelles"
                          ? "border-l-4"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleMenuClick("nouvelles")}
                      style={{
                        borderLeftColor: activeSection === "nouvelles" ? color : "transparent",
                        boxShadow: activeSection === "nouvelles" ? `0 0 10px ${color}` : "none",
                      }}
                    >
                      <FaNewspaper className="text-xl" />
                      <span className="font-iceberg">Nouvelles</span>
                    </button>
                  </li>

                  {/* Galerie */}
                  <li>
                    <button
                      className={`flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 rounded hover:bg-gray-700 hover:text-white ${
                        activeSection === "galerie"
                          ? "border-l-4"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleMenuClick("galerie")}
                      style={{
                        borderLeftColor: activeSection === "galerie" ? color : "transparent",
                        boxShadow: activeSection === "galerie" ? `0 0 10px ${color}` : "none",
                      }}
                    >
                      <FaImage className="text-xl" />
                      <span className="font-iceberg">Galerie</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Classes Liées */}
              {relatedClasses.length > 0 && (
                <div className="mt-8">
                  {relatedClasses.map((relatedClass) => (
                    <div key={relatedClass.id} className="flex flex-col items-center mb-6">
                      {loadingUnit ? (
                        <MiniLoader />
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-2"
                          style={{
                            boxShadow: relatedClass.color
                              ? `0 0 10px ${relatedClass.color}, 0 0 20px ${relatedClass.color}`
                              : `0 0 10px ${color}, 0 0 20px ${color}`,
                          }}
                        >
                          <AntImage
                            src={getImageUrl(relatedClass.profileImage)}
                            alt={`Classe ${relatedClass.title} Profile`}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-full"
                            preview={false}
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-iceberg uppercase text-white">
                        {relatedClass.title}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div
            className={`lg:w-3/4 lg:ml-[5%] p-6 transition-opacity duration-1000 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            {activeSection === "biographie" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16 text-left">
                  <h2 className="text-3xl font-bold font-iceberg text-white mb-8">
                    Biographie
                  </h2>
                  {loadingUnit ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                  ) : (
                    <div
                      className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                      dangerouslySetInnerHTML={{
                        __html:
                          unit?.bio || "<p>Aucune biographie disponible.</p>",
                      }}
                    />
                  )}
                </div>
              </div>
            )}

            {activeSection === "galerie" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16">
                  <h2 className="text-3xl font-bold font-iceberg text-white mb-8 text-left">
                    Galerie
                  </h2>
                  <Masonry
                    breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                    className="flex -ml-4 w-auto"
                    columnClassName="pl-4"
                  >
                    {unit?.gallery && unit.gallery.length > 0 ? (
                      unit.gallery.map((imgUrl, index) => (
                        <div key={index} className="relative mb-4">
                          {loadingUnit ? (
                            <MiniLoader />
                          ) : (
                            <AntImage
                              src={getImageUrl(imgUrl)}
                              alt={`${unit.title} Gallery Image ${index + 1}`}
                              width="100%"
                              height="100%"
                              className="w-full h-auto rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                              style={{
                                objectFit: "cover",
                                aspectRatio: "16/9",
                              }}
                              preview={{
                                src: imgUrl,
                              }}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <Skeleton.Image active />
                    )}
                  </Masonry>
                </div>
              </div>
            )}

            {activeSection === "nouvelles" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16 text-left">
                  <h2 className="text-3xl font-bold font-iceberg text-white mb-8">
                    Nouvelles
                  </h2>

                  {loadingUser || loadingUnit ? (
                    <Skeleton active paragraph={{ rows: 3 }} />
                  ) : (
                    <>
                      {!isSubscribed && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20 h-full min-h-[300px]">
                          <FaLock className="text-8xl text-gray-400 mb-6" />
                          <p className="text-2xl text-white mb-4">
                            Contenu réservé aux abonnés
                          </p>
                          <button
                            onClick={handleSubscriptionClick}
                            className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-lg hover:bg-indigo-500 transition-colors duration-200"
                          >
                            S&apos;abonner
                          </button>
                        </div>
                      )}

                      {isSubscribed && unit?.story ? (
                        <div
                          className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                          dangerouslySetInnerHTML={{
                            __html: unit.story,
                          }}
                        />
                      ) : isSubscribed && !unit?.story ? (
                        <p className="text-gray-500 text-lg">
                          Pas de nouvelles pour le moment.
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative block text-white font-iceberg uppercase">
        {/* Background image with better containment */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {unit?.footerImage && (
            <AntImage
              src={getImageUrl(unit.footerImage)}
              alt="Footer background"
              className="w-full h-full"
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                objectPosition: "center center",
                overflow: "hidden"
              }}
            />
          )}
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Footer content */}
        <div className="relative z-10 py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10 border-t-2 border-b-2 border-gray-800">
          <div className="flex-col flex items-center">
            {/* Logo */}
            <a href="#" className="mb-8 inline-block max-w-full">
              {loadingUnit ? (
                <Skeleton.Avatar active size="large" shape="square" />
              ) : (
                <AntImage
                  src="/logos/seranyaicon.png"
                  alt="Logo Seranya"
                  width={160}
                  height={40}
                  className="inline-block object-contain"
                />
              )}
            </a>

            {/* Menu */}
            <div className="text-center font-semibold">
              {loadingUnit ? (
                <Skeleton active paragraph={{ rows: 1 }} />
              ) : (
                <>
                  <a href="/about" className="inline-block px-6 py-2 font-normal transition hover:text-blue-400">À propos</a>
                  <a href="/mentions" className="inline-block px-6 py-2 font-normal transition hover:text-blue-400">Mentions légales</a>
                  <a href="#" className="inline-block px-6 py-2 font-normal transition hover:text-blue-400">© Copyright</a>
                </>
              )}
            </div>

            <div className="mb-8 mt-8 border-b border-gray-500 w-48"></div>

            {/* Social media links */}
            <div className="mb-12 grid grid-cols-3 grid-flow-col w-full max-w-52 gap-3 items-start">
              {loadingUnit ? (
                <Skeleton.Avatar active size="large" shape="circle" />
              ) : (
                <>
                  <a href="https://github.com" className="mx-auto flex-col flex items-center text-white">
                    <FaGithub size={32} />
                  </a>
                  <a href="https://twitter.com" className="mx-auto flex-col flex items-center text-white">
                    <FaTwitter size={32} />
                  </a>
                  <a href="https://instagram.com" className="mx-auto flex-col flex items-center text-white">
                    <FaInstagram size={32} />
                  </a>
                </>
              )}
            </div>

            {loadingUnit ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <p className="text-sm sm:text-base">© Copyright 2021. Tous droits réservés.</p>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnitDetailPage;
