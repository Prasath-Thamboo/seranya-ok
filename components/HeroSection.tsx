import React from "react";

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
  titleColor: string;
  strongTitle: string;
  strongTitleColor: string;
  content: string;
  contentColor: string;
  button1Text: string;
  button1Url: string;
  button1BgColor: string;
  button2Text: string;
  button2Url: string;
  button2BgColor: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  title,
  titleColor,
  strongTitle,
  strongTitleColor,
  content,
  contentColor,
  button1Text,
  button1Url,
  button1BgColor,
  button2Text,
  button2Url,
  button2BgColor,
}) => {
  return (
    <section
      className={`relative bg-cover bg-center bg-no-repeat`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"></div>

      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
        <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className={`text-3xl font-extrabold sm:text-5xl`} style={{ color: titleColor }}>
            {title}
            <strong className={`block font-extrabold`} style={{ color: strongTitleColor }}>
              {strongTitle}
            </strong>
          </h1>

          <p className={`mt-4 max-w-lg sm:text-xl/relaxed`} style={{ color: contentColor }}>
            {content}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center">
            <a
              href={button1Url}
              className={`block w-full rounded px-12 py-3 text-sm font-medium text-white shadow hover:opacity-90 focus:outline-none focus:ring sm:w-auto`}
              style={{ backgroundColor: button1BgColor }}
            >
              {button1Text}
            </a>

            <a
              href={button2Url}
              className={`block w-full rounded px-12 py-3 text-sm font-medium shadow hover:opacity-90 focus:outline-none focus:ring sm:w-auto`}
              style={{ backgroundColor: button2BgColor }}
            >
              {button2Text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
