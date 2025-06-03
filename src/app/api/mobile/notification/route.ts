import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface TokenResponse {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

interface NotificationResponse {
  id: string
  username: string
  pushToken: string
  tokens?: TokenResponse
}

export async function POST(request: NextRequest) {
  try {
    // 1) Parse request body
    const body = await request.json()
    const { expoPushToken, userId } = body

    if (!expoPushToken || !userId) {
      return NextResponse.json(
        { error: 'Expo push token and userId are required' },
        { status: 400 }
      )
    }

    // 2) Fetch an admin access token from Keycloak
    const adminTokenResponse = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: process.env.KEYCLOAK_ADMIN_USERNAME!,
          password: process.env.KEYCLOAK_ADMIN_PASSWORD!,
        }),
      }
    )
    const adminTokenData = await adminTokenResponse.json()
    if (!adminTokenData.access_token) {
      console.error('Admin token response error:', adminTokenData)
      throw new Error('Failed to get admin token')
    }
    const adminAccessToken = adminTokenData.access_token

    // 3) Look up the user in Keycloak by username (which equals our userId)
    const searchResponse = await fetch(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users?username=${encodeURIComponent(
        userId
      )}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${adminAccessToken}` },
      }
    )
    if (!searchResponse.ok) {
      const text = await searchResponse.text()
      console.error('Search user error:', text)
      throw new Error('Failed to search for existing user')
    }
    const users = await searchResponse.json()
    const existingUser = Array.isArray(users) ? users[0] : undefined

    let finalUserId: string

    if (!existingUser) {
      // 4) If no Keycloak user exists, create one
      const newUserPayload = {
        username: userId,
        email: `${userId}.temp@roaport.com`,
        enabled: true,
      }

      console.log('→ Creating new Keycloak user:', JSON.stringify(newUserPayload))
      const newUserResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserPayload),
        }
      )

      if (!newUserResponse.ok) {
        const text = await newUserResponse.text()
        console.error('Create user error:', text)
        throw new Error('Failed to create new user')
      }

      // 4a) Immediately re-fetch to get the newly created user's UUID
      const rereadResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users?username=${encodeURIComponent(
          userId
        )}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${adminAccessToken}` },
        }
      )
      if (!rereadResponse.ok) {
        const text = await rereadResponse.text()
        console.error('Error re-reading user after create:', text)
        throw new Error('Could not find newly created user')
      }
      const rereadList = await rereadResponse.json()
      if (!Array.isArray(rereadList) || rereadList.length === 0) {
        throw new Error('New user not found after create')
      }
      finalUserId = rereadList[0].id
      console.log('New Keycloak user created:', finalUserId)
    } else {
      // 5) If user already exists in Keycloak, grab their UUID
      finalUserId = existingUser.id
      console.log('Existing Keycloak user found:', finalUserId)
    }

    // 6) Upsert the notification token in PostgreSQL via Prisma
    //    Prisma schema has:
    //      model NotificationToken {
    //        id                Int     @id @default(autoincrement())
    //        userId            String? @unique @map("user_id")
    //        notificationToken String? @map("notification_token")
    //        @@map("notification_tokens")
    //      }
    try {
      await prisma.notificationToken.upsert({
        where: { userId: finalUserId },
        create: {
          userId: finalUserId,
          notificationToken: expoPushToken,
        },
        update: {
          notificationToken: expoPushToken,
        },
      })
      console.log('Prisma upsert succeeded for userId:', finalUserId)
    } catch (dbError) {
      console.error('Prisma upsert error:', {
        error: dbError,
        userId: finalUserId,
        token: expoPushToken,
      })
      // We swallow this error so the endpoint still returns 200
    }

    // 7) If we just created a new Keycloak user, request tokens for them
    let tokens: TokenResponse | null = null
    if (!existingUser) {
      const tokenResponse = await fetch(
        `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            username: userId,
            password: userId,
          }),
        }
      )
      tokens = await tokenResponse.json()
    }

    // 8) Return a successful JSON response
    const responsePayload: NotificationResponse = {
      id: finalUserId,
      username: userId,
      pushToken: expoPushToken,
    }
    if (tokens) {
      responsePayload.tokens = tokens
    }
    return NextResponse.json(responsePayload)
  } catch (error) {
    console.error('Error handling notification token:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
