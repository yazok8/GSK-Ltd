"use client";

import { useEffect, useState } from "react";

export const useTimedMessage = (duration: number = 5000) => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);
  return {
    message,
    showMessage: setMessage,
  };
};
