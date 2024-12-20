"use client";

import React, { useEffect } from "react";
import {toast} from "react-hot-toast"
import { useRouter } from "next/navigation";
import axios from "axios";

function Signuppage() {
  const router = useRouter()
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    fullname: "",
    username: "",
    confirmPassword: "",
  });
  const [signing, setSigning] = React.useState(false)

  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  // Update buttonDisabled based on form validity
  useEffect(() => {
    const isValid =
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.fullname.length > 0 &&
      user.username.length > 0 &&
      user.password === user.confirmPassword;
    setButtonDisabled(!isValid); // Disable button if form is invalid
  }, [user.email, user.password, user.fullname, user.username, user.confirmPassword]);

  const onSignUp = async () => {
    try{
      const response = await axios.post("/api/users/signup", user)
      console.log(response.data)
      router.push("/login")
     setSigning(true)
    } 
    catch(error){
       console.log("error")
    } 
    finally{

    }
  }; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col  h-full w-full justify-start items-center lg:text-md text-sm overflow-hidden ">
      <div className="flex p-2 w-full justify-center flex-col items-center gap-2 border border-white">

      <h1 className="text-center text-white">Sign Up</h1>
      <div className="flex flex-col  gap-2 lg:h-1/2 h-full lg:w-1/3 w-[80%]" >
        <div className="flex flex-col">
        <label htmlFor="fullname"
        className="text-white pl-2 pb-2 font-bold"
        >Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          name="fullname"
          value={user.fullname}
          onChange={handleChange}
          className="rounded-lg pt-2 pb-2 pl-4 text-start bg-transparent border-white text-white border"
        />
        </div>
        
        <div className="flex flex-col">
        <label htmlFor="username"         
        className="text-white pl-2 pb-2 font-bold"
        >Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={user.username}
          onChange={handleChange}
          className="rounded-lg  pt-2 pb-2 pl-4 text-start bg-transparent text-white border-white border"

        />
        </div>

        <div className="flex flex-col">
        <label htmlFor="email"
        className="text-white pl-2 pb-2 font-bold"

        >Email</label>
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="rounded-lg text-white pt-2 pb-2 pl-4 text-start bg-transparent border-white border"

        />
        </div>

        <div className="flex flex-col">
        <label htmlFor="password"
                className="text-white pl-2 pb-2 font-bold"

        >Password</label>
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={user.password}
          onChange={handleChange}
          className="rounded-lg  text-white pt-2 pb-2 pl-4 text-start bg-transparent border-white border"

        />
        </div>

        
        <div className="flex flex-col">
        <label htmlFor="confirmPassword"
        className="text-white pl-2 pb-2 font-bold"

        >Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
          className="rounded-lg pt-2 text-white pb-2 pl-4  text-start bg-transparent border-white border"

        />
        </div>
         <div className="flex justify-end items-center">
         <button onClick={onSignUp} disabled={buttonDisabled}
         className="text-black bg-white rounded-lg text-center pl-3 pr-3 pt-2 pb-2 ">
          {buttonDisabled ? "fill all details to create a account" : "signup"}
        </button>
         </div>
         

        <p>or</p>

        <button>Sign in with Google</button>

        <p>Already have an account?</p>

        
          <button>Click to Login</button>
        
      </div>

      </div>
      
    </div>
  );
}

export default Signuppage;
