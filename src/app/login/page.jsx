"use client"

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import {toast} from "react-hot-toast"
import axios from "axios";
import { useRouter } from "next/navigation";
import { emailContext } from "../context/context.js";

function loginPage() {
  const Router = useRouter()
  
  const [loading, setLoading] = React.useState(true)
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const {setUserEmail, userEmail} = emailContext()

  const [user, setUser] = React.useState({
      
      email: "",
      
      password: "",
      
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  

  const onLogin = async()=>{
    try{

      setLoading(true)

      const response = await axios.post("/api/users/login", user);
      console.log("success")
      Router.push("/profile")
      


    }catch(error){
      console.log("login error", error)
      
    }finally{
      setLoading(false)
      setUserEmail(user.email)
      console.log(userEmail)
      console.log("loggedin")
      
    }
  }


  return (
    <div className='flex flex-col text-white justify-center items-center  p-10'>
      <div className='flex flex-col w-[30%] border gap-2 border-white p-20 rounded-md shadow-gray-300 shadow '>
      <label htmlFor="email">Email</label>
        <input type="text" placeholder='username '
         className='rounded-lg pl-2 pr-2 pt-1 pb-2 text-black border'
         name="email"
          value={user.email}
          onChange={handleChange}
         />
      <label htmlFor="password">Password</label>
        <input type="password" placeholder='enter password'  className='rounded-lg pl-2 pr-2 pt-1 pb-1 text-black' 
        name="password"
        value={user.password}
        onChange={handleChange}
        />
        <button 
        className='border-black border pl-2 pr-2 pt-2 pb-2 mt-2 rounded-xl'
        onClick={onLogin}
        >
          Login</button>
        <p className='text-center'>or</p>
        <button className='border-white bg-green-800 text-white border pl-2 pr-2 pt-2 pb-2 mt-2 rounded-xl'>Sign in with Google</button>
         
      </div>
       
    </div>
  )
}

export default loginPage