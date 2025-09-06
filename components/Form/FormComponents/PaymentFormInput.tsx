"use client";

import { motion } from "framer-motion";
import {
  type ReactNode,
  type FormEventHandler,
  type InputHTMLAttributes,
} from "react";

interface Props {
  icon: ReactNode;
  type: string;
  placeholder: string;
  name: string;
  defaultValue?: string;
  className?: string;
  readOnly?: boolean;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  htmlPattern?: string;
  onInput?: FormEventHandler<HTMLInputElement>;
  handleInput?: (e: any) => void;
}

const PaymentFormInput: React.FC<Props> = ({
  icon,
  type,
  placeholder,
  name,
  defaultValue,
  className,
  readOnly,
  inputMode,
  maxLength,
  htmlPattern,
  onInput,
  handleInput,
}) => {
  return (
    <motion.div
      className={`w-full px-2 py-2 rounded-xl flex gap-2 lg:py-3 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="px-2 border-r border-gray-400">{icon}</div>
      <input
        type={type}
        className="bg-transparent outline-none text-xs lg:text-sm w-full"
        placeholder={placeholder}
        name={name}
        autoComplete="off"
        defaultValue={defaultValue}
        readOnly={readOnly}
        inputMode={inputMode}
        maxLength={maxLength}
        pattern={htmlPattern}
        onInput={onInput}
        onChange={handleInput}
      />
    </motion.div>
  );
};

export default PaymentFormInput;
