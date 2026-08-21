import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await resend.emails.send({
      from: 'GUNFITS <noreply@gunfits.com>',
      to: email,
      subject: '🎉 Welcome to GUNFITS - Different Cloth',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #060606; color: #EEEBE3; padding: 40px;">
          
          {/* Header */}
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid rgba(201,78,10,0.3); padding-bottom: 24px;">
            <h1 style="font-size: 32px; margin: 0; letter-spacing: 0.1em; font-weight: 900; color: #C94E0A;">
              GUNFITS
            </h1>
            <p style="font-size: 12px; color: #7FD4F0; letter-spacing: 0.15em; margin: 8px 0 0; text-transform: uppercase;">
              Different Cloth
            </p>
          </div>

          {/* Welcome Message */}
          <div style="margin-bottom: 40px;">
            <h2 style="font-size: 24px; color: #EEEBE3; margin-top: 0; letter-spacing: 0.05em;">
              Welcome to the Movement, ${name}
            </h2>
            <p style="font-size: 16px; line-height: 1.6; color: #CCCCCC; margin: 16px 0;">
              You've just joined a community of people who move different. Raw. Authentic. Nairobi's urban streetwear culture, elevated.
            </p>
          </div>

          {/* What's Next */}
          <div style="background: rgba(201,78,10,0.1); border-left: 3px solid #C94E0A; padding: 20px; margin-bottom: 40px; border-radius: 4px;">
            <h3 style="font-size: 14px; color: #C94E0A; margin: 0 0 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 900;">
              What's Next?
            </h3>
            <ul style="margin: 0; padding-left: 20px; list-style: none;">
              <li style="margin-bottom: 8px; color: #EEEBE3;">✓ Explore our latest collections</li>
              <li style="margin-bottom: 8px; color: #EEEBE3;">✓ Get exclusive drop updates</li>
              <li style="margin-bottom: 8px; color: #EEEBE3;">✓ Join the GUNFITS community</li>
            </ul>
          </div>

          {/* CTA Button */}
          <div style="text-align: center; margin-bottom: 40px;">
            <a href="https://gunfits-react.vercel.app/collections" style="background: linear-gradient(135deg, #C94E0A, #F0BE00); color: #060606; padding: 14px 32px; text-decoration: none; font-weight: 900; letter-spacing: 0.1em; border-radius: 4px; display: inline-block; text-transform: uppercase; font-size: 12px;">
              START SHOPPING
            </a>
          </div>

          {/* Social */}
          <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(201,78,10,0.2);">
            <p style="font-size: 12px; color: #7FD4F0; letter-spacing: 0.1em; margin: 0 0 12px;">
              FOLLOW THE MOVEMENT
            </p>
            <a href="https://instagram.com/gun_fits" style="color: #C94E0A; text-decoration: none; font-weight: 900; margin: 0 12px;">
              @gun_fits
            </a>
          </div>

          {/* Footer */}
          <div style="text-align: center; font-size: 11px; color: #666666; margin-top: 32px; letter-spacing: 0.1em;">
            <p style="margin: 0;">© 2026 GUNFITS. All rights reserved.</p>
            <p style="margin: 8px 0 0;">Nairobi, Kenya</p>
          </div>

        </div>
      `,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, messageId: result.data?.id });
  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}