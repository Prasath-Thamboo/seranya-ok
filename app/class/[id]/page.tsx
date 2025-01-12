"use client";

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { fetchClassById } from "@/lib/queries/ClassQueries";
import { ClassModel } from "@/lib/models/ClassModels";
import Masonry from "react-masonry-css";
import {
  FaBook,
  FaGithub,
  FaImage,
  FaInstagram,
  FaLock,
  FaNewspaper,
  FaTwitter,
} from "react-icons/fa";
import Badge from "@/components/Badge";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { Image as AntImage, Skeleton } from "antd";
import { getImageUrl } from "@/utils/image";
import { UploadType, UploadModel } from "@/lib/models/ClassModels";
import MiniLoader from "@/components/MiniLoader";
import { ColorContext } from "@/context/ColorContext";
import Footer from "@/components/Footer"; // Assurez-vous que ce composant existe

const ClassDetailPage = () => {
  const params = useParams();
  const id = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : null;

  const { color, setColor } = useContext(ColorContext);
  const [classe, setClasse] = useState<ClassModel | null>(null);
  const [activeSection, setActiveSection] = useState("biographie");
  const [showContent, setShowContent] = useState(true);
  const [relatedUnits, setRelatedUnits] = useState<any[]>([]); // Remplacez `any` par le type approprié
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [loadingClasse, setLoadingClasse] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasse = async () => {
      if (id) {
        try {
          const fetchedClasse = await fetchClassById(id);
          if (fetchedClasse) {
            // Si la classe a des unités associées, les définir
            if (fetchedClasse.units && fetchedClasse.units.length > 0) {
              const unitsWithImages = fetchedClasse.units.map((unit: any) => {
                return {
                  id: unit.id,
                  title: unit.title,
                  profileImage: getImageUrl(unit.profileImage),
                  color: unit.color || null,
                  type: unit.type || "UNIT",
                };
              });
              setRelatedUnits(unitsWithImages);
            }
            setClasse(fetchedClasse);
            // Définir la couleur dans le contexte
            if (fetchedClasse.color) {
              setColor(fetchedClasse.color);
            } else {
              setColor("#008000"); // Couleur par défaut
            }
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

  const loading = loadingClasse || loadingUser;

  return (
    <div className="relative w-full min-h-screen text-white font-iceberg">
      {/* Background Header */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getImageUrl(classe?.headerImage || "")})`,
          backgroundAttachment: "fixed",
          filter: "brightness(25%)",
        }}
      />
      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative h-screen flex items-center justify-center">
          {loadingClasse ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getImageUrl(
                    classe?.headerImage || ""
                  )})`,
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
                  {classe?.title || (
                    <Skeleton active title={false} paragraph={{ rows: 1 }} />
                  )}
                </h1>
                {/* Vous pouvez ajouter un badge si nécessaire */}
                {classe?.subtitle ? (
                  <p className="mt-4 text-xl font-iceberg text-gray-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {classe.subtitle}
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
              boxShadow: classe?.color
                ? `0 0 20px ${classe.color}, 0 0 40px ${classe.color}, 0 0 60px ${classe.color}`
                : "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            {loadingClasse ? (
              <MiniLoader />
            ) : (
              <AntImage
                src={getImageUrl(classe?.profileImage || "")}
                alt={`${classe?.title} Profile`}
                width={288}
                height={288}
                className="w-full h-full object-cover rounded-full"
                preview={false}
              />
            )}
          </div>
        </div>

        {/* Citation Section */}
        {loadingClasse ? (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : classe?.quote ? (
          <blockquote className="relative text-center max-w-lg mx-auto mt-48 md:mt-56 lg:mt-64">
            <div className="relative z-10">
              <p className="text-xl text-gray-800">
                <em className="relative">
                  {/* Icône de citation */}
                  <span className="relative z-10 dark:text-white">
                    {classe.quote}
                  </span>
                </em>
              </p>
            </div>
          </blockquote>
        ) : null}

        {/* Introduction Section */}
        {loadingClasse ? (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : classe?.intro ? (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-3xl text-gray-400 italic text-lg">
              <p>{classe.intro}</p>
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
                {loadingClasse ? (
                  <Skeleton.Avatar active size="large" shape="circle" />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center"
                    style={{
                      boxShadow: `${color} 0 0 10px, ${color} 0 0 20px, ${color} 0 0 30px`,
                    }}
                  >
                    <AntImage
                      src={getImageUrl(classe?.profileImage || "")}
                      alt={`${classe?.title} Profile`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover rounded-full"
                      preview={false}
                    />
                  </div>
                )}
                <h2 className="text-xl font-iceberg text-white mt-2">
                  {classe?.title || (
                    <Skeleton active title={false} paragraph={{ rows: 1 }} />
                  )}
                </h2>
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
                        borderLeftColor:
                          activeSection === "biographie" ? color : "transparent",
                        boxShadow:
                          activeSection === "biographie"
                            ? `0 0 10px ${color}`
                            : "none",
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
                        borderLeftColor:
                          activeSection === "nouvelles" ? color : "transparent",
                        boxShadow:
                          activeSection === "nouvelles"
                            ? `0 0 10px ${color}`
                            : "none",
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
                        borderLeftColor:
                          activeSection === "galerie" ? color : "transparent",
                        boxShadow:
                          activeSection === "galerie"
                            ? `0 0 10px ${color}`
                            : "none",
                      }}
                    >
                      <FaImage className="text-xl" />
                      <span className="font-iceberg">Galerie</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Unités Liées */}
              {relatedUnits.length > 0 && (
                <div className="mt-8">
                  {relatedUnits.map((relatedUnit) => (
                    <div
                      key={relatedUnit.id}
                      className="flex flex-col items-center mb-6"
                    >
                      {loadingClasse ? (
                        <MiniLoader />
                      ) : (
                        <div
                          className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center mb-2"
                          style={{
                            boxShadow: relatedUnit.color
                              ? `0 0 10px ${relatedUnit.color}, 0 0 20px ${relatedUnit.color}`
                              : `0 0 10px ${color}, 0 0 20px ${color}`,
                          }}
                        >
                          <AntImage
                            src={getImageUrl(relatedUnit.profileImage)}
                            alt={`Unité ${relatedUnit.title} Profile`}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-full"
                            preview={false}
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-iceberg uppercase text-white">
                        {relatedUnit.title}
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
                  {loadingClasse ? (
                    <Skeleton active paragraph={{ rows: 5 }} />
                  ) : (
                    <div
                      className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                      dangerouslySetInnerHTML={{
                        __html:
                          classe?.bio || "<p>Aucune biographie disponible.</p>",
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
                    {classe?.gallery && classe.gallery.length > 0 ? (
                      classe.gallery.map((imgUrl, index) => (
                        <div key={index} className="relative mb-4">
                          {loadingClasse ? (
                            <MiniLoader />
                          ) : (
                            <AntImage
                              src={getImageUrl(imgUrl)}
                              alt={`${classe.title} Gallery Image ${
                                index + 1
                              }`}
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

                  {loadingUser || loadingClasse ? (
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

                      {isSubscribed && classe?.story ? (
                        <div
                          className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                          dangerouslySetInnerHTML={{
                            __html: classe.story,
                          }}
                        />
                      ) : isSubscribed && !classe?.story ? (
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
      <Footer />
    </div>
  );
};

export default ClassDetailPage;
