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

    const existing = await collection.document(id).catch(() => null);
    if (!existing) {
      return NextResponse.json({ error: 'Termin ne postoji.' }, { status: 404 });
    }

    if(existing.userId!==body.userId){
      return NextResponse.json(
        { error: 'Možete menjati samo svoje termine.' },
        { status: 403 }
      );
    }

    const updateData = {
      ...body,
      startDatetime: body.startDatetime || body.startDateTime,
      endDatetime: body.endDatetime || body.endDateTime,
    };

    delete updateData.startDateTime;
    delete updateData.endDateTime;

    const conflictQuery = `FOR a IN appointments
    FILTER a.cleanerId == @cleanerId
    FILTER a._key != @id
    FILTER a.startDatetime == @startDatetime
    FILTER a.endDatetime == @endDatetime
    RETURN a`;

    const conflictCursor = await database.query(conflictQuery, {
      cleanerId: updateData.cleanerId,
      id,
      startDatetime: updateData.startDatetime,
      endDatetime: updateData.endDatetime,
    });

    const conflicts = await conflictCursor.all();
    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Termin je zauzet. Molimo odaberite drugi termin.' },
        { status: 409 }
      );
    }
    const result = await collection.update(id, updateData, { returnNew: true });
    return NextResponse.json(result.new, { status: 200 });
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
