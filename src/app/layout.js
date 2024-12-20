"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import '../app/globals.css';
import { EmailWrapper } from "./context/context.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <EmailWrapper>
          {/* Navbar is fixed at the top */}
          <Navbar />
          {/* Add margin-top to the content to avoid overlap */}
          <div className=" mt-20 z-10"> {/* Adjust this value to match the navbar height */}
            {children}
          </div>
        </EmailWrapper>
      </body>
    </html>
  );
}
