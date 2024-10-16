// spectralnext/app/page.tsx

'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "antd";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { UnitModel, UnitType } from "@/lib/models/UnitModels";
import HeroSection from "@/components/HeroSection";
import Accordion from "@/components/Accordion";
import Carousel from "@/components/Carousel";
import { FaCheck } from "react-icons/fa";
import Loader from "@/components/Loader";
import { motion } from "framer-motion";
import Footer from "@/components/Footer"; // Import du Footer
import { fetchRandomBackground, fetchRandomBackgrounds } from "@/lib/queries/RandomBackgroundQuery"; // Import de la nouvelle fonction

const includedFeatures: string[] = [
  "Accès aux nouvelles de chaque personnage",
  "Ressources des membres",
  "Inscription à la newsletter",
  "T-shirt officiel des membres",
];

// Animation settings
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home: React.FC = () => {
  const [carouselItems, setCarouselItems] = useState<
    Array<{ image: string; title: string; subtitle: string }>
  >([]);
  const [sectionImages, setSectionImages] = useState<string[]>([]);
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const totalImagesCount = 12; // 5 (carousel) + 6 (section) + 1 (background)

  const handleImageLoad = () => {
    setLoadedImagesCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount >= totalImagesCount) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  useEffect(() => {
    const loadUnits = async () => {
      try {
        const fetchedUnits: UnitModel[] = await fetchUnits();

        const sortedUnits = fetchedUnits
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3); // Prendre les 3 unités récentes

        setUnits(sortedUnits);
      } catch (error) {
        console.error("Failed to load units:", error);
      }
    };

    const fetchBackgroundImage = async () => {
      try {
        const imageUrl: string = await fetchRandomBackground();
        setBackgroundImage(imageUrl);
        handleImageLoad(); // Incrémente le compteur après avoir défini l'image
      } catch (error) {
        console.error("Failed to load background image:", error);
        // Vous pouvez définir une image de fallback ici si nécessaire
        setBackgroundImage("/images/backgrounds/default.jpg");
        handleImageLoad(); // Incrémente le compteur même en cas d'erreur
      }
    };

    const loadCarouselImages = async () => {
      try {
        const data: string[] = await fetchRandomBackgrounds(5);

        setCarouselItems(
          data.map((imagePath: string, index: number) => ({
            image: imagePath,
            title: `Image ${index + 1}`,
            subtitle: "Sous-titre du carrousel",
          }))
        );

        // Incrémente le compteur pour chaque image du carrousel
        data.forEach(() => handleImageLoad());
      } catch (error) {
        console.error("Failed to load carousel images:", error);
        // Vous pouvez définir des images de fallback ici si nécessaire
        setCarouselItems([]);
        // Incrémente le compteur pour chaque image manquante
        for (let i = 0; i < 5; i++) {
          handleImageLoad();
        }
      }
    };

    const loadSectionImages = async () => {
      try {
        const data: string[] = await fetchRandomBackgrounds(6);
        setSectionImages(data);

        // Incrémente le compteur pour chaque image de section
        data.forEach(() => handleImageLoad());
      } catch (error) {
        console.error("Failed to load section images:", error);
        // Vous pouvez définir des images de fallback ici si nécessaire
        setSectionImages([]);
        // Incrémente le compteur pour chaque image manquante
        for (let i = 0; i < 6; i++) {
          handleImageLoad();
        }
      }
    };

    loadUnits();
    fetchBackgroundImage();
    loadCarouselImages();
    loadSectionImages();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="flex flex-col items-center justify-start w-full font-kanit relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority={true}
          quality={100}
          onLoad={handleImageLoad}
          unoptimized={true} // Désactive l'optimisation si nécessaire
        />
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
      </div>

      {/* Carousel */}
      <Carousel
        items={carouselItems}
        height="100vh"
        width="100vw"
        onLoad={handleImageLoad} // Passer handleImageLoad si nécessaire
      /> {/* Passer handleImageLoad */}

      {/* Hero Section */}
      <motion.section
        className="relative pt-16 pb-32 flex content-center items-center justify-center w-full bg-transparent z-10"
        style={{ minHeight: "75vh" }}
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <div className="container relative mx-auto z-10">
          <div className="items-center flex flex-wrap">
            <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
              <div className="pr-12">
                <h1 className="text-white font-semibold text-5xl">
                  Votre aventure commence ici.
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                  Plongez dans le monde fascinant de Spectral, où chaque choix
                  peut transformer votre destinée.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section des Unités récentes */}
      <motion.section
        className="relative py-16 px-8 w-full z-20"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        {sectionImages[1] && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-center bg-cover z-0"
            style={{
              backgroundImage: `url(${sectionImages[1]})`,
              filter: "brightness(70%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        )}

        <div className="relative z-10 container mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center font-iceberg uppercase">
            Explorer l&apos;encyclopédie
          </h2>
          <p className="text-lg text-gray-300 mb-12 text-center">
            Plongez dans le bestiaire de Spectral.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {units[0] && (
              <div className="lg:col-span-1 border rounded border-gray-900 shadow-lg">
                <Link href={`/univers/units/${units[0].id}`}>
                  <Badge.Ribbon
                    text="NEW"
                    color="red"
                    className="font-iceberg z-30"
                  >
                    <div className="relative group overflow-hidden rounded-lg shadow-lg">
                      <div
                        className="relative w-full h-[30rem] bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${units[0].headerImage || "/images/backgrounds/placeholder.jpg"})`,
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-end items-center z-20 bg-gradient-to-b from-transparent to-black/70 p-4">
                        <div className="flex justify-center">
                          {units[0].profileImage ? (
                            <div className="w-24 h-24 relative rounded-full border border-gray-600 shadow-lg overflow-hidden">
                              <Image
                                src={units[0].profileImage}
                                alt={units[0].title}
                                layout="fill"
                                objectFit="cover"
                                className="object-cover"
                                onLoad={handleImageLoad}
                              />
                            </div>
                          ) : (
                            <Image
                              src="/images/backgrounds/placeholder.jpg"
                              alt="Placeholder"
                              width={100}
                              height={100}
                              className="rounded-full border border-gray-600 object-cover shadow-lg"
                              onLoad={handleImageLoad}
                            />
                          )}
                        </div>

                        <div className="flex flex-col justify-center items-center text-center mt-4">
                          <h3 className="text-4xl font-bold text-white font-iceberg uppercase">
                            {units[0].title}
                          </h3>
                          <p className="text-lg text-gray-300 font-kanit">
                            {units[0].subtitle || "Aucune description"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </Link>
              </div>
            )}

            <div className="lg:col-span-1 grid grid-rows-2 gap-4">
              {units.slice(1, 3).map((unit: UnitModel) => (
                <Link href={`/univers/units/${unit.id}`} key={unit.id} className="border-gray-900 shadow-lg">
                  <Badge.Ribbon text="NEW" color="red" className="font-iceberg z-30">
                    <div className="relative group overflow-hidden rounded-lg border-gray-900 shadow-lg">
                      <div
                        className="relative w-full h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${unit.headerImage || "/images/backgrounds/placeholder.jpg"})`,
                          backgroundPosition: "center", // Ajustement de la position
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-end items-center z-20 bg-gradient-to-b from-transparent to-black/70 p-4">
                        <h3 className="text-2xl font-bold text-white font-iceberg uppercase">
                          {unit.title || "No Title"}
                        </h3>
                        <p className="text-sm text-gray-300 font-kanit">
                          {unit.subtitle || "No Description"}
                        </p>
                      </div>
                    </div>
                  </Badge.Ribbon>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Finisher Section */}
      <section className="pb-20 relative block w-full bg-transparent">
        {sectionImages[5] && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${sectionImages[5]})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              filter: "brightness(70%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        )}
        <div className="container mx-auto px-4 lg:pt-24 lg:pb-64 relative z-10">
          <div className="flex flex-wrap text-center justify-center">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-white mb-8 text-center font-iceberg uppercase">
                Construisons Ensemble
              </h2>
              <p className="text-lg leading-relaxed mt-4 mb-4 text-gray-300">
                Nous offrons des services d&apos;excellence pour vous aider à
                concrétiser vos projets.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap mt-12 justify-center">
            <div className="w-full lg:w-3/12 px-4 text-center">
              <div className="text-gray-900 p-3 w-12 h-12 shadow-lg rounded-full bg-white inline-flex items-center justify-center">
                <i className="fas fa-medal text-xl"></i>
              </div>
              <h6 className="text-xl mt-5 font-semibold text-white">
                Excellence Garantie
              </h6>
              <p className="mt-2 mb-4 text-gray-300">
                Nos services sont conçus pour garantir le succès de votre
                projet.
              </p>
            </div>
            {/* Répétez pour d'autres caractéristiques */}
          </div>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
          style={{ height: "70px" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="fill-current text-transparent"
              points="2560 0 2560 100 0 100"
              style={{ fill: "rgba(0, 0, 0, 0)" }} // Remplissage transparent
            ></polygon>
          </svg>
        </div>
      </section>

      {/* Pricing Section */}
      <motion.section
        className="relative z-20 bg-transparent py-24 sm:py-32 w-full"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        {/* Image de fond de la section */}
        {sectionImages[4] && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-center bg-cover z-0" // z-0 pour l'image de fond
            style={{
              backgroundImage: `url(${sectionImages[4]})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              filter: "brightness(60%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        )}

        {/* Contenu de la section */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 mb-40"> {/* z-10 pour le contenu */}
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceberg">
              Une tarification simple, sans surprise
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300 font-kanit">
              Découvrez notre offre transparente et adaptée à vos besoins, que vous soyez une personne ou une équipe.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-white font-iceberg">Abonnement à vie</h3>
              <p className="mt-6 text-base leading-7 text-gray-300 font-kanit">
                Profitez d&#39;un accès illimité à tous nos services pour une seule et unique fois.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">Ce qui est inclus</h4>
                <div className="h-px flex-auto bg-gray-100" />
              </div>
              <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-300 sm:grid-cols-2 sm:gap-6">
                {includedFeatures.map((feature: string) => (
                  <li key={feature} className="flex gap-x-3">
                    <FaCheck aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600">Un paiement unique, pour un accès à vie</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">5.00€</span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">EUR</span>
                  </p>
                  <Link
                    href="/subscription"
                    className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    passHref
                  >
                    Obtenez l&#39;accès
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="relative block py-24 lg:pt-0 w-full bg-transparent-mt-32 z-20"
        initial="hidden"
        whileInView="visible"
        variants={fadeInUp}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 z-20">
                <div className="flex-auto p-5 lg:p-10">
                  <h4 className="text-2xl font-semibold">Travaillons Ensemble</h4>
                  <p className="leading-relaxed mt-1 mb-4 text-gray-600">
                    Remplissez ce formulaire et nous vous répondrons sous 24
                    heures.
                  </p>
                  <div className="relative w-full mb-3 mt-8">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="full-name"
                    >
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      placeholder="Nom complet"
                      style={{ transition: "all .15s ease" }}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      placeholder="Email"
                      style={{ transition: "all .15s ease" }}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-gray-700 text-xs font-bold mb-2"
                      htmlFor="message"
                    >
                      Message
                    </label>
                    <textarea
                      rows={4}
                      cols={80}
                      className="border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full"
                      placeholder="Tapez un message..."
                    />
                  </div>
                  <div className="text-center mt-6">
                    <button
                      className="bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                      style={{ transition: "all .15s ease" }}
                    >
                      Envoyer le message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section FAQ */}
      <Accordion backgroundColor="bg-transparent" textColor="text-white" />

      {/* Footer */}
      <Footer onLoad={handleImageLoad} />
    </main>
  );
};

export default Home;
