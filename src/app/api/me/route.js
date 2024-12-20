import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextResponse } from "next/server";
import User from "@/models/user.model";
import connectDB from "@/dbconfig/dbconfig";

connectDB();

export async function GET(request) {
  try {
    const userID = await getDataFromToken(request); // Assuming it returns the user ID
    const user = await User.findOne({ _id: userID }).select("-password"); // Await the DB query and select fields
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ message: "Error fetching user details" }, { status: 500 });
  }
}
