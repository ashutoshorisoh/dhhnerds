"use client"

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
      <body style={{ paddingTop: "120px" }}>
      <EmailWrapper>
        
        {children}
        </EmailWrapper>

      </body>
    </html>
  );
}
