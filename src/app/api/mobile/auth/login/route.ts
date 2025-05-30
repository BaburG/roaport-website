import { NextResponse } from 'next/server';
import { KeycloakService } from '@/lib/keycloak';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Initialize Keycloak service
    const keycloakService = new KeycloakService();

    // Attempt to login with Keycloak
    const loginResult = await keycloakService.login(email, password);

    if (!loginResult.success) {
      return NextResponse.json(
        { status: false, message: loginResult.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Return the tokens and user information
    return NextResponse.json({
      status: true,
      data: {
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
        expiresIn: loginResult.expiresIn,
        refreshExpiresIn: loginResult.refreshExpiresIn,
        tokenType: loginResult.tokenType,
        scope: loginResult.scope,
        user: loginResult.user
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 