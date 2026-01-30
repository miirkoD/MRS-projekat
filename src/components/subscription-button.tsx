import React from 'react';

type SubscriptionButtonProps = {
  className?: string;
  txt?: string;
  onClick?:()=>void;
};
const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  className,
  txt,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full
        
        rounded-xl
        flex items-center justify-center shadow-md hover:cursor-pointer ${className}`}
    >
      {txt}
    </button>
  );
};

export default SubscriptionButton;
