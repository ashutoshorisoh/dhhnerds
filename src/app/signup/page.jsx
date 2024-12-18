"use client";

import React, { useEffect } from "react";
import Link from "next/link";
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
    <div>
      <div>
        <label htmlFor="fullname">Full Name</label>
        <input
          type="text"
          placeholder="Full Name"
          name="fullname"
          value={user.fullname}
          onChange={handleChange}
        />

        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={user.username}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={user.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          value={user.confirmPassword}
          onChange={handleChange}
        />

        <button onClick={onSignUp} disabled={buttonDisabled}>
          {buttonDisabled ? "no sign up" : "signup"}
        </button>

        <p>or</p>

        <button>Sign in with Google</button>

        <p>Already have an account?</p>

        
          <button>Click to Login</button>
        
      </div>
    </div>
  );
}

export default Signuppage;
