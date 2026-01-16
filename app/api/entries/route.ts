import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL;

export async function POST(req: NextRequest) {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Creating entry with body:', body);

    // Call Google Script with type='entry'
    // Note: The Google Script expects the 'type' param in the query string for 'create' action
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=create&type=entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json(result, { status: 201 });
    } else {
      console.error('Failed to create entry:', result.error);
      return NextResponse.json({ error: result.error || 'Failed to create entry' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log('Updating entry with body:', body);

    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=update&type=entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to update entry' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to update entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
