import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get Resend API key from environment variables
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      // Fallback to mailto if Resend is not configured
      const emailContent = `
New Contact Form Submission from ROF Website

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}

---
This email was sent from the Rwanda Olympiad Foundation contact form.
      `.trim();

      const mailtoLink = `mailto:info@rwandaolympiadfoundation.org?subject=${encodeURIComponent(subject || 'Contact from ROF Website')}&body=${encodeURIComponent(emailContent)}`;
      
      return NextResponse.json({ 
        success: true,
        mailtoLink: mailtoLink,
        message: 'Email service not configured. Opening your email client...'
      });
    }

    // Send email using Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'ROF Website <noreply@rwandaolympiadfoundation.org>',
        to: ['info@rwandaolympiadfoundation.org'],
        replyTo: email,
        subject: subject || `Contact Form: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00438A;">New Contact Form Submission</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
            </div>
            <div style="margin: 20px 0;">
              <h3 style="color: #00438A;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from the Rwanda Olympiad Foundation contact form.
            </p>
          </div>
        `,
        text: `
New Contact Form Submission from ROF Website

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}

---
This email was sent from the Rwanda Olympiad Foundation contact form.
        `.trim(),
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      throw new Error(errorData.message || 'Failed to send email');
    }

    const data = await resendResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
      emailId: data.id,
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email. Please try again or email us directly at info@rwandaolympiadfoundation.org',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
