import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function mobileAuthMiddleware(request: NextRequest) {
  // Skip auth for login and register endpoints
  if (request.nextUrl.pathname === '/api/mobile/auth/login' || 
      request.nextUrl.pathname === '/api/mobile/auth/register') {
    return NextResponse.next();
  }

  // Get the token from the Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { status: false, message: 'No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token with Keycloak
    const response = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/userinfo`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Token is valid, proceed with the request
    return NextResponse.next();
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { status: false, message: 'Token verification failed' },
      { status: 401 }
    );
  }
} 