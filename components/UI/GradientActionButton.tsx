"use client";

import React from "react";

interface Props {
  label: string;
  onClick?: () => void | Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  iconRight?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const GradientActionButton: React.FC<Props> = ({
  label,
  onClick,
  isLoading,
  disabled,
  iconRight,
  className,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 text-white text-xs lg:text-sm px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      ) : (
        <>
          <span>{label}</span>
          {iconRight && <span className="opacity-90">{iconRight}</span>}
        </>
      )}
    </button>
  );
};

export default GradientActionButton;
