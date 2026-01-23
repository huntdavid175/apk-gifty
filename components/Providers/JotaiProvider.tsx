"use client";

import { Provider } from "jotai";
import { ReactNode, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function JotaiProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Provider>
      {children}
      <ToastContainer
        style={{ zIndex: 9999 }}
        position="top-right"
        newestOnTop
      />
    </Provider>
  );
}
