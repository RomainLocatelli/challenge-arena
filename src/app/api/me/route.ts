// app/api/me/route.ts (Next.js route)
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie'); // récupère le cookie du client
  const backendUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${backendUrl}/auth/me`, {
    headers: { Cookie: cookie || '' },
    credentials: 'include'
  });

  const data = await res.json();
  return NextResponse.json(data);
}
