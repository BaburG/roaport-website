import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return NextResponse.json(messages);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return NextResponse.json({ error: 'Locale not found' }, { status: 404 });
  }
}