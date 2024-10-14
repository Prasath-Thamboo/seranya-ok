"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUnitById } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import Masonry from "react-masonry-css";
import { FaBook, FaImage, FaLock, FaNewspaper } from "react-icons/fa";
import Badge from "@/components/Badge";
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { Image as AntImage } from "antd"; // Importation du composant Image d'Ant Design
import ClientLayout from "@/components/ClientLayout";
import { getImageUrl } from "@/utils/image";
import { UploadType, ClassModel as ImportedClassModel, UploadModel } from "@/lib/models/ClassModels";

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

  const [unit, setUnit] = useState<UnitModel | null>(null);
  const [activeSection, setActiveSection] = useState("biographie");
  const [showContent, setShowContent] = useState(true);
  const [relatedClasses, setRelatedClasses] = useState<ClassModel[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

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
          }
        } catch (error) {
          console.error("Error fetching unit:", error);
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
  }, [id]);

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

  if (!unit) {
    return <div className="text-center text-white">Chargement...</div>;
  }

  const unitClass = unit.classes && unit.classes.length > 0 ? unit.classes[0] : null;

  return (
    <ClientLayout footerImage={unit.footerImage || undefined} disableFooter>
      <div className="relative w-full min-h-screen text-white font-kanit">
        {/* Image de Fond Header avec Filtre de Luminosité */}
        <div
          className="fixed inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${getImageUrl(unit.headerImage)})`,
            backgroundAttachment: "fixed",
            filter: "brightness(25%)",
          }}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-cover bg-center">
          <div className="absolute bottom-0 w-full h-[60vh] bg-gradient-to-t from-black/95 to-transparent"></div>
        </div>

        {/* Conteneur Principal */}
        <div className="relative z-10">
          {/* Titre et Badge */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{
              boxShadow: "0px 60vh 60vh -60vh rgba(0, 0, 0, 0.95)",
            }}
          >
            <h1 className="text-7xl font-iceberg uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {unit.title}
            </h1>
            <Badge role={unit.type} />
            {unit.subtitle && (
              <p className="mt-4 text-xl font-kanit text-gray-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {unit.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Grande Image de Profil Centrée avec Ombre Noire */}
        <div className="relative flex justify-center -mt-24 z-10">
          <div className="relative w-72 h-72">
            <AntImage
              src={getImageUrl(unit.profileImage)}
              alt={`${unit.title} Profile`}
              width={288}
              height={288}
              className="w-full h-full object-cover rounded-full shadow-custom-black"
              preview={false}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/backgrounds/placeholder.jpg";
              }}
            />
          </div>
        </div>

        {/* Intro avec Padding et Largeur Adaptée */}
        {unit.intro && (
          <div className="mt-8 px-4 sm:px-8 lg:px-16 max-w-4xl mx-auto text-center text-gray-400 italic">
            <p>{unit.intro}</p>
          </div>
        )}

        {/* Conteneur Principal avec Barre Latérale */}
        <div className="lg:flex lg:items-start lg:justify-center lg:mt-12">
          {/* Barre Latérale Gauche */}
          <div className="lg:w-1/4 p-4 lg:fixed top-0 w-full lg:max-w-sm lg:max-h-screen lg:h-auto flex justify-center z-10 lg:sticky lg:top-24">
            <div className="bg-black p-6 rounded-lg shadow-lg w-full">
              <div className="flex items-center space-x-4">
                <AntImage
                  src={getImageUrl(unit.profileImage)}
                  alt={`${unit.title} Profile`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full shadow-custom-black"
                  preview={false}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/backgrounds/placeholder.jpg";
                  }}
                />
                <h2 className="text-2xl font-oxanium text-white">{unit.title}</h2>
                <Badge role={unit.type} />
              </div>

              {/* Menu de Navigation */}
              <nav className="mt-8">
                <ul className="space-y-4">
                  <li>
                    <button
                      className={`text-lg font-kanit flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 ${
                        activeSection === "biographie"
                          ? "bg-white text-black"
                          : "text-gray-400 hover:bg-white hover:text-black"
                      }`}
                      onClick={() => handleMenuClick("biographie")}
                    >
                      <FaBook className="text-xl" />
                      <span>Biographie</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`text-lg font-kanit flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 ${
                        activeSection === "galerie"
                          ? "bg-white text-black"
                          : "text-gray-400 hover:bg-white hover:text-black"
                      }`}
                      onClick={() => handleMenuClick("galerie")}
                    >
                      <FaImage className="text-xl" />
                      <span>Galerie</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`text-lg font-kanit flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 ${
                        activeSection === "nouvelles"
                          ? "bg-white text-black"
                          : "text-gray-400 hover:bg-white hover:text-black"
                      }`}
                      onClick={() => handleMenuClick("nouvelles")}
                    >
                      <FaNewspaper className="text-xl" />
                      <span>Nouvelles</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Classes Associées */}
              {relatedClasses.length > 0 && (
                <div className="mt-8">
                  {relatedClasses.map((relatedClass) => (
                    <div key={relatedClass.id} className="text-center mb-4">
                      <AntImage
                        src={relatedClass.profileImage}
                        alt={`Classe ${relatedClass.title} Profile`}
                        width={120} 
                        height={120} 
                        className="w-30 h-30 object-cover rounded-full shadow-custom-black mx-auto mb-4"
                        preview={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/backgrounds/placeholder.jpg";
                        }}
                      />
                      <h3 className="text-xl font-iceberg uppercase text-white">
                        {relatedClass.title}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section de Contenu Principal */}
          <div
            className={`lg:w-3/4 lg:ml-[5%] p-6 transition-opacity duration-1000 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Biographie */}
            {activeSection === "biographie" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16 text-left">
                  <h2 className="text-3xl font-bold font-oxanium text-white mb-8">
                    Biographie
                  </h2>
                  <div
                    className="text-lg text-gray-300 leading-relaxed max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                    dangerouslySetInnerHTML={{
                      __html:
                        unit.bio || "<p>Aucune biographie disponible.</p>",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Galerie */}
            {activeSection === "galerie" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16">
                  <h2 className="text-3xl font-bold font-oxanium text-white mb-8 text-left">
                    Galerie
                  </h2>
                  <Masonry
                    breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
                    className="flex -ml-4 w-auto"
                    columnClassName="pl-4"
                  >
                    {unit.gallery && unit.gallery.length > 0 ? (
                      unit.gallery.map((imgUrl, index) => (
                        <div key={index} className="relative mb-4">
                          <AntImage
                            src={getImageUrl(imgUrl)}
                            alt={`${unit.title} Gallery Image ${index + 1}`}
                            width={500}
                            height={281}
                            className="w-full h-auto rounded-lg shadow-lg"
                            style={{
                              objectFit: "cover",
                              aspectRatio: "16/9",
                            }}
                            preview={{
                              src: imgUrl,
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/backgrounds/placeholder.jpg";
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Aucune image disponible dans la galerie.</p>
                    )}
                  </Masonry>
                </div>
              </div>
            )}

            {/* Nouvelles */}
            {activeSection === "nouvelles" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16 text-left">
                  <h2 className="text-3xl font-bold font-oxanium text-white mb-8">
                    Nouvelles
                  </h2>

                  {loadingUser ? (
                    <p className="text-gray-400">
                      Chargement des informations d&apos;abonnement...
                    </p>
                  ) : (
                    <>
                      {!isSubscribed && (
                        <div className="relative">
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-20 h-full min-h-[300px]">
                            <FaLock className="text-8xl text-gray-400 mb-6" />
                            <p className="text-2xl text-white mb-4">
                              Contenu réservé aux abonnés
                            </p>
                            <button
                              onClick={handleSubscriptionClick}
                              className="bg-indigo-600 text-white px-6 py-3 text-lg rounded-lg hover:bg-indigo-500"
                            >
                              S&apos;abonner
                            </button>
                          </div>
                        </div>
                      )}

                      {isSubscribed && unit.story && (
                        <div
                          className="text-lg text-gray-300 leading-relaxed max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                          dangerouslySetInnerHTML={{
                            __html: unit.story,
                          }}
                        />
                      )}

                      {isSubscribed && !unit.story && (
                        <p className="text-gray-500 text-lg">
                          Pas de nouvelles pour le moment.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default UnitDetailPage;
