import React from 'react';
import SignupButton from './signup-button';
import Logo from '@/assets/logo';
import Link from 'next/link';

type navProps = {
  className?: string;
  btnText?: string;
};
const NavBar: React.FC<navProps> = ({ className, btnText }) => {
  return (
    <header>
      <nav className="max-w h-[101px] flex flex-row items-center text-center  px-10 justify-between bg-gray-200">
        <Logo />
        <Link href="/login">
          <button
            className={`bg-gray-800   rounded-3xl font-medium text-[12px] px-[12px] py-[12px] text-center items-center justify-center hover:cursor-pointer ${className}`}
          >
            {btnText}
          </button>
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;
