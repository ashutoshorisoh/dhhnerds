"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      router.push("/login"); // Ensure lowercase 'router'
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="text-white text-2xl">
      <h1>Profile</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
