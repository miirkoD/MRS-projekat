import React from 'react';

type btnProps = {
  className?: string;
  btnText?: string;
};
const SignupButton: React.FC<btnProps> = ({ className, btnText }) => {
  return (
    <button
      className={`bg-gray-800   rounded-3xl font-medium text-[12px] px-[12px] py-[12px] text-center items-center justify-center hover:cursor-pointer ${className}`}
    >
      {btnText}
    </button>
  );
};

export default SignupButton;
