import React from 'react';

type InputFieldProps = {
  type?: string;
  txt?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  type,
  txt,
  value,
  onChange,
  name,
}) => {
  return (
    <div className="flex flex-col content-start justify-start gap-[4px] ">
      <span className="text-gray-700 text-[14px]">{txt}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[42px]"
      />
    </div>
  );
};

export default InputField;
