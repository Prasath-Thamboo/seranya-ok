// spectralnext/app/univers/units/[id]/page.tsx

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
    <div className="relative w-full min-h-screen text-white font-kanit">
      {/* Background Header */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${getImageUrl(unit.headerImage)})`,
          backgroundAttachment: "fixed",
          filter: "brightness(25%)",
        }}
      />

      <div className="relative z-10">
        {/* Header Section */}
        <div className="relative h-screen flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getImageUrl(unit.headerImage)})`,
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

        {/* Profil Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-72 h-72 rounded-full overflow-hidden border-4 border-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <AntImage
              src={getImageUrl(unit.profileImage)}
              alt={`${unit.title} Profile`}
              width={288}
              height={288}
              className="w-full h-full object-cover rounded-full"
              preview={false}
            />
          </div>
        </div>

        {/* Introduction Section */}
        {unit.intro && (
          <div className="mt-40 md:mt-48 lg:mt-56 text-center px-4 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-3xl text-gray-400 italic text-lg">
              <p>{unit.intro}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="lg:flex lg:items-start lg:justify-center lg:mt-12">
          {/* Sidebar */}
          <div className="lg:w-1/4 p-4 lg:fixed top-0 w-full lg:max-w-sm lg:max-h-screen lg:h-auto flex justify-center z-10 lg:sticky lg:top-24">
            <div className="bg-black p-6 rounded-lg shadow-lg w-full">
              <div className="flex items-center space-x-4">
                <AntImage
                  src={getImageUrl(unit.profileImage)}
                  alt={`${unit.title} Profile`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full shadow-lg"
                  preview={false}
                />
                <h2 className="text-2xl font-oxanium text-white">{unit.title}</h2>
                <Badge role={unit.type} />
              </div>

              <nav className="mt-8">
                <ul className="space-y-4">
                  <li>
                    <button
                      className={`text-lg font-kanit flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 rounded hover:bg-white hover:text-black ${
                        activeSection === "biographie"
                          ? "bg-white text-black"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleMenuClick("biographie")}
                    >
                      <FaBook className="text-xl" />
                      <span>Biographie</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`text-lg font-kanit flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 rounded hover:bg-white hover:text-black ${
                        activeSection === "galerie"
                          ? "bg-white text-black"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleMenuClick("galerie")}
                    >
                      <FaImage className="text-xl" />
                      <span>Galerie</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`text-lg font-kanit flex items-center space-x-3 py-3 px-4 w-full text-left transition-colors duration-200 rounded hover:bg-white hover:text-black ${
                        activeSection === "nouvelles"
                          ? "bg-white text-black"
                          : "text-gray-400"
                      }`}
                      onClick={() => handleMenuClick("nouvelles")}
                    >
                      <FaNewspaper className="text-xl" />
                      <span>Nouvelles</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {relatedClasses.length > 0 && (
                <div className="mt-8">
                  {relatedClasses.map((relatedClass) => (
                    <div key={relatedClass.id} className="text-center mb-4">
                      <AntImage
                        src={relatedClass.profileImage}
                        alt={`Classe ${relatedClass.title} Profile`}
                        width={200}
                        height={200}
                        className="w-64 h-64 object-cover rounded-full mx-auto mb-4 hover:scale-105 transition-transform duration-300"
                        preview={false}
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

          {/* Content Section */}
          <div
            className={`lg:w-3/4 lg:ml-[5%] p-6 transition-opacity duration-1000 ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            {activeSection === "biographie" && (
              <div className="relative z-10">
                <div className="mt-12 px-4 sm:px-8 lg:px-16 text-left">
                  <h2 className="text-3xl font-bold font-oxanium text-white mb-8">
                    Biographie
                  </h2>
                  <div
                    className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
                    dangerouslySetInnerHTML={{
                      __html:
                        unit.bio || "<p>Aucune biographie disponible.</p>",
                    }}
                  />
                </div>
              </div>
            )}

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
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Aucune image disponible dans la galerie.</p>
                    )}
                  </Masonry>
                </div>
              </div>
            )}

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

                      {isSubscribed && unit.story && (
                        <div
                          className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto first-letter:text-7xl first-letter:font-bold first-letter:text-white first-letter:mr-3 first-letter:float-left first-letter:font-iceberg"
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
        </div>
      );
    };

    export default UnitDetailPage;
