"use client";

import { motion } from "framer-motion";

interface Props {
  icon?: React.ReactNode;
}

const ButtonIcon: React.FC<Props> = ({ icon }) => {
  return (
    <motion.button
      type="button"
      className="w-full rounded-lg bg-[#587BF2] relative text-sm px-2 py-2  flex justify-center items-center lg:py-3 lg:text-base hover:bg-[#4366d7]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      Continue
      {icon && (
        <div className="w-[28px] h-[28px]  lg:w-[35px] lg:h-[35px] rounded-lg bg-[#7995f5] flex justify-center items-center absolute right-0 mr-10 ">
          {icon}
        </div>
      )}
    </motion.button>
  );
};

export default ButtonIcon;
