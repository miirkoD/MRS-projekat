import FacebookIcon from '@/assets/facebook-icon';
import GithubIcon from '@/assets/github-icon';
import Logo from '@/assets/logo';
import TwitterIcon from '@/assets/twitter-icon';
import InputField from '@/components/input-field';
import SignupButton from '@/components/signup-button';
import SocialMediaButtons from '@/components/social-media-buttons';
import SubscriptionButton from '@/components/subscription-button';
import Link from 'next/link';
import React from 'react';

const fields = [
  { type: 'text', txt: 'Ime' },
  { type: 'text', txt: 'Prezime' },
  { type: 'email', txt: 'Email' },
  { type: 'password', txt: 'Šifra' },
];

const icons = [
  <FacebookIcon key={1} />,
  <TwitterIcon key={2} />,
  <GithubIcon key={3} />,
];

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white gap-0 content-center justify-center">
      <div className="flex flex-col items-center content-center justify-center gap-[32px]">
        <div className="flex flex-col gap-[24px] items-center justify-center text-center ">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex flex-col gap-[8px]">
            <h1 className="text-[35px] text-gray-900">Napravi nalog</h1>
            <span className="text-[14px] text-gray-600">
              ili{' '}
              <Link href="login">
                <span className="text-[14px] text-[#A093AA] cursor-pointer">
                  se prijavi
                </span>
              </Link>
            </span>
          </div>
        </div>
        <div className="flex flex-col h-[600px] w-[448px] shadow-lg  rounded-md pt-[32px] border border-gray-50 px-[40px] gap-[24px]">
          <div className="flex flex-col gap-[24px]">
            {fields.map((field, key) => (
              <InputField key={key} txt={field.txt} type={field.type} />
            ))}
          </div>
          <div className="flex flex-row justify-end">
            <span className="text-[14px] text-[#A093AA] cursor-pointer">
              Zaboraviliste lozinku?
            </span>
          </div>
          <SubscriptionButton
            txt="Prijavi me"
            className="h-[38px] text-[14px] text-white bg-[#A093AA]"
          />
          <div className="flex flex-row justify-center content-center text-center items-center gap-[8px]">
            <hr className="w-[128px] h-px bg-gray-300 border-none " />
            <span className="text-gray-500 text-[14px]">Ili nastavite sa</span>
            <hr className="w-[128px] h-px bg-gray-300 border-none " />
          </div>
          <div className="flex flex-row gap-[12px] content-center items-center justify-center">
            {icons.map((icon, key) => (
              <SocialMediaButtons key={key} svg={icon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
