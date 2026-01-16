import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SHEETS_API_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_URL;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    console.log(`Fetching trip with ID: ${id}`);

    // Use the specific read action for a single trip ID
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=read&id=${id}`);
    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json(result.data, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to fetch trip' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    console.log(`Updating trip with ID: ${id}`);
    const body = await req.json();
    const updateData = { id, ...body };

    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=update`, {
      method: 'POST', // Google Apps Script Web App mostly supports GET and POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json(updateData, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to update trip' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to update trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!GOOGLE_SHEETS_API_URL) {
    return NextResponse.json({ error: 'Google Sheets API URL not configured' }, { status: 500 });
  }

  try {
    const { id } = await params;
    console.log(`Deleting trip with ID: ${id}`);
    
    const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=delete&id=${id}`, {
        method: 'POST', 
    });
    
    const result = await response.json();

    if (result.status === 'success') {
      console.log(`Successfully deleted trip ${id}`);
      return NextResponse.json({ message: 'Trip deleted successfully' }, { status: 200 });
    } else {
      console.error(`Failed to delete trip ${id}:`, result.error);
      return NextResponse.json({ error: result.error || 'Failed to delete trip' }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}
