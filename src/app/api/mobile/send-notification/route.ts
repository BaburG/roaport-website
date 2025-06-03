import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NotificationService } from '@/services/notification.service';

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const { userId, title, messageBody, data } = requestBody;

        if (!userId || !title || !messageBody) {
            return NextResponse.json(
                { error: 'userId, title, and messageBody are required' },
                { status: 400 }
            );
        }

        // Get the user's push token from the database
        const notificationToken = await prisma.notificationToken.findFirst({
            where: {
                userId: userId
            }
        });

        if (!notificationToken?.notificationToken) {
            return NextResponse.json(
                { error: 'No push token found for this user' },
                { status: 404 }
            );
        }

        // Send the push notification
        await NotificationService.sendPushNotification(
            notificationToken.notificationToken,
            {
                title,
                body: messageBody,
                data
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Notification sent successfully'
        });
    } catch (error) {
        console.error('Error sending notification:', error);
        return NextResponse.json(
            { error: 'Failed to send notification' },
            { status: 500 }
        );
    }
} 