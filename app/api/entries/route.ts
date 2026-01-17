import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Creating entry with body:', body);

    // The client sends 'id' as the tripId for creation
    const { id: tripId, city, date, content } = body;

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const entry = await prisma.entry.create({
      data: {
        tripId,
        city,
        date,
        content,
      },
    });

    console.log('Entry created successfully:', entry);
    
    // Return format matching what the client expects
    return NextResponse.json({ status: 'success', data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Updating entry with body:', body);

    // The client sends 'id' as the entryId for update
    const { id, content, city, date } = body;

    if (!id) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const entry = await prisma.entry.update({
      where: { id },
      data: {
        content,
        ...(city && { city }),
        ...(date && { date }),
      },
    });

    return NextResponse.json({ status: 'success', data: entry }, { status: 200 });
  } catch (error) {
    console.error('Failed to update entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}
