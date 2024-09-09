"use client";

import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Card } from "antd";
import Link from "next/link";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import BadgeComponent from "@/components/Badge";
import Header from "@/components/dashboard/Header"; // Réintégration du Header complet
import HeroSection from "@/components/HeroSection";

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
      const fetchedUnits = await fetchUnits();

      const unitsWithImages = fetchedUnits.map((unit) => ({
        ...unit,
        profileImage: `${process.env.NEXT_PUBLIC_API_URL_PROD}/uploads/units/${unit.id}/ProfileImage.png`,
        headerImage: `${process.env.NEXT_PUBLIC_API_URL_PROD}/uploads/units/${unit.id}/HeaderImage.png`,
      }));

      setUnits(unitsWithImages);
      setFilteredUnits(unitsWithImages); // Initialisation des unités
    };

    const fetchBgImage = async () => {
      const image = await fetchRandomImage();
      setBackgroundImage(image);
    };

    fetchData();
    fetchBgImage();
  }, []);

  // Vérifier si une unité a été créée dans les 7 derniers jours
  const isNewUnit = (createdAt: Date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return createdAt >= oneWeekAgo;
  };

  // Filtrer les unités par type
  const handleFilterClick = (filterType: string) => {
    setActiveFilter(filterType);
    if (filterType === "ALL") {
      setFilteredUnits(units);
    } else {
      setFilteredUnits(units.filter((unit) => unit.type.toUpperCase() === filterType));
    }
  };

  // Gestion de la recherche
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = units.filter((unit) =>
      unit.title.toLowerCase().includes(query)
    );
    setFilteredUnits(filtered);
  };

  return (
    <div className="relative w-full min-h-screen bg-black text-white font-kanit">

      {backgroundImage && (
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              filter: "brightness(70%)",
              backgroundAttachment: "fixed",
            }}
          ></div>
          <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        </div>
      )}

<HeroSection
        backgroundImage="/images/backgrounds/Bastion1.png"
        title="Explorez l'Univers"
        titleColor="#fff"
        strongTitle="des Légendes"
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
        {/* Sidebar pour filtrer les unités */}
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

        {/* Liste des cartes des unités et barre de recherche */}
        <div className="lg:w-3/4">
          {/* Barre de recherche */}
          <div className="mb-8 flex items-center">
            <SearchOutlined className="text-gray-400 mr-3" style={{ fontSize: '1.5rem' }} />
            <input
              className="w-full lg:w-1/2 h-12 pl-4 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md shadow focus:placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-black form-input"
              type="text"
              placeholder="Rechercher..."
              aria-label="Rechercher"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredUnits.map((unit) => {
              const isNew = isNewUnit(new Date(unit.createdAt));
              return (
                <Badge.Ribbon
                  key={unit.id}
                  text="NEW"
                  color="red"
                  className="font-iceberg shadow-lg"
                  style={{ boxShadow: '0px 4px 12px rgba(255, 0, 0, 0.4)' }}
                >
                  <div
                    className="relative group overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-500"
                  >
                    <div
                      className="relative w-full h-48 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                      style={{
                        backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})`,
                      }}
                    >
                      <div className="absolute inset-x-0 top-full transform -translate-y-1/2 flex justify-center">
                        <img
                          alt={unit.title}
                          src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
                          className="w-24 h-24 object-cover rounded-full border-4 border-black shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="pt-12 pb-4 text-center bg-black rounded-b-lg">
                      <Card.Meta
                        title={
                          <div className="text-center">
                            <span className="text-2xl font-oxanium">{unit.title}</span>
                          </div>
                        }
                        description={
                          <div className="text-center">
                            <p className="text-gray-300 font-kanit">
                              {unit.subtitle || "Aucune citation"}
                            </p>
                            <div className="mt-4">
                              <BadgeComponent type={unit.type} />
                            </div>
                            <div className="hidden group-hover:block mt-4 text-gray-100">
                              <p className="font-kanit">
                                {unit.intro || "Aucune introduction disponible."}
                              </p>
                            </div>
                          </div>
                        }
                      />
                      <div className="text-center mt-6">
                        <Link href={`/univers/units/${unit.id}`}>
                          <button className="bg-white hover:bg-gray-700 text-black hover:text-white font-semibold py-2 px-4 rounded transition-all duration-300 shadow-lg uppercase font-iceberg">
                            Explorer
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Badge.Ribbon>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UniversPage;
