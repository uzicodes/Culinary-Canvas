import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import sgMail from '@sendgrid/mail';
import crypto from 'crypto';

const uri = process.env.MONGODB_URI!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await MongoClient.connect(uri);
    const db = client.db('culinary_canvas');
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      await client.close();
      // Don't reveal if email exists or not for security
      return NextResponse.json({ 
        message: 'If an account exists with this email, a password reset link has been sent.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await db.collection('users').updateOne(
      { email },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry 
        } 
      }
    );

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

    // Send email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!, // Verified sender email in SendGrid
      subject: 'Password Reset Request - Culinary Canvas',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #029FBE; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
            .button { display: inline-block; padding: 12px 30px; background: #029FBE; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🍽️ Culinary Canvas</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hi there,</p>
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #029FBE;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>Best regards,<br>The Culinary Canvas Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await sgMail.send(msg);
    await client.close();

    return NextResponse.json({ 
      message: 'If an account exists with this email, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
