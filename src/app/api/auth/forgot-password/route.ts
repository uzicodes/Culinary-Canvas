import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();


    // Check if user exists in your 'members' collection
    const user = await db.collection("members").findOne({ 
    email: { $regex: new RegExp(`^${email}$`, "i") } 
    });

    if (!user) {
    return NextResponse.json({ error: "User with this email does not exist." }, { status: 404 });
    }
    // Generate a secure random token and set 1-hour expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // Current time + 1 hour

    // Update the user document with the reset details
    await db.collection("members").updateOne(
    { email: user.email }, // Use the exact email string from the database record
    { $set: { resetToken, resetTokenExpiry: expiry } }
    );

    // Setup Nodemailer (add to .env.local)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${user.email}`;

    // Send the Email
    await transporter.sendMail({
    to: user.email,
    subject: "Reset Your Culinary Canvas Password",
    html: `
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #f7fbe7;">
        <h1 style="text-transform: uppercase; letter-spacing: -1px;">Reset <span style="color: #bce334;">Vault</span></h1>
        <p style="font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase;">Click below to set your new security key</p>
        <a href="${resetUrl}" style="display: inline-block; margin-top: 20px; padding: 15px 30px; background-color: #000; color: #bce334; text-decoration: none; border-radius: 12px; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
            Open Reset Vault
        </a>
        </div>
    `,
    });

    return NextResponse.json({ success: true, message: "Reset link sent to your email." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}