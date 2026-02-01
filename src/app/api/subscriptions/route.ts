import database from '@/lib/arango';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, planType, price } = body;

    if (!userId || !planType || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Check if user already has an active subscription
    const existingSubscription = await database.query(
      `FOR sub IN subscriptions 
       FILTER sub.userId == @userId AND sub.status == 'active'
       RETURN sub`,
      { userId },
    );
    const activeSub = await existingSubscription.next();

    if (activeSub) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 },
      );
    }

    // Calculate end date (one month from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const subscription = {
      userId,
      planType,
      price,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: startDate.toISOString(),
    };

    const collection = database.collection('subscriptions');
    const result = await collection.save(subscription);

    return NextResponse.json(
      {
        message: 'Subscription created successfully',
        subscription: { ...subscription, _key: result._key },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 },
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

    // First, update expired subscriptions
    const now = new Date().toISOString();
    await database.query(
      `FOR sub IN subscriptions 
       FILTER sub.userId == @userId 
       AND sub.status == 'active' 
       AND sub.endDate < @now
       UPDATE sub WITH { status: 'inactive' } IN subscriptions`,
      { userId, now },
    );

    // Then fetch all subscriptions (active and inactive)
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
