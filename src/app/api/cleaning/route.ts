import database from '@/lib/arango';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cleanerParam = searchParams.get('cleaner');
    const role = searchParams.get('role');
    const userId= searchParams.get('userId');

    let cleanerId: string | null = cleanerParam;

    if(role==='cleaner'&&userId){
      cleanerId=userId;
    }else if(cleanerParam){
      cleanerId=cleanerParam;
    }

    const query = `FOR a IN appointments
    ${cleanerId ? 'FILTER a.cleanerId == @cleanerId' : ''}
    LET u = DOCUMENT("users", a.userId)
    RETURN MERGE(a, {user: {firstName: u.firstName, lastName: u.lastName }
    })`;

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const collection = database.collection('appointments');

    if(body.user?.role==='cleaner'){
      return NextResponse.json(
        {error: 'Spremačice ne mogu zakazivati termine.'},
        {status:403}
      );
    }

    const appointment = {
      ...body,
      startDatetime: body.startDatetime,
      endDatetime: body.endDatetime,
      status: 'scheduled',
    };

    const conflictQuery=  `FOR a IN appointments
    FILTER a.cleanerId == @cleanerId
    FILTER a.startDatetime == @startDatetime
    RETURN a`;
    
    const conflictCursor=await database.query(conflictQuery,{
     cleanerId: appointment .cleanerId,
      startDatetime: appointment.startDatetime
    });
    const conflicts=await conflictCursor.all();
    
    if(conflicts.length>0){
      return NextResponse.json(
        {error: 'Termin je već zauzet. Molimo izaberite drugo vreme.'},
        {status:409}
      );
    }

    const cursor = await database.query(`
      FOR a IN appointments
      SORT a._key DESC
      LIMIT 1
      RETURN a._key`);

    const lastKey = await cursor.next();
    const nextKeyNumber = lastKey ? parseInt(lastKey.replace('appt',''), 10)+ 1 : 1;
    appointment._key=`appt${String(nextKeyNumber).padStart(3,'0')}`;

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
