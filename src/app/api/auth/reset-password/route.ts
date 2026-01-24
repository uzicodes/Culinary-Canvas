import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();
    
    const client = await clientPromise;
    const db = client.db(); 

    // Find user with valid token & check expiry
    const user = await db.collection("members").findOne({ 
      email: { $regex: new RegExp(`^${email}$`, "i") }, 
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } 
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired link." }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password & remove reset fields
    await db.collection("members").updateOne(
      { email: user.email },
      { 
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" } 
      }
    );

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}