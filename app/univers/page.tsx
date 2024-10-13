"use client";

import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
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
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState<boolean>(true);
  const [isClassFilterOpen, setIsClassFilterOpen] = useState<boolean>(false);

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
    <div className="relative w-full min-h-screen text-white font-kanit">
      {/* Image de Fond Fixée et Proportionnée */}
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
            className="brightness-30"
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
          className="lg:w-1/4 p-4 bg-black rounded-lg shadow-lg sticky top-4 max-h-screen overflow-y-auto mr-8"
        >
          {/* Barre de Recherche dans la Sidebar */}
          <div className="mb-8 relative">
            <input
              className="w-full h-12 pl-10 pr-4 text-sm text-white placeholder-gray-400 bg-black border-0 rounded-md shadow focus:placeholder-gray-500 focus:bg-gray-800 focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Rechercher..."
              aria-label="Rechercher"
              value={searchQuery}
              onChange={handleSearch}
            />
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filtres Dépliables */}
          {/* Filtrage par Type */}
          <div className="mb-4">
            <button
              onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
              className="w-full text-left text-lg font-iceberg text-white py-2 px-4 bg-gray-800 rounded-t-lg focus:outline-none"
            >
              Filtrage par type
            </button>
            {isTypeFilterOpen && (
              <ul className="max-w-sm flex flex-col bg-white dark:bg-neutral-800">
                {["ALL", "CHAMPION", "UNIT"].map((type) => (
                  <li
                    key={type}
                    className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium text-gray-800 dark:text-white border-b last:border-b-0 dark:bg-neutral-800"
                  >
                    <input
                      id={`type-filter-${type}`}
                      name={`type-filter-${type}`}
                      type="checkbox"
                      checked={activeFilter === type}
                      onChange={() => handleFilterClick(type)}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
                    />
                    <label
                      htmlFor={`type-filter-${type}`}
                      className="ms-3.5 block text-sm font-medium text-gray-600 dark:text-neutral-500"
                    >
                      {type === "ALL" ? "Toutes les Unités" : type.charAt(0) + type.slice(1).toLowerCase()}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Filtrage par Classe */}
          <div>
            <button
              onClick={() => setIsClassFilterOpen(!isClassFilterOpen)}
              className="w-full text-left text-lg font-iceberg text-white py-2 px-4 bg-gray-800 rounded-b-lg focus:outline-none"
            >
              Filtrage par classe
            </button>
            {isClassFilterOpen && (
              <ul className="max-w-sm flex flex-col bg-white dark:bg-neutral-800">
                {/* Remplacez ces éléments par vos classes réelles */}
                {["Classe A", "Classe B", "Classe C"].map((classe, index) => (
                  <li
                    key={index}
                    className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-medium text-gray-800 dark:text-white border-b last:border-b-0 dark:bg-neutral-800"
                  >
                    <input
                      id={`class-filter-${index}`}
                      name={`class-filter-${index}`}
                      type="checkbox"
                      // Ajoutez la logique de sélection des classes ici
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700"
                    />
                    <label
                      htmlFor={`class-filter-${index}`}
                      className="ms-3.5 block text-sm font-medium text-gray-600 dark:text-neutral-500"
                    >
                      {classe}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Section Principale */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="lg:w-3/4"
        >
          {/* Section Champions */}
          {sortedChampions.length > 0 && (
            <>
              <DividersWithHeading text="Champions" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedChampions.map((unit) => (
                  <motion.div
                    key={unit.id}
                    className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 border border-gray-700 flex flex-col bg-black/60"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Header Image */}
                    <div
                      className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getImageUrl(unit.headerImage) || "/images/backgrounds/placeholder.jpg"})`,
                      }}
                    ></div>

                    {/* Profile Image */}
                    <img
                      alt={unit.title}
                      src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                      className="absolute left-1/2 top-48 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-cover rounded-full border-4 border-black shadow-[0_0_10px_black] z-10"
                    />

                    {/* Text Content */}
                    <div
                      className="pb-4 text-center px-3 flex flex-col justify-between flex-grow relative pt-4"
                      style={{
                        backgroundImage: unit.footerImage ? `url(${getImageUrl(unit.footerImage)})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Overlay pour assombrir l'image de footer */}
                      {unit.footerImage && (
                        <div className="absolute inset-0 bg-black opacity-30 rounded-b-lg"></div>
                      )}

                      {/* Contenu Principal */}
                      <div className="relative z-10 mt-4">
                        <span className="text-2xl font-iceberg uppercase">{unit.title}</span>
                        {/* Badge des classes associées */}
                        {unit.classes && unit.classes.length > 0 && (
                          <div className="mt-2">
                            <BadgeComponent classes={transformClasses(unit.classes)} />
                          </div>
                        )}
                        <p className="text-white font-kanit mt-2">{unit.subtitle || "Aucune citation"}</p>
                      </div>

                      {/* Intro */}
                      <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40">
                        <p className="text-white font-kanit p-3">{unit.intro || "Aucune introduction disponible."}</p>
                      </div>

                      {/* Bouton Explorer */}
                      <div className="text-center mt-6 transition-all duration-300 relative z-10">
                        <Link href={`/univers/units/${unit.id}`}>
                          <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                            Explorer
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
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
                  <motion.div
                    key={unit.id}
                    className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 border border-gray-700 flex flex-col bg-black/60"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Header Image */}
                    <div
                      className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${getImageUrl(unit.headerImage) || "/images/backgrounds/placeholder.jpg"})`,
                      }}
                    ></div>

                    {/* Profile Image */}
                    <img
                      alt={unit.title}
                      src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                      className="absolute left-1/2 top-48 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-cover rounded-full border-4 border-black shadow-[0_0_10px_black] z-10"
                    />

                    {/* Text Content */}
                    <div
                      className="pb-4 text-center px-3 flex flex-col justify-between flex-grow relative pt-4"
                      style={{
                        backgroundImage: unit.footerImage ? `url(${getImageUrl(unit.footerImage)})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Overlay pour assombrir l'image de footer */}
                      {unit.footerImage && (
                        <div className="absolute inset-0 bg-black opacity-30 rounded-b-lg"></div>
                      )}

                      {/* Contenu Principal */}
                      <div className="relative z-10 mt-4">
                        <span className="text-2xl font-iceberg uppercase">{unit.title}</span>
                        {/* Badge des classes associées */}
                        {unit.classes && unit.classes.length > 0 && (
                          <div className="mt-2">
                            <BadgeComponent classes={transformClasses(unit.classes)} />
                          </div>
                        )}
                        <p className="text-white font-kanit mt-2">{unit.subtitle || "Aucune citation"}</p>
                      </div>

                      {/* Intro */}
                      <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40">
                        <p className="text-white font-kanit p-3">{unit.intro || "Aucune introduction disponible."}</p>
                      </div>

                      {/* Bouton Explorer */}
                      <div className="text-center mt-6 transition-all duration-300 relative z-10">
                        <Link href={`/univers/units/${unit.id}`}>
                          <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                            Explorer
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
};

export default UniversPage;
