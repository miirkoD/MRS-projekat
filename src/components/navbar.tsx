import React from 'react';
import SignupButton from './signup-button';
import Logo from '@/assets/logo';
import Link from 'next/link';

const NavBar = () => {
  return (
    <header>
      <nav className="max-w h-[101px] flex flex-row items-center text-center  px-10 justify-between bg-gray-200">
        <Logo />
        <Link href="/login">
          <SignupButton btnText="Prijavite se" className="hover:bg-gray-700" />
        </Link>
      </nav>
    </header>
  );
};

export default NavBar;
