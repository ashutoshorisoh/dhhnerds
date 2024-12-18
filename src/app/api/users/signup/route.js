import connectDB from "@/dbconfig/dbconfig.js";  // Corrected import
import User from "@/models/user.model.js";      // Corrected import
import bcryptjs from "bcryptjs";               // Already correct
import { NextResponse } from "next/server";    // Import NextResponse

// Connect to the database
await connectDB().catch((error) => {
    console.error("Database connection failed:", error);
    throw new Error("Database connection error");
});

export async function POST(request) {
    try {
        const { username, fullname, email, password } = await request.json();

        // Check if the user exists in the database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash the password before saving
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullname,
        });

        const savedUser = await newUser.save(); // Assign saved user to a variable

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser, // Include saved user in the response
        });
    } catch (error) {
        console.error("Error in POST:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}
