import database from '@/lib/arango';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const collection = database.collection('appointments');

    const updateData = {
      ...body,
      startDatetime: body.startDatetime || body.startDateTime,
      endDatetime: body.endDatetime || body.endDateTime,
    };

    delete updateData.startDateTime;
    delete updateData.endDateTime;

    await collection.update(id, updateData);
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    console.error('Failed to update appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body= await req.json();
    const user=body.user;

    const collection = database.collection('appointments');
    const appointment= await collection.document(id);

    if(user.role==='cleaner'&& appointment.cleanerId!==user._key){
      return NextResponse.json(
        { error: "Možete otkazati samo termine koji su vama dodeljeni." },
        { status: 403 }
      )
    }

    await collection.remove(id);
    return NextResponse.json({ message: 'Termin otkazan' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 },
    );
  }
}
