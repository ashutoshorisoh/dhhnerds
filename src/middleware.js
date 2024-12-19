import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // For decoding the JWT token

// Helper function to get the userId from the token
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET); // Verify and decode the token
    return decoded.userId; // Assuming 'userId' is in the token payload
  } catch (error) {
    return null; // Token verification failed
  }
};

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define public paths (accessible without authentication)
  const isPublicPath = path === '/login' || path === '/signup';

  // Get the token from cookies
  const token = request.cookies.get('token')?.value || '';
  
  // Debugging logs to check the behavior
  console.log("Path:", path);
  console.log("Token:", token);

  // Case 1: If the user is authenticated and tries to access /login or /signup, redirect to the home page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Case 2: If the user is not authenticated and tries to access a protected route (like /profile or album/[id]/post), redirect to /login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // If the token is available, decode it and pass the userId to the request
  if (token) {
    const userId = getUserIdFromToken(token);
    if (userId) {
      // You can attach userId to the request headers or as a custom header
      request.headers.set('x-user-id', userId); // Passing userId as custom header
    }
  }

  // Allow the request to continue to the page or API
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',                 // Home page - accessible to all
    '/profile',          // Protected route - requires authentication
    '/login',            // Public route - for login
    '/signup',           // Public route - for signup
    '/album/:path*/post', // Dynamic route matcher for album/[id]/post
  ],
};