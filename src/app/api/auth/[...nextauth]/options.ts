import { NextAuthOptions } from "next-auth";
// import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt from "jsonwebtoken";

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

// interface ExtendedJWT extends JWT {
//   accessToken?: string;
//   idToken?: string;
//   refreshToken?: string;
//   expiresAt?: number;
//   error?: string;
//   user?: {
//     id: string;
//     role: string;
//     roles?: string[];
//     name?: string | null;
//     email?: string | null;
//     image?: string | null;
//   };
// }

// async function refreshAccessToken(token: ExtendedJWT) {
//   try {
//     const url =
//       `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token` +
//       new URLSearchParams({
//         client_id: process.env.KEYCLOAK_CLIENT_ID!,
//         client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken!,
//       });

//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     });

//     const refreshedTokens = await response.json();

//     if (!response.ok) {
//       throw new Error('Failed to refresh token');
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       idToken: refreshedTokens.id_token,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
//       expiresAt: refreshedTokens.expires_in + Math.floor(Date.now() / 1000),
//     };
//   } catch {
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.NEXT_PUBLIC_KEYCLOAK_URL + '/realms/' + process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.idToken = token.idToken;
        session.error = token.error;
      }
      return session;
    },
    async signIn({ account }) {
      if (!account?.access_token) return false;
      
      try {
        // Decode the access token to check roles
        const decodedToken = jwt.decode(account.access_token) as DecodedToken;
        console.log('Decoded token:', decodedToken);
        
        const roles = decodedToken?.realm_access?.roles || [];
        console.log('User roles:', roles);
        
        const hasAdminRole = roles.includes('admin');
        console.log('Has admin role:', hasAdminRole);
        
        return hasAdminRole;
      } catch (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 