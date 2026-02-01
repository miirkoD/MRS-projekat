import database from '@/lib/arango';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
 try {
    const body = await req.json();
    const collection = database.collection('subscriptions');

    if (!body.userId || !body.selectedPlan || !body.appointmentIds) {
      return NextResponse.json(
        { error: "Nedostaju obavezna polja." },
        { status: 400 }
      );
    }

    const subscription = {
      userId: body.userId,
      selectedPlan: body.selectedPlan,
      appointmentIds: body.appointmentIds,
      startDate: body.startDate,
      endDate: body.endDate,
      additionalServices: body.additionalServices || [],
      price: body.price,
      status: body.status || "active",
    };

    const result = await collection.save(subscription, { returnNew: true });

    return NextResponse.json(result.new, { status: 201 });
  } catch (err) {
    console.error("Greška pri kreiranju pretplate:", err);
    return NextResponse.json(
      { error: "Greška na serveru." },
      { status: 500 }
    );
  }

}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    await database.query(
      `FOR sub IN subscriptions 
       FILTER sub.userId == @userId 
       AND sub.status == 'active' 
       AND sub.endDate < @now
       UPDATE sub WITH { status: 'inactive' } IN subscriptions`,
      { userId, now },
    );

    const cursor = await database.query(
      `FOR sub IN subscriptions 
       FILTER sub.userId == @userId
       SORT sub.createdAt DESC
       RETURN sub`,
      { userId },
    );

    const subscriptions = await cursor.all();

    return NextResponse.json({ subscriptions }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 },
    );
  }
}
