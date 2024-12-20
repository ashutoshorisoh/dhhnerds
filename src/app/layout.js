"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import '../app/globals.css';
import { EmailWrapper } from "./context/context.js";
import Head from "next/head"; // Make sure this is imported
import { Analytics } from "@vercel/analytics/react"

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
      <Head>
        {/* Set a .jpg or .png file as the favicon */}
        <link rel="icon" href="https://i.pinimg.com/736x/72/4f/f5/724ff51bdd8177a81bd6130e82fdd2be.jpg" type="image/jpeg" />

        {/* Open Graph and Twitter Preview Images */}
        <meta property="og:image" content="https://i.pinimg.com/736x/72/4f/f5/724ff51bdd8177a81bd6130e82fdd2be.jpg" />
        <meta name="twitter:image" content="https://i.pinimg.com/736x/72/4f/f5/724ff51bdd8177a81bd6130e82fdd2be.jpg" />

        {/* Other meta tags */}
        <meta name="twitter:card" content="summary" />
      </Head>
      <body className="overflow-x-hidden">
        <EmailWrapper>
          {/* Navbar is fixed at the top */}
          <Navbar />
          {/* Add margin-top to the content to avoid overlap */}
          <div className="mt-20 z-10"> {/* Adjust this value to match the navbar height */}
            {children}
          </div>
        </EmailWrapper>

        <Analytics />
      </body>
    </html>
  );
}
