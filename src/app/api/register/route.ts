import database from '@/lib/arango';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collection = database.collection('users');

    const newUser = {
      username: body.username,
      email: body.email,
      password: body.password,
    };
    const result = await collection.save(newUser, { returnNew: true });
    return NextResponse.json(result.new, { status: 201 });
  } catch (error) {
    console.error('Failed to register user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 },
    );
  }
}
