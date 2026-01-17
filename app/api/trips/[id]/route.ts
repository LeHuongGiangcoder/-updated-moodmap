import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`Fetching trip with ID: ${id}`);

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { entries: true },
    });

    if (trip) {
      return NextResponse.json(trip, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return NextResponse.json({ error: 'Failed to fetch trip' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`Updating trip with ID: ${id}`);
    const body = await req.json();

    const trip = await prisma.trip.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error('Failed to update trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log(`Deleting trip with ID: ${id}`);

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Trip deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}
