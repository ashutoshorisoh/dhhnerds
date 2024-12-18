import connectDB from "@/dbconfig/dbconfig.js";  // Corrected import
import User from "@/models/user.model.js";      // Corrected import
import bcryptjs from "bcryptjs";               // Already correct
import { NextResponse } from "next/server"; 
import jwt from "jsonwebtoken"

connectDB()

export async function POST(request){
    try{
      const reqBody = await request.json()
      const {email, password} = reqBody;

      const user = await User.findOne({email})
      if(!user){
        return NextResponse.json(
            {error: "user doesnt exist"}, 
            {status: 404})
      }

      const validPassword = await bcryptjs.compare(password, user.password)

      if(!validPassword){
        return NextResponse.json(
            {error: "wrong password"},
        {status:401 })
      }

      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email
      }

      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET,
        {expiresIn: "1d"}
      )

      const response = NextResponse.json({
        message: "login successful",
        success: true
      })

      response.cookies.set("token", token, {
        httpOnly: true
      })

      return response;

    } catch(error){
        console.error("Error in POST:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}