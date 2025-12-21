import Logo from '@/assets/logo';
import SignupButton from '@/components/signup-button';
import React from 'react';

const Footer = () => {
  return (
    <div className="h-[354px] bg-[#A093AA] flex flex-row content-center">
      <div className="flex flex-col justify-between py-[32px] px-[40px] w-[600px]">
        <Logo />
        <div className="flex flex-col text-[16px]">
          <span className="text-white">Financial Clarity You Can Trust</span>
          <span className="text-gray-700">
            Trusted financial guidance for every stage of life and business
            since 1987
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-between py-[32px] items-start">
        <SignupButton
          btnText="Prijavite se"
          className="bg-white text-gray-700 hover:bg-gray-100"
        />
        <span className="text-gray-700 text-[16px]">
          © 2025 All Rights Reserved
        </span>
      </div>
    </div>
  );
};

export default Footer;
