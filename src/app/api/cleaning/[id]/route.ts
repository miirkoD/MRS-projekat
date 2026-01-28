import database from "@/lib/arango";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const collection = database.collection("appointments");
    
    // Normalize the datetime fields
    const updateData = {
      ...body,
      startDatetime: body.startDatetime || body.startDateTime,
      endDatetime: body.endDatetime || body.endDateTime,
    };
    
    // Remove duplicate fields
    delete updateData.startDateTime;
    delete updateData.endDateTime;
    
    await collection.update(params.id, updateData);
    return NextResponse.json({ message: "Updated" });
  } catch (error) {
    console.error("Failed to update appointment:", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const collection = database.collection("appointments");
    await collection.remove(params.id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}