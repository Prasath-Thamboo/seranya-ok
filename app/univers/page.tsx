"use client";

import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Link from "next/link";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import BadgeComponent from "@/components/Badge";
import HeroSection from "@/components/HeroSection";
import DividersWithHeading from "@/components/DividersWhithHeading";
import { getImageUrl } from "@/utils/image"; 
import Image from "next/image";
import { motion } from "framer-motion"; // Importation de Framer Motion

// Fonction pour récupérer une image de fond aléatoire via l'API
const fetchRandomImage = async () => {
  try {
    const res = await fetch("/api/getRandomImage");
    if (!res.ok) {
      throw new Error("Échec de la récupération de l'image de fond");
    }
    const data = await res.json();
    return data.imagePath;
  } catch (error) {
    console.error(error);
    return "/images/backgrounds/default.jpg"; // Image de secours
  }
};

const UniversPage = () => {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<UnitModel[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUnits = await fetchUnits();
        const unitsWithImages: UnitModel[] = fetchedUnits.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setUnits(unitsWithImages);
        setFilteredUnits(unitsWithImages);
      } catch (error) {
        console.error("Erreur lors de la récupération des unités :", error);
      }
    };

    const loadRandomBackground = async () => {
      const image = await fetchRandomImage();
      setBackgroundImage(image);
    };

    fetchData();
    loadRandomBackground();
  }, []);

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
    if (filterType === "ALL") {
      setFilteredUnits(units);
    } else {
      setFilteredUnits(
        units.filter((unit) => unit.type.toUpperCase() === filterType)
      );
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = units.filter((unit) =>
      unit.title.toLowerCase().includes(query)
    );
    setFilteredUnits(filtered);
  };

  const sortedChampions = filteredUnits
    .filter((unit) => unit.type.toUpperCase() === "CHAMPION")
    .sort((a, b) => a.title.localeCompare(b.title));

  const sortedBestiaire = filteredUnits
    .filter((unit) => unit.type.toUpperCase() === "UNIT")
    .sort((a, b) => a.title.localeCompare(b.title));

  // Helper function to transform classes to match BadgeComponent's expectation
  const transformClasses = (classes: UnitModel['classes']) => {
    if (!classes) return [];
    return classes.map(cls => ({
      title: cls.title,
      color: cls.color || undefined, // Remplacer null par undefined
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full min-h-screen text-white font-kanit"
    >
      {/* Image de Fond Aléatoire Fixée et Proportionnée */}
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority={true}
            quality={100}
            className="brightness-30" // Ajustez la luminosité selon vos besoins
          />
          {/* Overlay pour assombrir l'image */}
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        backgroundImage="/images/backgrounds/Bastion1.png"
        title="Explorez l'Univers"
        titleColor="#fff"
        strongTitle="de Spectral"
        strongTitleColor="#ff6347"
        content="Découvrez les personnages, leurs histoires et plongez dans l'univers spectaculaire de Spectral."
        contentColor="#ddd"
        button1Text="Commencer l'exploration"
        button1Url="#"
        button1BgColor="#ff6347"
        button2Text="En savoir plus"
        button2Url="#"
        button2BgColor="#555"
      />

      <section className="relative z-10 py-16 px-12 flex">
        {/* Barre Latérale des Filtres */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="lg:w-1/4 p-4 bg-black rounded-lg shadow-lg sticky top-24 mr-8"
        >
          <h2 className="text-2xl font-iceberg text-white mb-8">Filtres par Type</h2>
          <ul className="space-y-4">
            <li>
              <button
                className={`text-lg font-iceberg text-gray-400 hover:bg-white hover:text-black w-full py-3 px-4 rounded transition-colors duration-200 ${
                  activeFilter === "ALL" ? "bg-white text-black" : ""
                }`}
                onClick={() => handleFilterClick("ALL")}
              >
                Toutes les Unités
              </button>
            </li>
            <li>
              <button
                className={`text-lg font-iceberg text-gray-400 hover:bg-white hover:text-black w-full py-3 px-4 rounded transition-colors duration-200 ${
                  activeFilter === "CHAMPION" ? "bg-white text-black" : ""
                }`}
                onClick={() => handleFilterClick("CHAMPION")}
              >
                Champions
              </button>
            </li>
            <li>
              <button
                className={`text-lg font-iceberg text-gray-400 hover:bg-white hover:text-black w-full py-3 px-4 rounded transition-colors duration-200 ${
                  activeFilter === "UNIT" ? "bg-white text-black" : ""
                }`}
                onClick={() => handleFilterClick("UNIT")}
              >
                Units
              </button>
            </li>
          </ul>
        </motion.div>

        {/* Section Principale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="lg:w-3/4"
        >
          {/* Barre de Recherche */}
          <div className="mb-8 flex items-center">
            <SearchOutlined className="text-gray-400 mr-3" style={{ fontSize: "1.5rem" }} />
            <input
              className="w-full lg:w-1/2 h-12 pl-4 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md shadow focus:placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-black form-input"
              type="text"
              placeholder="Rechercher..."
              aria-label="Rechercher"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Section Champions */}
          {sortedChampions.length > 0 && (
            <>
              <DividersWithHeading text="Champions" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedChampions.map((unit) => (
                  <div
                    key={unit.id}
                    className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 border border-gray-700 h-full flex flex-col bg-black/60"
                  >
                    {/* Image d'En-tête */}
                    <div
                      className="relative w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getImageUrl(unit.headerImage) || "/images/backgrounds/placeholder.jpg"})`,
                      }}
                    >
                      {/* Image de Profil avec bordure noire et ombre noire */}
                      <div className="absolute inset-x-0 top-full transform -translate-y-1/2 flex justify-center z-30">
                        <img
                          alt={unit.title}
                          src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                          className="w-24 h-24 object-cover rounded-full border-4 border-black shadow-black"
                          style={{ boxShadow: '0 0 10px black' }} // Ombre noire personnalisée
                        />
                      </div>
                    </div>

                    {/* Contenu Textuel avec Image de Footer en Arrière-Plan */}
                    <div
                      className="relative pt-12 pb-4 text-center px-3 flex flex-col justify-between flex-grow"
                      style={{
                        backgroundImage: unit.footerImage ? `url(${getImageUrl(unit.footerImage)})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                      }}
                    >
                      {/* Overlay pour assombrir l'image de footer */}
                      {unit.footerImage && (
                        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                      )}

                      {/* Contenu Principal */}
                      <div className="relative z-10">
                        <span className="text-2xl font-iceberg uppercase">{unit.title}</span>
                        {/* Badge des classes associées */}
                        {unit.classes && unit.classes.length > 0 && (
                          <div className="mt-2">
                            <BadgeComponent classes={transformClasses(unit.classes)} />
                          </div>
                        )}
                        <p className="text-gray-300 font-kanit mt-2">{unit.subtitle || "Aucune citation"}</p>

                        {/* Intro avec animation smooth, apparait entre le titre et le bouton */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                          <p className="text-gray-300 font-kanit p-3">{unit.intro || "Aucune introduction disponible."}</p>
                        </div>
                      </div>

                      {/* Bouton Explorer */}
                      <div className="relative z-10 text-center mt-6 transition-all duration-300">
                        <Link href={`/univers/units/${unit.id}`}>
                          <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                            Explorer
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Section Bestiaire */}
          {sortedBestiaire.length > 0 && (
            <>
              <DividersWithHeading text="Bestiaire" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedBestiaire.map((unit) => (
                  <div
                    key={unit.id}
                    className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 border border-gray-700 h-full flex flex-col bg-black/60"
                  >
                    {/* Image d'En-tête */}
                    <div
                      className="relative w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getImageUrl(unit.headerImage) || "/images/backgrounds/placeholder.jpg"})`,
                      }}
                    >
                      {/* Image de Profil avec bordure noire et ombre noire */}
                      <div className="absolute inset-x-0 top-full transform -translate-y-1/2 flex justify-center z-30">
                        <img
                          alt={unit.title}
                          src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                          className="w-24 h-24 object-cover rounded-full border-4 border-black shadow-black"
                          style={{ boxShadow: '0 0 10px black' }} // Ombre noire personnalisée
                        />
                      </div>
                    </div>

                    {/* Contenu Textuel avec Image de Footer en Arrière-Plan */}
                    <div
                      className="relative pt-12 pb-4 text-center px-3 flex flex-col justify-between flex-grow"
                      style={{
                        backgroundImage: unit.footerImage ? `url(${getImageUrl(unit.footerImage)})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        position: 'relative',
                      }}
                    >
                      {/* Overlay pour assombrir l'image de footer */}
                      {unit.footerImage && (
                        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                      )}

                      {/* Contenu Principal */}
                      <div className="relative z-10">
                        <span className="text-2xl font-iceberg uppercase">{unit.title}</span>
                        {/* Badge des classes associées */}
                        {unit.classes && unit.classes.length > 0 && (
                          <div className="mt-2">
                            <BadgeComponent classes={transformClasses(unit.classes)} />
                          </div>
                        )}
                        <p className="text-gray-300 font-kanit mt-2">{unit.subtitle || "Aucune citation"}</p>

                        {/* Intro avec animation smooth, apparait entre le titre et le bouton */}
                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                          <p className="text-gray-300 font-kanit p-3">{unit.intro || "Aucune introduction disponible."}</p>
                        </div>
                      </div>

                      {/* Bouton Explorer */}
                      <div className="relative z-10 text-center mt-6 transition-all duration-300">
                        <Link href={`/univers/units/${unit.id}`}>
                          <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                            Explorer
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </section>

      </motion.div>
            );
    };

    export default UniversPage;
