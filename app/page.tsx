"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Carousel from "@/components/Carousel";
import Accordion from "@/components/Accordion";

const Home = () => {
  const [carouselItems, setCarouselItems] = useState<
    Array<{ image: string; title: string; subtitle: string }>
  >([]);
  const [sectionImages, setSectionImages] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  useEffect(() => {
    const loadImages = async () => {
      try {
        const promises = Array.from({ length: 7 }).map(() =>
          fetch("/api/getRandomImage").then((res) => res.json())
        );

        const data = await Promise.all(promises);

        setCarouselItems(
          data.slice(0, 5).map((item, index) => ({
            image: item.imagePath,
            title: `Plongez dans l&apos;Univers ${index + 1}`,
            subtitle: "Découvrez les mystères de Spectral",
          }))
        );

        setSectionImages(data.slice(0, 6).map((item) => item.imagePath));
        setBackgroundImage(data[6].imagePath);
      } catch (error) {
        console.error("Failed to load images:", error);
      }
    };

    loadImages();
  }, []);

  if (!backgroundImage) {
    // Avoid rendering the entire page until the images are loaded
    return null; 
  }

  return (
    <main className="flex flex-col items-center justify-start w-full font-kanit bg-black text-white">
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
        />
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
      </div>

      {/* Carousel */}
      <Carousel items={carouselItems} height="100vh" width="100vw" />

      {/* Hero Section */}
      <section
        className="relative pt-16 pb-32 flex content-center items-center justify-center w-full bg-transparent z-10"
        style={{ minHeight: "75vh" }}
      >
        {sectionImages[0] && (
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover z-0"
            style={{
              backgroundImage: `url(${sectionImages[0]})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              filter: "brightness(60%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        )}
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
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden z-10"
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
              className="text-gray-900 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 w-full bg-transparent">
        {sectionImages[1] && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${sectionImages[1]})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              filter: "brightness(70%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap">
            <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-transparent w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-red-400">
                    <i className="fas fa-award"></i>
                  </div>
                  <h6 className="text-xl font-semibold">Expertise Reconnue</h6>
                  <p className="mt-2 mb-4 text-gray-300">
                    Notre équipe a remporté de nombreux prix grâce à son travail
                    innovant dans le domaine du développement web.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-transparent w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-blue-400">
                    <i className="fas fa-retweet"></i>
                  </div>
                  <h6 className="text-xl font-semibold">Révisions Flexibles</h6>
                  <p className="mt-2 mb-4 text-gray-300">
                    Nous garantissons des révisions illimitées pour que votre
                    projet soit exactement comme vous le souhaitez.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 w-full md:w-4/12 px-4 text-center">
              <div className="relative flex flex-col min-w-0 break-words bg-transparent w-full mb-8 shadow-lg rounded-lg">
                <div className="px-4 py-5 flex-auto">
                  <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-green-400">
                    <i className="fas fa-fingerprint"></i>
                  </div>
                  <h6 className="text-xl font-semibold">
                    Sécurité de Haut Niveau
                  </h6>
                  <p className="mt-2 mb-4 text-gray-300">
                    Nous offrons une protection robuste pour vos données et
                    celles de vos utilisateurs, assurant une tranquillité
                    d&apos;esprit totale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center mt-32">
            <div className="w-full md:w-5/12 px-4 mr-auto ml-auto">
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg rounded-full bg-gray-800">
                <i className="fas fa-user-friends text-xl"></i>
              </div>
              <h3 className="text-3xl mb-2 font-semibold leading-normal">
                Une Expérience de Travail Collaborative
              </h3>
              <p className="text-lg font-light leading-relaxed mt-4 mb-4 text-gray-300">
                Travailler avec nous, c&apos;est collaborer avec une équipe qui
                valorise la transparence, la communication et l&apos;excellence.
              </p>
              <p className="text-lg font-light leading-relaxed mt-0 mb-4 text-gray-300">
                Nous nous assurons que chaque projet reflète la vision unique de
                nos clients.
              </p>
              <a href="#" className="font-bold text-white mt-8">
                Découvrir notre processus
              </a>
            </div>

            <div className="w-full md:w-4/12 px-4 mr-auto ml-auto">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-transparent">
                {sectionImages[2] && (
                  <Image
                    alt="Service qualité"
                    src={sectionImages[2]}
                    className="w-full align-middle rounded-t-lg"
                    layout="responsive"
                    width={700}
                    height={475}
                  />
                )}
                <blockquote className="relative p-8 mb-4">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute left-0 w-full block"
                    style={{
                      height: "95px",
                      top: "-94px",
                    }}
                  >
                    <polygon
                      points="-30,95 583,95 583,65"
                      className="text-gray-800 fill-current"
                    ></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-white">
                    Services de Qualité
                  </h4>
                  <p className="text-md font-light mt-2 text-white">
                    Chaque projet est conçu pour offrir une immersion totale
                    dans un monde où le danger rôde à chaque coin.
                  </p>
                </blockquote>
              </div>
            </div>
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
              className="transparent fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-20 pb-48 w-full bg-transparent">
        {sectionImages[4] && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage: `url(${sectionImages[4]})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              filter: "brightness(70%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap justify-center text-center mb-24">
            <div className="w-full lg:w-6/12 px-4">
              <h2 className="text-4xl font-semibold text-white">
                Découvrez notre équipe
              </h2>
              <p className="text-lg leading-relaxed m-4 text-gray-300">
                Notre équipe est composée d&apos;experts passionnés, chacun
                apportant une contribution unique à nos projets.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
              <div className="px-6">
                <Image
                  alt="Team Member"
                  src="/images/team-1.jpg"
                  className="shadow-lg rounded-full max-w-full mx-auto"
                  style={{ maxWidth: "120px" }}
                  layout="responsive"
                  width={120}
                  height={120}
                />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold text-white">Ryan Tompson</h5>
                  <p className="mt-1 text-sm text-gray-400 uppercase font-semibold">
                    Développeur Web
                  </p>
                  <div className="mt-6">
                    <button
                      className="bg-blue-400 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-twitter"></i>
                    </button>
                    <button
                      className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </button>
                    <button
                      className="bg-pink-500 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                      type="button"
                    >
                      <i className="fab fa-dribbble"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Répétez pour d'autres membres de l'équipe */}
          </div>
        </div>
      </section>

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
              <h2 className="text-4xl font-semibold text-white">
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
    style={{ fill: 'rgba(0, 0, 0, 0)' }} // Remplissage transparent
  ></polygon>
</svg>

        </div>
      </section>

      {/* Contact Section */}
      <section className="relative block py-24 lg:pt-0 w-full bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:-mt-64 -mt-48">
            <div className="w-full lg:w-6/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300">
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
      </section>

      {/* Section FAQ */}
      <Accordion backgroundColor="bg-transparent" textColor="text-white" />
    </main>
  );
};

export default Home;