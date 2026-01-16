import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL;

export async function GET() {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=read`);
    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to fetch trips' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Creating trip with body:', body);

    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.status === 'success') {
      const newTrip = {
        id: result.id,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Trip created successfully:', newTrip);
      return NextResponse.json(newTrip, { status: 201 });
    } else {
      console.error('Failed to create trip:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to create trip' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to create trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}
