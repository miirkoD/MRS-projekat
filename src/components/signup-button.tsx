import React from "react";

type btnProps = {
  className?: string;
  btnText?: string;
};
const SignupButton: React.FC<btnProps> = ({ className, btnText }) => {
  return (
    <button
      className={`bg-[#353A40]   rounded-3xl font-medium text-[12px] px-[12px] py-[12px] text-center items-center justify-center ${className}`}
    >
      {btnText}
    </button>
  );
};

export default SignupButton;
