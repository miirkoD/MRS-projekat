import React from 'react';

type SubscriptionButtonProps = {
  className?: string;
  txt?: string;
};
const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  className,
  txt,
}) => {
  return (
    <button
      className={`w-full
        
        rounded-xl
        flex items-center justify-center shadow-md hover:cursor-pointer ${className}`}
    >
      {txt}
    </button>
  );
};

export default SubscriptionButton;
