import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        // Get admin token using admin credentials
        const adminTokenResponse = await fetch(`${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'password',
                client_id: 'admin-cli',
                username: process.env.KEYCLOAK_ADMIN_USERNAME!,
                password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
            }),
        });

        const adminTokenData = await adminTokenResponse.json();

        if (!adminTokenData.access_token) {
            console.error('Admin token response:', adminTokenData);
            throw new Error('Failed to get admin token');
        }

        // Get user details
        const userResponse = await fetch(
            `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${adminTokenData.access_token}`,
                },
            }
        );

        if (!userResponse.ok) {
            const errorData = await userResponse.text();
            console.error('Get user error:', errorData);
            throw new Error('Failed to get user details');
        }

        const userData = await userResponse.json();
        return NextResponse.json(userData);

    } catch (error) {
        console.error('Error getting user details:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 