"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { emailContext } from "../context/context.js";
import axios from "axios";

function loginPage() {
  const router = useRouter();
  const { setUserEmail } = emailContext();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // Update buttonDisabled based on form validity
  useEffect(() => {
    const isValid = user.email.length > 0 && user.password.length > 0;
    setButtonDisabled(!isValid); // Disable button if form is invalid
  }, [user.email, user.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login successful");
      setUserEmail(user.email);
      router.push("/");
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full justify-start items-center lg:text-md text-sm overflow-hidden">
      <div className="flex p-2 w-full justify-center flex-col items-center gap-2 border border-white">
        <h1 className="text-center text-white">Login</h1>
        <div className="flex flex-col gap-2 lg:h-1/2 h-full lg:w-1/3 w-[80%]">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white pl-2 pb-2 font-bold">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="rounded-lg pt-2 pb-2 pl-4 text-start bg-transparent border-white border"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-white pl-2 pb-2 font-bold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="rounded-lg pt-2 pb-2 pl-4 text-start bg-transparent border-white border"
            />
          </div>

          <div className="flex justify-end items-center">
            <button
              onClick={onLogin}
              disabled={buttonDisabled}
              className="text-black bg-white rounded-lg text-center pl-3 pr-3 pt-2 pb-2"
            >
              {buttonDisabled ? "Please fill out the form" : "Login"}
            </button>
          </div>

          <p className="text-center text-white text-md">Don't have account yet? <button onClick={() => router.push("/signup")} className="bg-white pl-2 pr-2 rounded-md pt-1 pb-1 text-black"> sign up</button></p>
          
          <button onClick={() => router.push("/signup")}>Click to Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default loginPage;
