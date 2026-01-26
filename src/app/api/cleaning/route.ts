import database from "@/lib/arango";
import { NextResponse } from "next/server";

export async function GET() {
  const cursor = await database.query(`FOR a IN appointments RETURN a`);
  const dates = await cursor.all();
  return NextResponse.json(dates);
}

export async function POST(req: Request) {
  const body = await req.json();
  const collection = database.collection("appointments");
  await collection.save(body, { returnNew: true });
  return NextResponse.json({ message: "Added" }, { status: 201 });
}