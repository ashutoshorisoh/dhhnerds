// src/app/api/getusername/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/dbconfig/dbconfig';
import User from '@/models/user.model';

export async function POST(request) {
  try {
    // Parse the JSON body from the incoming request
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Establish DB connection
    await connectDB();

    // Query the database for the username based on the provided email
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If user is found, return the username
    return NextResponse.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching username:', error);
    return NextResponse.json({ error: 'Failed to fetch username' }, { status: 500 });
  }
}
