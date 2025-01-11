import React, { useState } from "react";

interface AccordionProps {
  backgroundColor?: string;
  textColor?: string;
}

interface AccordionItemProps {
  header: string;
  text: string;
  textColor?: string;
  backgroundColor?: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  header,
  text,
  textColor = 'text-white',
  backgroundColor = 'bg-transparent',
}) => {
  const [active, setActive] = useState(false);

  const handleToggle = () => {
    setActive(!active);
  };

  return (
    <div
      className={`mb-8 w-full rounded-lg p-4 shadow-lg ${active ? backgroundColor : "bg-transparent"}`}
    >
      <button
        className="faq-btn flex w-full text-left"
        onClick={handleToggle}
      >
        <div className="mr-5 flex h-10 w-full max-w-[40px] items-center justify-center rounded-lg bg-primary/5 text-primary dark:bg-white/5">
          <svg
            className={`fill-primary stroke-primary duration-200 ease-in-out ${active ? "rotate-180" : ""}`}
            width="17"
            height="10"
            viewBox="0 0 17 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.28687 8.43257L7.28679 8.43265L7.29496 8.43985C7.62576 8.73124 8.02464 8.86001 8.41472 8.86001C8.83092 8.86001 9.22376 8.69083 9.53447 8.41713L9.53454 8.41721L9.54184 8.41052L15.7631 2.70784L15.7691 2.70231L15.7749 2.69659C16.0981 2.38028 16.1985 1.80579 15.7981 1.41393C15.4803 1.1028 14.9167 1.00854 14.5249 1.38489L8.41472 7.00806L2.29995 1.38063L2.29151 1.37286L2.28271 1.36548C1.93092 1.07036 1.38469 1.06804 1.03129 1.41393L1.01755 1.42738L1.00488 1.44184C0.69687 1.79355 0.695778 2.34549 1.0545 2.69659L1.05999 2.70196L1.06565 2.70717L7.28687 8.43257Z"
              fill=""
              stroke=""
            />
          </svg>
        </div>
        <div className="w-full">
          <h4 className={`mt-1 text-lg font-semibold ${textColor} dark:text-white`}>
            {header}
          </h4>
        </div>
      </button>
      <div
        className={`pl-[62px] duration-200 ease-in-out ${active ? "block" : "hidden"}`}
      >
        <p className={`py-3 text-base leading-relaxed ${textColor} dark:text-dark-6`}>
          {text}
        </p>
      </div>
    </div>
  );
};

const Accordion: React.FC<AccordionProps> = ({
  backgroundColor = "bg-transparent",
  textColor = "text-white",
}) => {
  return (
    <section
      className={`relative z-20 overflow-hidden pb-12 pt-20 ${backgroundColor} lg:pb-[90px] lg:pt-[9                             0px]`}
    >
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-semibold text-primary">
                FAQ
              </span>
              <h2
                className={`mb-4 text-3xl font-bold ${textColor} dark:text-white sm:text-[40px]/[48px]`}
              >
                Des Questions? Retrouvez ici vos Réponses
              </h2>
              <p className={`text-base ${textColor} dark:text-dark-6`}>
                Voici les réponses aux questions les plus fréquemment posées sur
                notre plateforme.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="Qu&apos;est-ce que le yoga bouddhiste ?"
              text="Le yoga bouddhiste est une pratique spirituelle alliant méditation, mouvements conscients et enseignements bouddhistes pour cultiver la paix intérieure et l&apos;éveil spirituel."
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
            <AccordionItem
              header="Comment puis-je rejoindre la communauté?"
              text="Vous pouvez rejoindre notre communauté en vous inscrivant sur notre site. Une fois inscrit, vous aurez accès à des forums, des événements, et bien plus encore."
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
            <AccordionItem
              header="Comment élever son niveau d&apos;esprit ?"
              text="Élevez votre niveau d&apos;esprit grâce à nos pratiques guidées, à la méditation quotidienne et à l&apos;apprentissage des principes bouddhistes."
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <AccordionItem
              header="Comment puis-je contacter l&apos;équipe?"
              text="Vous pouvez nous contacter via la section Contact du site. Nous sommes toujours prêts à vous aider et à répondre à vos questions."
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
            <AccordionItem
              header="Quels sont les avantages de rejoindre Seranya?"
              text="Rejoindre Seranya, c&apos;est accéder à des ressources exclusives, une communauté bienveillante et un soutien personnalisé pour votre cheminement spirituel."
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
            <AccordionItem
              header="Comment suivre les mises à jour de Seranya?"
              text="Abonnez-vous à notre newsletter ou suivez-nous sur nos réseaux sociaux pour rester informé des actualités et des nouveautés."
              textColor={textColor}
              backgroundColor={backgroundColor}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Accordion;
