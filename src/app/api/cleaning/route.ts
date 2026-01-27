import database from "@/lib/arango";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cursor = await database.query(`FOR a IN appointments RETURN a`);
    const appointments = await cursor.all();
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const collection = database.collection("appointments");
    
    // Normalize the datetime fields
    const appointment = {
      ...body,
      startDatetime: body.startDatetime || body.startDateTime,
      endDatetime: body.endDatetime || body.endDateTime,
    };
    
    // Remove duplicate fields
    delete appointment.startDateTime;
    delete appointment.endDateTime;
    
    const result = await collection.save(appointment, { returnNew: true });
    return NextResponse.json(result.new, { status: 201 });
  } catch (error) {
    console.error("Failed to create appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}