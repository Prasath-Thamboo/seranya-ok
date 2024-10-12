"use client";

import React, { useEffect, useMemo, useState } from "react";
import Table from "@/components/Table";
import CardList from "@/components/CardList";
import { SidebarContent } from "@/components/dashboard/SidebarContent";
import { fetchUnits } from "@/lib/queries/UnitQueries";
import { UnitModel } from "@/lib/models/UnitModels";
import { Image } from "antd";
import Badge from "@/components/Badge";
import { useNotification } from "@/components/notifications/NotificationProvider";
import Link from "next/link";
import { FaEye, FaEdit } from "react-icons/fa";
import { motion } from "framer-motion"; // Import de Framer Motion

const UnitsPage = () => {
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { addNotification } = useNotification();

  // Définir l'URL de base en fonction de l'environnement
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL_PROD ||
    process.env.NEXT_PUBLIC_API_URL_LOCAL ||
    "http://localhost:5000";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mode mobile si l'écran <= 768px
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUnits = await fetchUnits();

        const unitsWithImages = fetchedUnits.map((unit: UnitModel) => {
          // Construction de l'URL de l'image de profil comme dans la page de vue détaillée
          const profileImage = `${backendUrl}/uploads/units/${unit.id}/ProfileImage.png`;

          return {
            ...unit,
            profileImage,
          };
        });

        setUnits(unitsWithImages);
      } catch (error) {
        console.error("Erreur lors de la récupération des unités:", error);
        addNotification("critical", "Erreur lors de la récupération des unités.");
      }
    };
    fetchData();
  }, [addNotification, backendUrl]);

  const handleDelete = async (deletedUnit: UnitModel) => {
    try {
      // Re-fetch data from the server after a delete
      const fetchedUnits = await fetchUnits();
      const unitsWithImages = fetchedUnits.map((unit: UnitModel) => {
        const profileImage = `${backendUrl}/uploads/units/${unit.id}/ProfileImage.png`;
        return {
          ...unit,
          profileImage,
        };
      });
      setUnits(unitsWithImages);
      addNotification("success", "Unité supprimée avec succès.");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des unités après suppression :",
        error
      );
      addNotification(
        "critical",
        "Erreur lors de la mise à jour des unités après suppression."
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Titre",
        accessor: "title",
        Cell: ({ row, value }: any) => (
          <div className="flex flex-col items-center gap-2 p-2">
            <Image
              src={row.original.profileImage || "/images/backgrounds/placeholder.jpg"}
              alt={`${value}'s Avatar`}
              width={60} // Dimension réduite pour une meilleure intégration
              height={60}
              style={{ borderRadius: "50%", objectFit: "cover" }} // Image ronde
              preview={false} // Désactiver le zoom pour une intégration fluide
              className="border-2 border-gray-300 shadow-lg z-20" // Bordure et ombre pour la visibilité
            />
            <div className="text-center">{value}</div>
          </div>
        ),
      },
      {
        Header: "Introduction",
        accessor: "intro",
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap text-gray-700">{value}</div>
        ),
      },
      {
        Header: "Sous-titre",
        accessor: "subtitle",
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap text-gray-700">{value}</div>
        ),
      },
      {
        Header: "Histoire",
        accessor: "story",
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap text-gray-700">{value}</div>
        ),
      },
      {
        Header: "Biographie",
        accessor: "bio",
        Cell: ({ value }: any) => (
          <div className="whitespace-pre-wrap text-gray-700">{value}</div>
        ),
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ value }: any) => <Badge type={value} />,
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }: any) => (
          <div className="flex space-x-2">
            <Link href={`/admin/units/${row.original.id}`}>
              <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                <FaEye />
              </button>
            </Link>
            <Link href={`/admin/units/update?id=${row.original.id}`}>
              <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
                <FaEdit />
              </button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  // Définir la fonction renderItem pour les unités
  const renderUnitItem = (unit: UnitModel) => (
    <div
      key={unit.id}
      className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center space-y-4"
    >
      <div className="relative w-full h-48">
        <Image
          src={unit.profileImage || "/images/backgrounds/placeholder.jpg"}
          alt={`${unit.title}'s Avatar`}
          className="rounded-lg w-full h-full object-cover"
          style={{ objectFit: "cover", borderRadius: "8px", maxHeight: "100%" }}
          width={300} // Dimension adaptée pour les cartes
          height={192}
        />
      </div>
      <h3 className="text-xl font-bold text-center text-black font-iceberg uppercase">
        {unit.title}
      </h3>
      <p className="text-center text-gray-600">{unit.intro}</p>

      <div className="flex space-x-2">
        <Link href={`/admin/units/${unit.id}`}>
          <div className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition cursor-pointer">
            <FaEye />
          </div>
        </Link>
        <Link href={`/admin/units/update?id=${unit.id}`}>
          <div className="p-2 bg-black text-white rounded-full hover:bg-gray-700 transition cursor-pointer">
            <FaEdit />
          </div>
        </Link>
      </div>
    </div>
  );

  // Framer Motion variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="p-6 font-kanit relative">
      <h1 className="text-2xl font-bold text-black mb-6 font-oxanium uppercase">Units</h1>
      {isMobile ? (
        <>
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="mb-6"
          >
            <CardList items={units} itemsPerPage={4} renderItem={renderUnitItem} />
          </motion.div>
          <SidebarContent collapsed={false} toggleSidebar={() => {}} />
        </>
      ) : (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <Table
            data={units}
            columns={columns}
            createButtonText="Créer une unité"
            createUrl="/admin/units/create"
            onDelete={handleDelete}
            baseRoute="admin/units"
            apiRoute="units"
            itemType="unité"
          />
        </motion.div>
      )}
    </div>
  );
};

export default UnitsPage;
