import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';

  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return NextResponse.json(messages);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json({ error: 'Locale not found' }, { status: 404 });
  }
} 