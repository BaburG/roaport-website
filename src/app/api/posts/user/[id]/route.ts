import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function decodeToken(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Token decode failed:', error);
        return null;
    }
}

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id: userId } = await Promise.resolve(context.params);

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const payload = decodeToken(token);

        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        console.log('Token payload:', payload);
        console.log('Requested user ID:', userId);

        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Prisma sorgusu ile dene
        const reports = await prisma.reports.findMany({
            where: {
                username: userId
            },
            skip,
            take: limit,
            orderBy: {
                date_created: 'desc'
            }
        });

        const posts = (reports as any[]).map(report => ({
            id: report.id.toString(),
            name: report.name,
            imageUrl: `https://img.roaport.com/${report.file_name}`,
            longitude: report.longitude,
            latitude: report.latitude,
            dateCreated: report.date_created ? new Date(report.date_created).toISOString() : "",
            type: report.type ?? "none",
            status: report.status,
            description: report.detail ?? "",
            verified: report.verified ? "true" : "false"
        }));

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 