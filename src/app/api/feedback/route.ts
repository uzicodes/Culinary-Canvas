import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, type, message } = body;

    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    const feedback = {
      name,
      email,
      type,
      message,
      timestamp: new Date(),
      isRead: false,
    };

    await db.collection("feedbacks").insertOne(feedback);

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("culinary-canvas");

    const feedbacks = await db
      .collection("feedbacks")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}
