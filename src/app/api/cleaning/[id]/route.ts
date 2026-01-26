import database from "@/lib/arango";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const collection = database.collection("appointments");
  await collection.update(params.id, body);
  return NextResponse.json({ message: "Updated" });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const collection = database.collection("appointments");
  await collection.remove(params.id);
  return NextResponse.json({ message: "Deleted" });
}