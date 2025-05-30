import Keycloak from 'keycloak-js';

interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  attributes?: {
    [key: string]: string[];
  };
}

interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes?: {
    [key: string]: string[];
  };
}

export class KeycloakService {
  private keycloak: Keycloak;
  private adminToken: string | null = null;

  constructor() {
    const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
    const keycloakRealm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
    const keycloakClientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (!keycloakUrl || !keycloakRealm || !keycloakClientId) {
      throw new Error('Keycloak configuration is missing');
    }

    this.keycloak = new Keycloak({
      url: keycloakUrl,
      realm: keycloakRealm,
      clientId: keycloakClientId
    });
  }

  private async getAdminToken() {
    try {
      if (this.adminToken) return this.adminToken;

      const adminUsername = process.env.KEYCLOAK_ADMIN_USERNAME;
      const adminPassword = process.env.KEYCLOAK_ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        throw new Error('Keycloak admin credentials are not configured');
      }

      console.log('Attempting to get admin token...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: adminUsername,
          password: adminPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Admin token request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to get admin token: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.adminToken = data.access_token;
      return this.adminToken;
    } catch (error) {
      console.error('Error getting admin token:', error);
      throw error;
    }
  }

  private async getUserInfo(userId: string): Promise<UserInfo | null> {
    try {
      const adminToken = await this.getAdminToken();
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/admin/realms/${realm}/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        }
      );

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }

  async register(userData: RegisterUserData) {
    try {
      const adminToken = await this.getAdminToken();
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;

      console.log('Creating user in Keycloak...', { email: userData.email });
      // Create user in Keycloak
      const createUserResponse = await fetch(
        `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/admin/realms/${realm}/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            enabled: true,
            emailVerified: true,
            credentials: [{
              type: 'password',
              value: userData.password,
              temporary: false,
            }],
            attributes: userData.attributes || {},
          }),
        }
      );

      if (!createUserResponse.ok) {
        const error = await createUserResponse.text();
        console.error('Failed to create user:', {
          status: createUserResponse.status,
          statusText: createUserResponse.statusText,
          error
        });
        return {
          success: false,
          error: `Failed to create user: ${error}`
        };
      }

      // Get the user ID from the Location header
      const location = createUserResponse.headers.get('Location');
      const userId = location?.split('/').pop();

      console.log('User created successfully:', { userId });

      return {
        success: true,
        userId
      };
    } catch (error) {
      console.error('Keycloak registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  async login(username: string, password: string) {
    try {
      console.log('Attempting to login user:', { username });
      const adminToken = await this.getAdminToken();
      const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;

      // First, get the user ID
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/admin/realms/${realm}/users?username=${encodeURIComponent(username)}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error('Failed to find user');
      }

      const users = await userResponse.json();
      if (!users || users.length === 0) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      const user = users[0];

      // Now get the token using user credentials
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          client_id: 'admin-cli',
          username: username,
          password: password,
          scope: 'openid profile email'
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Login failed:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText
        });
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      const data = await tokenResponse.json();
      console.log('Login successful');

      // Get detailed user info
      const userInfo = await this.getUserInfo(user.id);

      // Format user data for mobile app
      const formattedUser = {
        id: userInfo?.id || user.id,
        username: userInfo?.username || username,
        email: userInfo?.email || username,
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
        phoneNumber: userInfo?.attributes?.phoneNumber?.[0] || ''
      };

      console.log('Formatted user data:', formattedUser);

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        refreshExpiresIn: data.refresh_expires_in,
        tokenType: data.token_type,
        scope: data.scope,
        user: formattedUser
      };
    } catch (error) {
      console.error('Keycloak login error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: 'admin-cli',
          refresh_token: refreshToken,
          scope: 'openid profile email'
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          error: 'Invalid refresh token'
        };
      }

      const data = await response.json();

      return {
        success: true,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        refreshExpiresIn: data.refresh_expires_in,
        tokenType: data.token_type,
        scope: data.scope
      };
    } catch (error) {
      console.error('Keycloak refresh token error:', error);
      return {
        success: false,
        error: 'Token refresh failed'
      };
    }
  }
} 