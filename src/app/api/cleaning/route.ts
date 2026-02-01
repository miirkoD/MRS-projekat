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

type Appointment={
  userId: string;
  cleanerId: string;
  startDatetime: string;
  endDatetime: string;
  _key?: string;
  subscriptionId: number;
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

    const subCursor= await database.query(`
      FOR s in appointments
      SORT TO_NUMBER(s.subscriptionId) DESC
      LIMIT 1
      RETURN s.subscriptionId`);

      const lastSubId= await subCursor.next();
      let nextSubIdNumber=1;

      if (lastSubId && !isNaN(Number(lastSubId))){
        nextSubIdNumber=Number(lastSubId)+1;
      }

     const appointment: Appointment = {
      userId: body.userId,
      cleanerId: body.cleanerId,
      startDatetime: body.startDatetime,
      endDatetime: body.endDatetime,
      subscriptionId: nextSubIdNumber,
    };

    const startDate=new Date(body.startDatetime);
    const monthStart=new Date(startDate.getFullYear(),startDate.getMonth(),1);
    monthStart.setHours(0,0,0,0);
    const monthEnd=new Date(startDate.getFullYear(),startDate.getMonth()+1,0);
    monthEnd.setHours(23,59,59,999);

    const weekStart=new Date(startDate);
    weekStart.setDate(startDate.getDate()-startDate.getDay()+1);
    weekStart.setHours(0,0,0,0);
    const weekEnd=new Date(weekStart);
    weekEnd.setDate(weekStart.getDate()+6);
    weekEnd.setHours(23,59,59,999);

    const weekCountQuery=`FOR a IN appointments
    FILTER a.userId == @userId
    FILTER a.startDatetime>= @weekStart AND a.startDatetime<= @weekEnd
    COLLECT WITH COUNT INTO length
    RETURN length`;

    const weekCountCursor=await database.query(weekCountQuery,{
      userId: body.userId,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString()
    });

    const [weekCount]= await weekCountCursor.all();

    if (weekCount>=1){
      return NextResponse.json(
        {error: 'Dostigli ste nedeljni limit od 1 zakazana čišćenja.'},
        {status:403}
      );
    }

    const countQuery=`FOR a IN appointments
    FILTER a.userId == @userId
    FILTER a.startDatetime >= @monthStart AND a.startDatetime <= @monthEnd
    COLLECT WITH COUNT INTO length
    RETURN length`;

    const countCursor=await database.query(countQuery,{
      userId: body.userId,
      monthStart: monthStart.toISOString(),
      monthEnd: monthEnd.toISOString()
    });

    const [count]= await countCursor.all();

    if (count>=3){
      return NextResponse.json(
        {error: 'Dostigli ste mesečni limit od 3 zakazana čišćenja.'},
        {status:403}
      );
    }

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
    let nextKeyNumber =  1;

    if(lastKey&& typeof lastKey ==='string' && lastKey.startsWith('appt')){
      const num=parseInt(lastKey.replace('appt',''), 10);
      if(!isNaN(num)){
        nextKeyNumber=num+1;
      }
    }
    appointment._key = `appt${String(nextKeyNumber).padStart(3, '0')}`;

    const result = await collection.save(appointment, { returnNew: true });

    const countCursor2=await database.query(countQuery,{
      userId: body.userId,
      monthStart: monthStart.toISOString(),
      monthEnd: monthEnd.toISOString()
    });

    const [count2]= await countCursor2.all();

    return NextResponse.json({...result.new, appointmentCount: count2}, { status: 201 });
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 },
    );
  }
}
