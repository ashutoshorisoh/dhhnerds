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
    <div className=" lg:h-40 h-20 lg:w-40 w-20 overflow-hidden flex justify-center mb-3 cursor-pointer" onClick={() => handleNavigation("/")}>
      <img src="/logo.png" alt="" className="h-full w-full object-contain" />
    </div>
    <div className="flex">
    

    <h1
      onClick={() => handleNavigation("/signup")}
      className={`hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-sm hover:shadow-stone-600 hover:border  hover:overflow-hidden cursor-pointer w-28 ${userEmail ? 'hidden' : ''}`}
    >
      Sign Up
    </h1>

    {userEmail ? (
      <h1
        onClick={logout}
        className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-sm hover:border  hover:overflow-hidden cursor-pointer w-28"
      >
        Logout
      </h1>
    ) : (
      <h1
        onClick={() => handleNavigation("/login")}
        className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-sm hover:shadow-stone-600 hover:border  hover:overflow-hidden cursor-pointer w-28"
      >
        Login
      </h1>
    )}
    </div>
    
  </div>
</div>

  );
}
