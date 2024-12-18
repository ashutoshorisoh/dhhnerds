
"use client";

import { useState } from "react";


export default function Navbar() {
  return (
    <div className="w-full top-0 fixed flex justify-center pt-2 overflow-y-hidden overflow-x-hidden">
  <div className="flex-row gap- fixed w-full overflow-hidden h-24   pt-10 pb-10  flex items-center text-sm   justify-end pl-2 pr-2 text-white">
    <h1 className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:text-slate-200 hover:border  hover:overflow-hidden cursor-pointer w-28">
      Home
    </h1>
    <h1 className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-sm hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer  w-28">
      Reviews
    </h1>
    <h1 className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28">
      Members
    </h1>
    <h1 className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28">
      Sign Up
    </h1>
    <h1 className="hover:p-2 flex justify-center hover:text-md hover:rounded-md hover:shadow-md hover:shadow-stone-600 hover:border hover:border-white hover:overflow-hidden cursor-pointer w-28">
      Login
    </h1>
  </div>
</div>

  );
}

