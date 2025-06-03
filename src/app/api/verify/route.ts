import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming prisma client is at '@/lib/prisma'
import { NotificationService } from '@/services/notification.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json({ error: 'reportId is required' }, { status: 400 });
    }

    const reportIdInt = parseInt(reportId as string, 10);

    if (isNaN(reportIdInt)) {
      return NextResponse.json({ error: 'Invalid reportId format' }, { status: 400 });
    }

    const existingReport = await prisma.reports.findUnique({
      where: { id: reportIdInt },
    });

    if (!existingReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const updatedReport = await prisma.reports.update({
      where: { id: reportIdInt },
      data: {
        verified: new Date(),
      },
    });

    // Send notification if notification_token exists
    if (updatedReport.notification_token) {
      try {
        await NotificationService.sendPushNotification(
          updatedReport.notification_token,
          {
            title: 'Rapor Doğrulandı',
            body: `${updatedReport.name} raporu başarıyla doğrulandı.`,
            data: {
              reportId: updatedReport.id,
              type: updatedReport.type,
              status: 'verified'
            }
          }
        );
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
      }
    }

    return NextResponse.json({ success: true, report: updatedReport }, { status: 200 });
  } catch (error) {
    console.error('Error verifying report:', error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 