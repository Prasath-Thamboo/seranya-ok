"use client";

import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Card } from "antd";
import Link from "next/link";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import BadgeComponent from "@/components/Badge";
import HeroSection from "@/components/HeroSection";
import DividersWithHeading from "@/components/DividersWhithHeading";
import { getImageUrl } from "@/utils/image"; // Importation de la fonction d'aide
import { UploadType } from "@/lib/models/ClassModels"; // Importation correcte des types
import Image from "next/image"; // Optionnel, pour optimiser les images

const fetchRandomImage = async () => {
  const res = await fetch("/api/getRandomImage");
  const data = await res.json();
  return data.imagePath;
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

        // Utilisez les URLs d'images telles qu'elles sont fournies par le backend
        const unitsWithImages: UnitModel[] = fetchedUnits
          .sort((a, b) => a.title.localeCompare(b.title)); // Tri alphabétique des unités

        setUnits(unitsWithImages);
        setFilteredUnits(unitsWithImages); // Initialisation des unités
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const fetchBgImage = async () => {
      try {
        const image = await fetchRandomImage();
        setBackgroundImage(getImageUrl(image));
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchData();
    fetchBgImage();
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

  // Tri des unités filtrées
  const sortedChampions = filteredUnits
    .filter((unit) => unit.type.toUpperCase() === "CHAMPION")
    .sort((a, b) => a.title.localeCompare(b.title)); // Tri alphabétique des champions

  const sortedBestiaire = filteredUnits
    .filter((unit) => unit.type.toUpperCase() === "UNIT")
    .sort((a, b) => a.title.localeCompare(b.title)); // Tri alphabétique des unités

  return (
    <div className="relative w-full min-h-screen text-white font-kanit">
      {/* Image de Fond Aléatoire */}
      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              filter: "brightness(20%)", // Assombrissement accru
              backgroundAttachment: "fixed",
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-90 z-10"></div> {/* Opacité accrue */}
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
        <div className="lg:w-1/4 p-4 bg-black rounded-lg shadow-lg sticky top-24 mr-8">
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
        </div>

        {/* Section Principale */}
        <div className="lg:w-3/4">
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
                  <Badge.Ribbon
                    key={unit.id}
                    text="NEW"
                    color="red"
                    className="font-iceberg shadow-lg"
                    style={{ boxShadow: "0px 4px 12px rgba(255, 0, 0, 0.4)" }}
                  >
                    <div className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 border border-gray-700 h-full flex flex-col">
                      {/* Image d'En-tête */}
                      <div
                        className="relative w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})`,
                        }}
                      >
                        {/* Image de Profil */}
                        <div className="absolute inset-x-0 top-full transform -translate-y-1/2 flex justify-center z-20"> {/* z-20 pour au-dessus */}
                          <img
                            alt={unit.title}
                            src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                            className="w-24 h-24 object-cover rounded-full border-4 border-black shadow-lg"
                          />
                        </div>
                      </div>

                      {/* Conteneur Textuel avec Arrière-Plan Footer Image */}
                      <div className="pt-12 pb-4 text-center bg-black rounded-b-lg px-3 flex flex-col justify-between flex-grow relative">
                        {/* Footer Image Background */}
                        {unit.footerImage && (
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-90 z-0" // Opacité très sombre
                            style={{
                              backgroundImage: `url(${unit.footerImage})`,
                            }}
                          ></div>
                        )}

                        {/* Contenu Textuel */}
                        <div className="relative z-10">
                          <Card.Meta
                            title={
                              <div className="text-center">
                                <span className="text-2xl font-iceberg uppercase">{unit.title}</span>
                              </div>
                            }
                            description={
                              <div className="text-center">
                                <p className="text-gray-300 font-kanit">{unit.subtitle || "Aucune citation"}</p>
                                <div className="mt-4">
                                  <BadgeComponent type={unit.type} />
                                </div>
                              </div>
                            }
                          />
                          {/* Contenu Caché au Hover */}
                          <div className="hidden group-hover:block mt-4 text-gray-100">
                            <p className="font-kanit p-3">{unit.intro || "Aucune introduction disponible."}</p>
                          </div>
                          {/* Bouton Explorer */}
                          <div className="text-center mt-6 transition-all duration-300">
                            <Link href={`/univers/units/${unit.id}`}>
                              <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                                Explorer
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Badge.Ribbon>
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
                  <Badge.Ribbon
                    key={unit.id}
                    text="NEW"
                    color="red"
                    className="font-iceberg shadow-lg"
                    style={{ boxShadow: "0px 4px 12px rgba(255, 0, 0, 0.4)" }}
                  >
                    <div className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500 border border-gray-700 h-full flex flex-col">
                      {/* Image d'En-tête */}
                      <div
                        className="relative w-full h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})`,
                        }}
                      >
                        {/* Image de Profil */}
                        <div className="absolute inset-x-0 top-full transform -translate-y-1/2 flex justify-center z-20"> {/* z-20 pour au-dessus */}
                          <img
                            alt={unit.title}
                            src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                            className="w-24 h-24 object-cover rounded-full border-4 border-black shadow-lg"
                          />
                        </div>
                      </div>

                      {/* Conteneur Textuel avec Arrière-Plan Footer Image */}
                      <div className="pt-12 pb-4 text-center bg-black rounded-b-lg px-3 flex flex-col justify-between flex-grow relative">
                        {/* Footer Image Background */}
                        {unit.footerImage && (
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-90 z-0" // Opacité très sombre
                            style={{
                              backgroundImage: `url(${unit.footerImage})`,
                            }}
                          ></div>
                        )}

                        {/* Contenu Textuel */}
                        <div className="relative z-10">
                          <Card.Meta
                            title={
                              <div className="text-center">
                                <span className="text-2xl font-iceberg uppercase">{unit.title}</span>
                              </div>
                            }
                            description={
                              <div className="text-center">
                                <p className="text-gray-300 font-kanit">{unit.subtitle || "Aucune citation"}</p>
                                <div className="mt-4">
                                  <BadgeComponent
                                    classes={
                                      unit.classes && unit.classes.length > 0
                                        ? unit.classes.map((classItem) => ({
                                            title: classItem.title,
                                            color: classItem.color || undefined, // Remplace null par undefined
                                          }))
                                        : [] // Pas de classes, passez un tableau vide
                                    }
                                  />
                                </div>
                              </div>
                            }
                          />
                          {/* Contenu Caché au Hover */}
                          <div className="hidden group-hover:block mt-4 text-gray-100">
                            <p className="font-kanit p-3">{unit.intro || "Aucune introduction disponible."}</p>
                          </div>
                          {/* Bouton Explorer */}
                          <div className="text-center mt-6 transition-all duration-300">
                            <Link href={`/univers/units/${unit.id}`}>
                              <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                                Explorer
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Badge.Ribbon>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default UniversPage;
