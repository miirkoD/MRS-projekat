import CheckIcon from '@/assets/check-icon';
import SubscriptionButton from '@/components/subscription-button';
import React from 'react';

const popularCard = [
  '3x čišćenje nedeljno',
  'Sva osnovna čišćenja',
  'Pranje sudova i sređivanje',
  'Čišćenje terase/balkona',
  'Prioritetna podrška',
];
const weekly = [
  '1x čišćenje nedeljno',
  'Osnovno čišćenje prostora',
  'Fleksibilno zakazivanje',
];
const intensive = [
  '5x čišćenje nedeljno',
  'Sve iz Trostrukog plana',
  'Dubinsko čišćenje mesečno',
];
const SubscriptionSection = () => {
  return (
    <div className="flex flex-col pt-[80px] gap-[80px] pb-[80px]">
      <div className="flex flex-col text-gray-700 items-center justify-center text-center ">
        <h1 className="text-[60px]">Izaberite Plan Koji Vam Odgovara</h1>
        <span className="text-[18px]">
          Transparentne cene, bez skrivenih troškova. Otkažite ili promenite
          plan u bilo kom monentu.
        </span>
      </div>
      <div className="h-[564px] w-full bg-[linear-gradient(to_bottom,#A093AA_462px,white_462px)] flex flex-row items-center content-center justify-center">
        <div className="h-[455px] w-[347px] shadow-xl border  rounded-md">
          <div className="text-gray-900 flex flex-col items-center text-center justify-center bg-white h-[188px] rounded-t-md shadow-md">
            <span className="text-[30px] text-gray-500">Nedeljni</span>
            <div className="flex flex-row items-center text-center justify-center gap-[12px] ">
              <span className="text-[36px] text-[#036A5F]">$</span>
              <span className="  text-[#036A5F]  text-6xl leading-none font-extrabold tracking-tight">
                79
              </span>
              <span className="text-[24px] text-gray-500">/mesečno</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-md h-[266px] flex flex-col ">
            <div className="flex flex-col items-start items-start text-start  gap-[16px] px-[40px] py-[40px]">
              {weekly.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-center content-center gap-[12px]"
                >
                  <CheckIcon />
                  <span className="text-gray-500 text-[16px]">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex content-center items-center justify-center px-[32px] ">
              <SubscriptionButton
                txt="Odaberi plan"
                className="h-[50px] bg-white text-gray-500  hover:bg-gray-100"
              />
            </div>
          </div>
        </div>
        <div className="h-[564px] w-[488px] shadow-xl border border-[#036A5F] rounded-md">
          <div className="text-gray-900 flex flex-col items-center text-center justify-center bg-white h-[200px] rounded-t-md shadow-md">
            <span className="text-[30px] text-gray-500">Trostruki</span>
            <div className="flex flex-row items-center text-center justify-center gap-[12px] ">
              <span className="text-[36px] text-[#036A5F]">$</span>
              <span className="  text-[#036A5F]  text-6xl leading-none font-extrabold tracking-tight">
                149
              </span>
              <span className="text-[24px] text-gray-500">/mesečno</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-md h-[362px] flex flex-col ">
            <div className="flex flex-col items-start items-start text-start  gap-[16px] px-[40px] py-[40px]">
              {popularCard.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-center content-center gap-[12px]"
                >
                  <CheckIcon />
                  <span className="text-gray-500 text-[16px]">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex content-center items-center justify-center px-[40px] ">
              <SubscriptionButton
                txt="Odaberi plan"
                className="h-[58px] bg-[#A093AA]
        hover:bg-[#8F7F9A]
        text-white"
              />
            </div>
          </div>
        </div>
        <div className="h-[455px] w-[347px] shadow-xl border  rounded-md">
          <div className="text-gray-900 flex flex-col items-center text-center justify-center bg-white h-[188px] rounded-t-md shadow-md">
            <span className="text-[30px] text-gray-500">Nedeljni</span>
            <div className="flex flex-row items-center text-center justify-center gap-[12px] ">
              <span className="text-[36px] text-[#036A5F]">$</span>
              <span className="  text-[#036A5F]  text-6xl leading-none font-extrabold tracking-tight">
                79
              </span>
              <span className="text-[24px] text-gray-500">/mesečno</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-md h-[266px] flex flex-col ">
            <div className="flex flex-col items-start items-start text-start  gap-[16px] px-[40px] py-[40px]">
              {intensive.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-center content-center gap-[12px]"
                >
                  <CheckIcon />
                  <span className="text-gray-500 text-[16px]">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex content-center items-center justify-center px-[32px] ">
              <SubscriptionButton
                txt="Odaberi plan"
                className="h-[50px] bg-white text-gray-500 hover:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;
