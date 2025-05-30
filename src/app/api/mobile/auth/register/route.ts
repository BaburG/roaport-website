import { NextResponse } from 'next/server';
import { KeycloakService } from '@/lib/keycloak';

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, phoneNumber, password } = await request.json() as RegisterRequest;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return NextResponse.json(
        { status: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Initialize Keycloak service
    const keycloakService = new KeycloakService();

    // Register user in Keycloak
    const registerResult = await keycloakService.register({
      firstName,
      lastName,
      email,
      username: email,
      password,
      attributes: {
        phoneNumber: [phoneNumber]
      }
    });

    if (!registerResult.success) {
      return NextResponse.json(
        { status: false, message: registerResult.error || 'Registration failed' },
        { status: 400 }
      );
    }

    // Wait for 2 seconds to ensure user is fully created
    await wait(2000);

    // Try to login multiple times if needed
    let loginResult = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      loginResult = await keycloakService.login(email, password);
      if (loginResult.success) break;
      
      attempts++;
      if (attempts < maxAttempts) {
        await wait(1000); // Wait 1 second between attempts
      }
    }

    if (!loginResult?.success) {
      return NextResponse.json(
        { 
          status: false, 
          message: 'Registration successful but login failed. Please try logging in manually.',
          data: {
            email,
            password
          }
        },
        { status: 500 }
      );
    }

    // Return the tokens and user info
    return NextResponse.json({
      status: true,
      message: 'Registration successful',
      data: {
        access_token: loginResult.accessToken,
        refresh_token: loginResult.refreshToken,
        user: {
          id: registerResult.userId,
          firstName,
          lastName,
          email,
          phoneNumber
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { status: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 