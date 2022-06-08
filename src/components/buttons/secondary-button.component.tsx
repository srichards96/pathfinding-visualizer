import React from "react";

const SecondaryButton = ({
  children,
  ...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...otherProps}
    className={
      `text-lg rounded-lg px-4 py-2 outline-none bg-teal-200 ` +
      `hover:bg-teal-300 focus:bg-teal-400 text-black disabled:bg-gray-300`
    }
  >
    {children}
  </button>
);

export default SecondaryButton;
