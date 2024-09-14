// Import nécessaire pour l'ajout de notification avec boutons
import { useNotification } from '@/components/notifications/NotificationProvider';
import { fetchCurrentUser } from "@/lib/queries/AuthQueries";
import { useState, useEffect } from "react";

export const Pricing = () => {
  const { addNotification } = useNotification();
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false); // Ajouter un état pour vérifier l'abonnement

  // Vérifier si l'utilisateur est connecté et abonné
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user && user.id) {
          setUserId(user.id);
          setIsSubscribed(user.isSubscribed); // Assurez-vous que le champ `isSubscribed` existe dans les données utilisateur
        }
      } catch (error) {
        console.error("User not logged in");
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  // Gestion du clic sur "Commencer maintenant"
  const handleSubscription = async () => {
    if (!userId) {
      // Créer une notification pour les utilisateurs non connectés
      addNotification("critical", "Vous devez d'abord créer un compte pour continuer.", {
        primaryButtonLabel: "Créer un compte",
        secondaryButtonLabel: "Annuler",
        onPrimaryButtonClick: () => {
          window.location.href = "/auth/register"; // Redirection vers la page d'inscription
        },
        onSecondaryButtonClick: () => {
          console.log('Action annulée');
        },
      });
      return;
    }

    try {
      const response = await fetch('https://api.spectralunivers.com/payment/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();

      if (data.sessionUrl) {
        window.open(data.sessionUrl, '_blank'); // Ouvrir dans un nouvel onglet
      } else {
        addNotification("critical", "Une erreur s&apos;est produite lors de la création de l&apos;abonnement.");
      }
    } catch (error) {
      console.error('Subscription error:', error);
      addNotification("critical", "Erreur lors de la tentative de création de l&apos;abonnement.");
    }
  };

  return (
    <div className="px-6 py-20 mx-auto max-w-full md:px-24 lg:px-12 lg:py-24">
      <div className="max-w-4xl mb-12 md:mx-auto sm:text-center lg:w-full md:mb-14">
        <div>
          <p className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-teal-500 text-iceberg">
            Nouveau
          </p>
        </div>
        <h2 className="max-w-lg mb-8 font-iceberg text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="ace59d72-08d5-4850-b9e4-d9d0b86c0525"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#ace59d72-08d5-4850-b9e4-d9d0b86c0525)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative uppercase">Abonnement</span>
          </span>{' '}
        </h2>
        <p className="text-base text-white md:text-lg font-kanit">
          Abonnez-vous pour davantage de contenu.
        </p>
      </div>

      <div className="grid max-w-full gap-12 row-gap-8 lg:max-w-screen-lg lg:grid-cols-2 sm:mx-auto">
        {/* Carte Utilisation personnelle */}
        <div className="flex flex-col justify-between p-8 bg-black border border-gray-700 rounded-lg shadow-lg">
          <div className="mb-8">
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-600">
              <div>
                <p className="text-sm font-bold tracking-wider uppercase text-white font-kanit">
                  Plan Gratuit
                </p>
                <p className="text-5xl font-extrabold text-white font-iceberg mt-3">Gratuit</p>
              </div>
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-800">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeWidth="2"
                >
                  <path
                    d="M12,7L12,7 c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3h0c1.657,0,3,1.343,3,3v0C15,5.657,13.657,7,12,7z"
                    fill="none"
                    stroke="currentColor"
                  />
                  <path
                    d="M15,23H9v-5H7v-6 c0-1.105,0.895-2,2-2h6c1.105,0,2,0.895,2,2v6h-2V23z"
                    fill="none"
                    stroke="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="mb-4 font-bold tracking-wide text-white font-kanit">Fonctionnalités</p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeWidth="2"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        points="6,12 10,16 18,8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="11"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white font-kanit">Accès aux biographies</p>
                </li>
                <li className="flex items-center">
                  <div className="mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeWidth="2"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        points="6,12 10,16 18,8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="11"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white font-kanit">Accès aux galeries</p>
                </li>
                <li className="flex items-center">
                  <div className="mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeWidth="2"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        points="6,12 10,16 18,8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="11"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white font-kanit">
                    Création de profil pour commenter et noter
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <button
              className="inline-flex items-center justify-center w-full h-14 px-6 mb-4 font-medium tracking-wide text-white transition duration-200 bg-gray-800 rounded-lg shadow-md hover:bg-gray-900 focus:shadow-outline focus:outline-none font-kanit"
              disabled
            >
              Plan actuel
            </button>
            <p className="text-sm text-gray-400 italic font-kanit">
              Commencez dès aujourd&apos;hui sans engagement.
            </p>
          </div>
        </div>

        {/* Carte Utilisation pour équipe */}
        <div className="flex flex-col justify-between p-8 bg-black border border-gray-700 rounded-lg shadow-lg">
          <div className="mb-8">
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-600">
              <div>
                <p className="text-sm font-bold tracking-wider uppercase text-white font-kanit">
                  Plan payant
                </p>
                <p className="text-5xl font-extrabold text-white font-iceberg mt-3">05,00€/mois</p>
              </div>
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-800">
                <svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeWidth="2"
                >
                  <path
                    d="M12,7L12,7 c-1.657,0-3-1.343-3-3v0c0-1.657,1.343-3,3-3h0c1.657,0,3,1.343,3,3v0C15,5.657,13.657,7,12,7z"
                    fill="none"
                    stroke="currentColor"
                  />
                  <path
                    d="M15,23H9v-6H7v-5 c0-1.105,0.895-2,2-2h6c1.105,0,2,0.895,2,2v6h-2V23z"
                    fill="none"
                    stroke="currentColor"
                  />
                </svg>
              </div>
            </div>
            <div>
              <p className="mb-4 font-bold tracking-wide text-white font-kanit">Fonctionnalités</p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeWidth="2"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        points="6,12 10,16 18,8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="11"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white font-kanit">Accès aux biographies</p>
                </li>
                <li className="flex items-center">
                  <div className="mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeWidth="2"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        points="6,12 10,16 18,8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="11"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white font-kanit">
                    Accès aux galeries
                  </p>
                </li>
                <li className="flex items-center">
                  <div className="mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeWidth="2"
                    >
                      <polyline
                        fill="none"
                        stroke="currentColor"
                        points="6,12 10,16 18,8"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        fill="none"
                        r="11"
                        stroke="currentColor"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-white font-kanit">Commenter et noter</p>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <button
              className={`inline-flex items-center justify-center w-full h-14 px-6 mb-4 font-medium tracking-wide text-white transition duration-200 rounded-lg shadow-md font-kanit uppercase ${isSubscribed ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              onClick={handleSubscription}
              disabled={isSubscribed}
            >
              {isSubscribed ? 'Abonné' : 'Commencer maintenant'}
            </button>
            <p className="text-sm text-gray-400 font-kanit italic">
              Profitez d&apos;un service adapté à vos besoins professionnels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
