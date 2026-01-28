import database from '@/lib/arango';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const cursor = await database.query(
      `FOR user IN users FILTER user.email == @email RETURN user`,
      { email },
    );
    const user = await cursor.next();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { message: 'Login successful', user: userWithoutPassword },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to login user:', error);
    return NextResponse.json(
      { error: 'Failed to login user' },
      { status: 500 },
    );
  }
}
