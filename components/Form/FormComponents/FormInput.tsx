"use client";

import { error } from "console";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ConfigOptions } from "@/types/formTypes";
import Flag from "react-world-flags";

interface Props {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  name: string;
  config?: {
    required: boolean | ConfigOptions;
    minLength?: number | ConfigOptions;
    maxLength?: number | ConfigOptions;
    pattern?: any;
  };
  register?: any;
  errors?: any;
  defaultValue?: string;
  className?: string;
  readOnly?: boolean;
  watch?: any;
  currentCountry?: string;
  selectOptions?: any;
  inputMode?: string;
  maxLength?: number;
  htmlPattern?: string;
  onInput?: React.FormEventHandler<HTMLInputElement>;
}

interface CountriesData {
  country: string;
  code: string;
  iso: string;
}

const FormInput: React.FC<Props> = ({
  icon,
  type,
  placeholder,
  name,
  config,
  register,
  errors,
  className,
  defaultValue,
  readOnly,
  watch,
  currentCountry,
  selectOptions,
  inputMode,
  maxLength,
  htmlPattern,
  onInput,
}) => {
  const j = register ? { ...register(name, config) } : { ...{} };

  return (
    <motion.div
      className={`w-full px-2 py-2  rounded-xl flex gap-2 lg:py-3 ${className} `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div
        className={`px-2 border-r border-gray-400 ${
          errors && errors[name] && "text-red-600"
        }`}
      >
        {type === "select" ? (
          <Flag
            code={currentCountry ? currentCountry.split("-")[1] : "GH"}
            width={"25"}
            height={"25"}
          />
        ) : (
          icon
        )}
      </div>
      {type === "select" ? (
        <select
          name={name}
          id="cars"
          form="carform"
          className="bg-tertiary outline-none text-xs lg:text-sm w-full"
          defaultValue={"Ghana-GH"}
          {...j}
        >
          {selectOptions?.map((option: CountriesData) => (
            <option key={option.iso} value={option.country + "-" + option.iso}>
              {option.country}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="bg-transparent outline-none text-xs lg:text-sm w-full"
          placeholder={placeholder}
          // name={name}
          autoComplete="off"
          defaultValue={defaultValue}
          readOnly={readOnly}
          inputMode={inputMode}
          maxLength={maxLength}
          pattern={htmlPattern}
          onInput={onInput}
          {...j}
        />
      )}
    </motion.div>
  );
};

export default FormInput;
