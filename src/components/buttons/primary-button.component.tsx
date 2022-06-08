import React from "react";

const PrimaryButton = ({
  children,
  ...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...otherProps}
    className={
      `text-lg rounded-lg px-4 py-2 outline-none bg-pink-600 ` +
      `hover:bg-pink-700 focus:bg-pink-700 active:bg-pink-800 disabled:bg-gray-500`
    }
  >
    {children}
  </button>
);

export default PrimaryButton;
