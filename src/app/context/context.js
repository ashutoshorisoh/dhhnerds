"use client";

import { createContext, useState, useContext, useEffect } from "react";

const userEmailContext = createContext('');

export const EmailWrapper = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');

  // Load the email from localStorage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  // Update localStorage whenever userEmail changes
  useEffect(() => {
    if (userEmail) {
      localStorage.setItem("userEmail", userEmail);
    } else {
      localStorage.removeItem("userEmail");
    }
  }, [userEmail]);

  return (
    <userEmailContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </userEmailContext.Provider>
  );
};

export function emailContext() {
  return useContext(userEmailContext);
}
