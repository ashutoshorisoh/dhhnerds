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

  // Get the token from cookies
  const token = request.cookies.get('token')?.value || '';

  // Debugging logs to check the behavior
  console.log("Path:", path);
  console.log("Token:", token);

  // Case 1: If token exists, block access to login/signup pages and redirect to home page
  if (token && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Case 2: If token does not exist and trying to access protected pages (e.g. /profile), redirect to login
  if (!token && path === '/profile') {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // Case 3: If token exists, allow access to protected pages like /profile, otherwise redirect to login
  if (token) {
    const userId = getUserIdFromToken(token);
    if (userId) {
      // Optionally attach userId to the request headers if needed
      request.headers.set('x-user-id', userId);
    }
  }

  // Allow the request to continue for all other routes (public routes and dynamic routes)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',                 // Home page - accessible to all
    '/profile',          // Protected route - requires authentication (token)
    '/login',            // Public route - for login
    '/signup',           // Public route - for signup
    '/album/:path', // Dynamic route matcher for album/[id]/post
  ],
};
