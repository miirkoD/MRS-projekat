import React from "react";

type FeatureCardsProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};
const FeatureCards: React.FC<FeatureCardsProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex flex-row text-gray-700 text-start items-start w-[592px]">
      {icon}
      <div className="flex flex-col ml-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCards;
