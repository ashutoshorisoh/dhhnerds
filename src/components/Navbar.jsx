"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import axios from "axios";
import { emailContext } from "@/app/context/context"; // Import the context where userEmail is stored

export default function Navbar() {
  const router = useRouter();
  const { userEmail, setUserEmail } = emailContext(); // Assuming you have a setter for userEmail in your context

  // Navigation handler
  const handleNavigation = (path) => {
    router.push(path);
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUserEmail(''); // Reset the userEmail after logout
    }
  };

  return (
    <div className="w-full top-0 fixed flex justify-center items-center pt-2 h-20 overflow-y-hidden overflow-x-hidden bg-black z-50">
  <div className="flex-row gap- fixed w-full overflow-hidden h-24 pt-10 pb-10 flex items-center text-sm justify-between pl-2 pr-2 text-white">
    <div className=" h-40 w-40 overflow-hidden">
      <img src="/logo.png" alt="" className="h-full w-full object-contain" />
    </div>
    <div className="flex">
    <h1
      onClick={() => handleNavigation("/")}
      className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28"
    >
      Home
    </h1>

    <h1
      onClick={() => handleNavigation("/signup")}
      className={`hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28 ${userEmail ? 'hidden' : ''}`}
    >
      Sign Up
    </h1>

    {userEmail ? (
      <h1
        onClick={logout}
        className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28"
      >
        Logout
      </h1>
    ) : (
      <h1
        onClick={() => handleNavigation("/login")}
        className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28"
      >
        Login
      </h1>
    )}
    </div>
    
  </div>
</div>

  );
}
