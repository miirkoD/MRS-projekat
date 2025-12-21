import SignupButton from '@/components/signup-button';
import React from 'react';

const Hero = () => {
  return (
    <div className="flex flex-row justify-between px-[71px] items-center py-[40px]">
      <div className="flex flex-col h-[518px] w-[700px] text-start items-center justify-center  gap-[40px]">
        <div className="flex flex-col gap-[16px]">
          <h1 className="font-semibold text-[95px] text-gray-700">
            Uvek čist dom, bez truda
          </h1>
          <span className="text-[18px] text-gray-700 text-start font-light">
            Zaboravite na kućne poslove. Naš profesionalni tim dolazi kada vama
            odgovara - jednom, tri puta ili pet puta nedeljno. Vi birate ritam,
            mi garantujemo čistoću.
          </span>
        </div>
        <SignupButton
          btnText="Izaberite Svoj Plan →"
          className="hover:bg-gray-700"
        />
      </div>

      <img className="w-[540px] h-[518px]" src="./Image.png" />
    </div>
  );
};

export default Hero;
