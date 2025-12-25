import React, { JSX } from 'react';

type SocialMediaButtonsProps = {
  svg: JSX.Element;
};

const SocialMediaButtons: React.FC<SocialMediaButtonsProps> = ({ svg }) => {
  return (
    <button className="w-[114px] h-[38px] shadow-sm border border-gray-300 flex content-center items-center justify-center rounded-sm hover:bg-gray-100">
      {svg}
    </button>
  );
};

export default SocialMediaButtons;
