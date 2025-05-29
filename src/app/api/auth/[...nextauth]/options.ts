import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt from "jsonwebtoken";
import { User } from "next-auth";

interface DecodedToken {
  realm_access?: {
    roles?: string[];
  };
  exp?: number;
  iat?: number;
  sub?: string;
  email?: string;
  name?: string;
}

interface ExtendedJWT extends JWT {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  error?: string;
  user?: {
    id: string;
    role: string;
    roles?: string[];
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

async function refreshAccessToken(token: ExtendedJWT) {
  try {
    const url =
      `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token` +
      new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken!,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      expiresAt: refreshedTokens.expires_in + Math.floor(Date.now() / 1000),
    };
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      profile(profile: DecodedToken) {
        return {
          id: profile.sub || '',
          name: profile.name || '',
          email: profile.email || '',
          roles: profile.realm_access?.roles || [],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }): Promise<ExtendedJWT> {
      if (account && user) {
        const decodedToken = jwt.decode(account.access_token as string) as DecodedToken;
        const roles = decodedToken.realm_access?.roles || [];

        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          user: {
            ...user,
            role: roles.includes('admin') ? 'admin' : 'user',
            roles: roles,
          },
        };
      }

      if (token.expiresAt && Date.now() < token.expiresAt * 1000) {
        return token as ExtendedJWT;
      }

      return refreshAccessToken(token as ExtendedJWT);
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        idToken: token.idToken,
        error: token.error,
        user: token.user as User,
      };
    },
    async signIn({ account }) {
      if (!account?.access_token) {
        console.error('No access token available');
        return false;
      }

      try {
        const decodedToken = jwt.decode(account.access_token as string) as DecodedToken;
        console.log('Decoded access token:', decodedToken);

        const hasAdminRole = decodedToken.realm_access?.roles?.includes('admin');
        console.log('Has admin role:', hasAdminRole);

        if (!hasAdminRole) {
          console.log('User is not an admin');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}; 