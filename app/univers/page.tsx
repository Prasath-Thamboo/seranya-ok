"use client";

import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Link from "next/link";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { fetchClasses } from "@/lib/queries/ClassQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import { ClassModel } from "@/lib/models/ClassModels";
import BadgeComponent from "@/components/Badge";
import HeroSection from "@/components/HeroSection";
import DividersWithHeading from "@/components/DividersWhithHeading";
import { getImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import { fetchRandomBackground } from "@/lib/queries/RandomBackgroundQuery";

const UniversPage = () => {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<UnitModel[]>([]);
  const [latestClasses, setLatestClasses] = useState<ClassModel[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [heroBackgroundImage, setHeroBackgroundImage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [isTypeFilterOpen, setIsTypeFilterOpen] = useState<boolean>(true);
  const [isClassFilterOpen, setIsClassFilterOpen] = useState<boolean>(true);
  const [showMoreClasses, setShowMoreClasses] = useState<boolean>(false);
  const [searchClassesQuery, setSearchClassesQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const classesPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUnits = await fetchUnits();
        const fetchedClasses = await fetchClasses();
        const unitsWithImages: UnitModel[] = fetchedUnits.sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setUnits(unitsWithImages);
        setFilteredUnits(unitsWithImages);

        // Stocker toutes les classes
        setClasses(fetchedClasses);

        // Obtenir les trois dernières classes pour la section "Dernières infos disponibles"
        const latestClasses = fetchedClasses
          .sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);
        setLatestClasses(latestClasses);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des unités ou des classes :",
          error
        );
      }
    };

    const loadRandomBackground = async () => {
      try {
        const image = await fetchRandomBackground();
        console.log("Background image:", image);
        setBackgroundImage(image);
      } catch (error) {
        console.error(
          "Échec du chargement de l'image de fond aléatoire :",
          error
        );
        setBackgroundImage("/images/backgrounds/default.jpg");
      }
    };

    const loadRandomHeroBackground = async () => {
      try {
        const image = await fetchRandomBackground();
        console.log("Hero background image:", image);
        setHeroBackgroundImage(image);
      } catch (error) {
        console.error(
          "Échec du chargement de l'image de fond aléatoire pour HeroSection :",
          error
        );
        setHeroBackgroundImage("/images/backgrounds/bouddhisme.jpg");
      }
    };

    fetchData();
    loadRandomBackground();
    loadRandomHeroBackground();
  }, []);

  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
  };

  const handleClassFilter = (classe: string) => {
    if (selectedClasses.includes(classe)) {
      setSelectedClasses(selectedClasses.filter((c) => c !== classe));
    } else {
      setSelectedClasses([...selectedClasses, classe]);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  useEffect(() => {
    let filtered = units;

    if (activeFilter !== "ALL") {
      filtered = filtered.filter(
        (unit) => unit.type.toUpperCase() === activeFilter
      );
    }

    if (selectedClasses.length > 0) {
      filtered = filtered.filter(
        (unit) =>
          unit.classes &&
          unit.classes.some((cls) => selectedClasses.includes(cls.title))
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((unit) =>
        unit.title.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredUnits(filtered);
  }, [activeFilter, selectedClasses, searchQuery, units]);

  const sortedChampions = filteredUnits
    .filter((unit) => unit.type.toUpperCase() === "CHAMPION")
    .sort((a, b) => a.title.localeCompare(b.title));

  const sortedBestiaire = filteredUnits
    .filter((unit) => unit.type.toUpperCase() === "UNIT")
    .sort((a, b) => a.title.localeCompare(b.title));

  const transformClasses = (classes: UnitModel["classes"]) => {
    if (!classes) return [];
    return classes.map((cls) => ({
      title: cls.title,
      color: cls.color ?? "#000000",
    }));
  };

  // Gestion de la pagination des classes
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = classes
    .filter((classe) =>
      classe.title.toLowerCase().includes(searchClassesQuery.toLowerCase())
    )
    .slice(indexOfFirstClass, indexOfLastClass);
  const totalPages = Math.ceil(
    classes.filter((classe) =>
      classe.title.toLowerCase().includes(searchClassesQuery.toLowerCase())
    ).length / classesPerPage
  );

  const handleClassesSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchClassesQuery(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="relative w-full min-h-screen text-white font-kanit">
      {/* Image de Fond Fixée et Proportionnée */}
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <img
            src={backgroundImage}
            alt="Background"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
              position: "fixed",
            }}
            className="brightness-50"
          />
          {/* Overlay pour obscurcir davantage l'image vers le bas */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9))",
            }}
          ></div>
        </div>
      )}

      {/* Hero Section en Haut de la Page */}
      <HeroSection
        backgroundImage={heroBackgroundImage}
        title="Explorez l'Univers"
        titleColor="#fff"
        strongTitle="de Seranya"
        strongTitleColor="#ffffff"
        content="Découvrez les blogs, tutos et autres sur Seranya."
        contentColor="#ddd"
        button1Text="Commencer l'exploration"
        button1Url="#"
        button1BgColor="#000000"
        button2Text="En savoir plus"
        button2Url="#"
        button2BgColor="#555"
      />

      {/* Section "Dernières infos disponibles" */}
      <motion.section
        className="relative z-10 py-16 px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-white text-center font-iceberg mb-8">
          Dernières infos disponibles
        </h2>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grande carte à gauche */}
          {latestClasses[0] && (
            <Link
              href={`/univers/classes/${latestClasses[0].id}`}
              className="lg:w-2/3"
            >
              <div className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-700">
                {/* Image de fond */}
                <div
                  className="w-full h-96 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${
                      getImageUrl(
                        latestClasses[0].uploads.find(
                          (upload) => upload.type === "HEADERIMAGE"
                        )?.path
                      ) || "/images/backgrounds/placeholder.jpg"
                    })`,
                  }}
                >
                  {/* Overlay pour obscurcir l'image vers le bas */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8))",
                    }}
                  ></div>
                </div>
                {/* Contenu */}
                <div className="absolute inset-0 flex flex-col justify-end items-center p-4">
                  <h3 className="text-2xl font-bold text-white font-iceberg uppercase">
                    {latestClasses[0].title}
                  </h3>
                  <p className="text-sm text-gray-300 font-kanit">
                    {latestClasses[0].subtitle || "Aucune description"}
                  </p>
                </div>
              </div>
            </Link>
          )}
          {/* Deux petites cartes à droite */}
          <div className="flex flex-col gap-8 lg:w-1/3">
            {latestClasses.slice(1, 3).map((classe) => (
              <Link href={`/univers/classes/${classe.id}`} key={classe.id}>
                <div className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-700">
                  {/* Image de fond */}
                  <div
                    className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${
                        getImageUrl(
                          classe.uploads.find(
                            (upload) => upload.type === "HEADERIMAGE"
                          )?.path
                        ) || "/images/backgrounds/placeholder.jpg"
                      })`,
                    }}
                  >
                    {/* Overlay pour obscurcir l'image vers le bas */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8))",
                      }}
                    ></div>
                  </div>
                  {/* Contenu */}
                  <div className="absolute inset-0 flex flex-col justify-end items-center p-2">
                    <h3 className="text-xl font-bold text-white font-iceberg uppercase">
                      {classe.title}
                    </h3>
                    <p className="text-sm text-gray-300 font-kanit">
                      {classe.subtitle || "Aucune description"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bouton "Voir plus" */}
        <div className="text-center mt-8">
          <button
            onClick={() => setShowMoreClasses(!showMoreClasses)}
            className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-6 rounded transition-all duration-300 shadow-lg uppercase font-iceberg"
          >
            {showMoreClasses ? "Voir moins" : "Voir plus"}
          </button>
        </div>

        {/* Liste des classes supplémentaires */}
        {showMoreClasses && (
          <div className="mt-8">
            {/* Barre de recherche pour les classes */}
            <div className="mb-4 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  className="w-full h-12 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-500 bg-white border-0 rounded-md shadow focus:placeholder-gray-600 focus:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Rechercher une classe..."
                  aria-label="Rechercher"
                  value={searchClassesQuery}
                  onChange={handleClassesSearch}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <SearchOutlined className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Liste des classes avec pagination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentClasses.map((classe) => (
                <Link href={`/univers/classes/${classe.id}`} key={classe.id}>
                  <div className="relative group overflow-hidden rounded-lg shadow-lg border border-gray-700">
                    {/* Image de fond */}
                    <div
                      className="w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${
                          getImageUrl(
                            classe.uploads.find(
                              (upload) => upload.type === "HEADERIMAGE"
                            )?.path
                          ) || "/images/backgrounds/placeholder.jpg"
                        })`,
                      }}
                    >
                      {/* Overlay pour obscurcir l'image vers le bas */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8))",
                        }}
                      ></div>
                    </div>
                    {/* Contenu */}
                    <div className="absolute inset-0 flex flex-col justify-end items-center p-2">
                      <h3 className="text-xl font-bold text-white font-iceberg uppercase">
                        {classe.title}
                      </h3>
                      <p className="text-sm text-gray-300 font-kanit">
                        {classe.subtitle || "Aucune description"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === 1
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-700 hover:text-white"
                }`}
              >
                Précédent
              </button>
              <span className="px-4 py-2 mx-1">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() =>
                  currentPage < totalPages && setCurrentPage(currentPage + 1)
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-700 hover:text-white"
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </motion.section>

      {/* Titre et Texte d'accroche pour l'Encyclopédie */}
      <motion.section
        className="relative z-10 py-8 px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-white font-iceberg">
          L&apos;Encyclopédie de Seranya
        </h2>
        <p className="mt-4 text-lg text-gray-300 font-kanit">
          Explorez les blogs de Seranya .
        </p>
      </motion.section>

      {/* Section Principale avec Sidebar et Contenu */}
      <section className="relative z-10 py-16 px-12">
        <div className="flex flex-col lg:flex-row">
          {/* Barre Latérale des Filtres */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="lg:w-1/4 p-4 bg-black/80 rounded-lg shadow-lg sticky top-24 max-h-[85vh] overflow-y-auto mr-0 lg:mr-8 mb-8 lg:mb-0"
          >
            {/* Barre de Recherche dans la Sidebar */}
            <div className="mb-8 relative">
              <input
                className="w-full h-12 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-500 bg-white border-0 rounded-md shadow focus:placeholder-gray-600 focus:bg-gray-100 focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Rechercher..."
                aria-label="Rechercher"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black p-1 rounded">
                <SearchOutlined className="text-white" />
              </div>
            </div>

            {/* Filtres Dépliables */}
            <div className="mb-4">
              <button
                onClick={() => setIsTypeFilterOpen(!isTypeFilterOpen)}
                className="w-full text-left text-lg font-iceberg text-white py-2 px-4 bg-black/70 rounded-t-lg focus:outline-none"
              >
                Filtrage par type
              </button>
              {isTypeFilterOpen && (
                <ul className="flex flex-col bg-black/70 rounded-b-lg">
                  {["ALL", "CHAMPION", "UNIT"].map((type) => (
                    <li
                      key={type}
                      className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium text-white bg-black/70 rounded-lg mb-2 last:mb-0"
                    >
                      <input
                        id={`type-filter-${type}`}
                        name={`type-filter-${type}`}
                        type="checkbox"
                        checked={activeFilter === type}
                        onChange={() => handleFilterClick(type)}
                        className="h-4 w-4 accent-black border-gray-300 rounded focus:ring-2 focus:ring-white"
                      />
                      <label
                        htmlFor={`type-filter-${type}`}
                        className="block text-sm font-medium text-white"
                      >
                        {type === "ALL"
                          ? "Toutes les Unités"
                          : type.charAt(0) + type.slice(1).toLowerCase()}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <button
                onClick={() => setIsClassFilterOpen(!isClassFilterOpen)}
                className="w-full text-left text-lg font-iceberg text-white py-2 px-4 bg-black/70 rounded-b-lg focus:outline-none"
              >
                Filtrage par classe
              </button>
              {isClassFilterOpen && (
                <div className="flex flex-wrap gap-2 p-4 bg-black/70 rounded-lg mt-2">
                  {classes.map((classe) => (
                    <button
                      key={classe.id}
                      onClick={() => handleClassFilter(classe.title)}
                      className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none transition-colors duration-200 cursor-pointer font-iceberg uppercase m-1`}
                      style={{
                        backgroundColor: selectedClasses.includes(classe.title)
                          ? classe.color ?? "#000000"
                          : "#4B5563",
                        color: "#FFFFFF",
                        boxShadow: selectedClasses.includes(classe.title)
                          ? `0 0 10px ${classe.color ?? "#000000"}`
                          : "none",
                      }}
                    >
                      {classe.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Contenu Principal */}
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
                          backgroundImage: `url(${
                            getImageUrl(unit.headerImage) ||
                            "/images/backgrounds/placeholder.jpg"
                          })`,
                        }}
                      ></div>

                      {/* Profile Image */}
                      <img
                        alt={unit.title}
                        src={
                          unit.profileImage ||
                          "/images/backgrounds/placeholder.jpg"
                        }
                        className="absolute left-1/2 top-48 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-cover rounded-full border-4 border-black shadow-[0_0_10px_black] z-20"
                      />

                      {/* Text Content */}
                      <div
                        className="pb-4 text-center px-3 flex flex-col justify-between flex-grow relative pt-10"
                        style={{
                          backgroundImage: unit.footerImage
                            ? `url(${getImageUrl(unit.footerImage)})`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {unit.footerImage && (
                          <div className="absolute inset-0 bg-black opacity-70 rounded-b-lg"></div>
                        )}

                        <div className="relative z-10">
                          <span className="text-2xl font-iceberg uppercase mt-4">
                            {unit.title}
                          </span>
                          {unit.classes && unit.classes.length > 0 && (
                            <div className="mt-2">
                              <BadgeComponent
                                classes={transformClasses(unit.classes)}
                              />
                            </div>
                          )}
                          <p className="text-white font-kanit mt-2">
                            {unit.subtitle || "Aucune citation"}
                          </p>
                        </div>

                        <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40">
                          <p className="text-white font-kanit p-3">
                            {unit.intro || "Aucune introduction disponible."}
                          </p>
                        </div>

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
                          backgroundImage: `url(${
                            getImageUrl(unit.headerImage) ||
                            "/images/backgrounds/placeholder.jpg"
                          })`,
                        }}
                      ></div>

                      {/* Profile Image */}
                      <img
                        alt={unit.title}
                        src={
                          unit.profileImage ||
                          "/images/backgrounds/placeholder.jpg"
                        }
                        className="absolute left-1/2 top-48 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 object-cover rounded-full border-4 border-black shadow-[0_0_10px_black] z-20"
                      />

                      <div
                        className="pb-4 text-center px-3 flex flex-col justify-between flex-grow relative pt-10"
                        style={{
                          backgroundImage: unit.footerImage
                            ? `url(${getImageUrl(unit.footerImage)})`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {unit.footerImage && (
                          <div className="absolute inset-0 bg-black opacity-70 rounded-b-lg"></div>
                        )}

                        <div className="relative z-10">
                          <span className="text-2xl font-iceberg uppercase mt-4">
                            {unit.title}
                          </span>
                          {unit.classes && unit.classes.length > 0 && (
                            <div className="mt-2">
                              <BadgeComponent
                                classes={transformClasses(unit.classes)}
                              />
                            </div>
                          )}
                          <p className="text-white font-kanit mt-2">
                            {unit.subtitle || "Aucune citation"}
                          </p>
                        </div>

                        <div className="max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-40">
                          <p className="text-white font-kanit p-3">
                            {unit.intro || "Aucune introduction disponible."}
                          </p>
                        </div>

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
        </div>
      </section>
    </div>
  );
};

export default UniversPage;
