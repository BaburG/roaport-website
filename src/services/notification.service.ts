import { Expo, ExpoPushMessage } from 'expo-server-sdk';

// Create a new Expo SDK client
const expo = new Expo();

export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, any>;
}

export class NotificationService {
    /**
     * Send a push notification to a single device
     * @param pushToken The Expo push token of the device
     * @param payload The notification payload
     */
    static async sendPushNotification(pushToken: string, payload: NotificationPayload): Promise<void> {
        try {
            // Validate the push token
            if (!Expo.isExpoPushToken(pushToken)) {
                console.error(`Push token ${pushToken} is not a valid Expo push token`);
                return;
            }

            // Create the message
            const message: ExpoPushMessage = {
                to: pushToken,
                sound: 'default',
                title: payload.title,
                body: payload.body,
                data: payload.data || {},
            };

            // Send the message
            const chunks = expo.chunkPushNotifications([message]);
            const tickets = [];

            // Send the chunks
            for (const chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error('Error sending push notification:', error);
                }
            }

            // Log the results
            console.log('Push notification tickets:', tickets);
        } catch (error) {
            console.error('Error in sendPushNotification:', error);
            throw error;
        }
    }

    /**
     * Send push notifications to multiple devices
     * @param pushTokens Array of Expo push tokens
     * @param payload The notification payload
     */
    static async sendBulkPushNotifications(pushTokens: string[], payload: NotificationPayload): Promise<void> {
        try {
            // Filter out invalid tokens
            const validTokens = pushTokens.filter(token => Expo.isExpoPushToken(token));

            if (validTokens.length === 0) {
                console.warn('No valid push tokens provided');
                return;
            }

            // Create messages for each token
            const messages: ExpoPushMessage[] = validTokens.map(token => ({
                to: token,
                sound: 'default',
                title: payload.title,
                body: payload.body,
                data: payload.data || {},
            }));

            // Send the messages
            const chunks = expo.chunkPushNotifications(messages);
            const tickets = [];

            // Send the chunks
            for (const chunk of chunks) {
                try {
                    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error('Error sending bulk push notifications:', error);
                }
            }

            // Log the results
            console.log('Bulk push notification tickets:', tickets);
        } catch (error) {
            console.error('Error in sendBulkPushNotifications:', error);
            throw error;
        }
    }
} 