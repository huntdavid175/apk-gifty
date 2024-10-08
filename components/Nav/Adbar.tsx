"use client";
import Image from "next/image";
import React from "react";
import DownloadApp from "../Main/Section/DownloadApp";
import { motion } from "framer-motion";

const Adbar = () => {
  return (
    <div className="w-full py-2 flex justify-center items-center lg:space-x-8 px-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-white font-light text-sm hidden lg:text-lg lg:inline-block"
      >
        Trading made easy
      </motion.p>
      <DownloadApp />
    </div>
  );
};

export default Adbar;
