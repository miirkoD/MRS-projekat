import React from 'react';
import SignupButton from './signup-button';
import Logo from '@/assets/logo';

const NavBar = () => {
  return (
    <header>
      <nav className="max-w h-[101px] flex flex-row items-center text-center  px-10 justify-between bg-gray-200">
        <Logo />
        <SignupButton btnText="Prijavite se" className="hover:bg-gray-700" />
      </nav>
    </header>
  );
};

export default NavBar;
