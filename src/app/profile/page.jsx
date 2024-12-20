"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { emailContext } from "../context/context.js";

export default function Profile() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const [loading, setLoading] = useState(false); // New state for loading
  const {userEmail, setUserEmail} = emailContext()
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getUserDetails = async () => {
    setLoading(true); // Start loading state
    try {
      const res = await axios.get("/api/me"); // Ensure correct API path
      console.log(res.data);
      setData(res.data.data._id);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setData("Error fetching details");
    }
    setLoading(false);
    console.log(userEmail) // End loading state
  };

  return (
    <div className="text-black text-2xl">
      <h1>Profile</h1>
      <h1>{userEmail}</h1>
      <h2>
        {data === "nothing" ? (
          "No data available"
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <p>{data}</p>
        )}
      </h2>
      <button onClick={getUserDetails}>Get User Details</button>
      <div>{userEmail}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
