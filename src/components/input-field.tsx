import React from 'react';

type InputFieldProps = {
  type?: string;
  txt?: string;
};

const InputField: React.FC<InputFieldProps> = ({ type, txt }) => {
  return (
    <div className="flex flex-col content-start justify-start gap-[4px] ">
      <span className="text-gray-700 text-[14px]">{txt}</span>
      <input
        type={type}
        className="border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
      />
    </div>
  );
};

export default InputField;
