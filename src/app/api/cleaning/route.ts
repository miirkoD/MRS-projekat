import database from '@/lib/arango';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cleanerId = searchParams.get('cleaner');

    const query = `FOR a IN appointments
    ${cleanerId ? 'FILTER a.cleanerId == @cleanerId' : ''}
    LET u = DOCUMENT("users", a.userId)
    RETURN MERGE(a, {user: {firstName: u.firstName, lastName: u.lastName}})`;

    const bindVars = cleanerId ? { cleanerId } : {};
    const cursor = await database.query(query, bindVars);
    const appointments = await cursor.all();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collection = database.collection('appointments');

    const appointment = {
      ...body,
      startDatetime: body.startDatetime || body.startDateTime,
      endDatetime: body.endDatetime || body.endDateTime,
    };

    delete appointment.startDateTime;
    delete appointment.endDateTime;

    const cursor = await database.query(`
      FOR a IN appointments
      SORT a._key DESC
      LIMIT 1
      RETURN a._key`);

    const lastKey = await cursor.next();
    let nextKeyNumber = 1;

    if (lastKey) {
      const num = parseInt(lastKey.replace('appt', ''), 10);
      nextKeyNumber = num + 1;
    }
    appointment._key = `appt${String(nextKeyNumber).padStart(3, '0')}`;

    const result = await collection.save(appointment, { returnNew: true });
    return NextResponse.json(result.new, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 },
    );
  }
}
