import CalendarIcon from "@/assets/calendar-icon";
import CleaningSvg from "@/assets/cleaning-svg";
import RepeatIcon from "@/assets/repeat-icon";
import StarIcon from "@/assets/star-icon";
import FeatureCards from "@/components/feature-cards";
import FeatureHeader from "@/components/feature-header";
import React from "react";

const firstCol = [
  {
    icon: <CleaningSvg />,
    title: "Izaberi plan",
    description: "Odaberite plan koji odgovara vašem ritmu i potrebama",
  },
  {
    icon: <StarIcon />,
    title: "Uživajte u Čistoći",
    description:
      "Naš profesionalni tim dolazi i brine se o svemu. Vi samo uživate u čistom domu.",
  },
];
const secondCol = [
  {
    icon: <CalendarIcon />,
    title: "Zakažite Termin",
    description:
      "Online zakazivanje u nekoliko klikova. Fleksibilno prilagođavamo termine vašem rasporedu.",
  },
  {
    icon: <RepeatIcon />,
    title: "Redovno Održavanje",
    description:
      "Automatsko zakazivanje prema vašoj pretplati. Bez brige, bez obaveza.",
  },
];
const FeatureSection = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-[32px]">
      <FeatureHeader />
      <div className="flex flex-row gap-[32px]">
        <div className="flex flex-col gap-[93px]">
          {firstCol.map((item, index) => (
            <FeatureCards
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
        <div className="flex flex-col gap-[69px]">
          {secondCol.map((item, index) => (
            <FeatureCards
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
