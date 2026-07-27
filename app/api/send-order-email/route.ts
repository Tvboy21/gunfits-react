import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailRequest {
  email: string;
  orderId: string;
  status: string;
  message: string;
  items: Array<{ name: string; price: number; quantity: number; size: string }>;
  totalAmount: number;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Pending':
      return '#F0BE00';
    case 'Processing':
      return '#7FD4F0';
    case 'Shipped':
      return '#C94E0A';
    case 'Delivered':
      return '#44cc44';
    default:
      return '#888888';
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: OrderEmailRequest = await request.json();
    const { email, orderId, status, message, items, totalAmount } = body;

    // Build email HTML
    const itemsHTML = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid rgba(201,78,10,0.1); color: #EEEBE3; font-size: 13px;">
          ${item.name}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid rgba(201,78,10,0.1); color: #888888; font-size: 12px; text-align: center;">
          ${item.size}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid rgba(201,78,10,0.1); color: #888888; font-size: 12px; text-align: center;">
          x${item.quantity}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid rgba(201,78,10,0.1); color: #F0BE00; font-size: 13px; font-weight: 900; text-align: right;">
          KES ${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>
    `
      )
      .join('');

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: #060606; color: #EEEBE3; }
          .header { padding: 32px 24px; border-bottom: 1px solid rgba(201,78,10,0.2); }
          .content { padding: 32px 24px; }
          .status-badge { display: inline-block; padding: 8px 16px; background: ${getStatusColor(status)}20; color: ${getStatusColor(status)}; font-weight: 900; font-size: 12px; letter-spacing: 0.15em; border-radius: 4px; margin: 16px 0; }
          .order-item { padding: 12px 0; border-bottom: 1px solid rgba(201,78,10,0.1); }
          .order-item:last-child { border-bottom: none; }
          .footer { padding: 24px; border-top: 1px solid rgba(201,78,10,0.2); text-align: center; font-size: 12px; color: #888888; }
          .cta-button { display: inline-block; margin-top: 16px; padding: 12px 28px; background: #C94E0A; color: #060606; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 0.15em; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 0.05em;">GUNFITS</h1>
            <p style="margin: 8px 0 0; font-size: 12px; color: #C94E0A; letter-spacing: 0.1em; font-weight: 900;">CUT FROM A DIFFERENT CLOTH</p>
          </div>

          <div class="content">
            <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 900; letter-spacing: 0.05em;">
              Order Status Updated
            </h2>
            
            <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #888888;">
              ${message}
            </p>

            <div class="status-badge">${status}</div>

            <div style="margin: 32px 0; padding: 24px; background: linear-gradient(135deg, rgba(201,78,10,0.08), transparent); border: 1px solid rgba(201,78,10,0.2); border-radius: 4px;">
              <p style="margin: 0 0 12px; font-size: 10px; color: #C94E0A; letter-spacing: 0.2em; font-weight: 900; text-transform: uppercase;">ORDER DETAILS</p>
              
              <p style="margin: 0 0 16px; font-size: 12px;">
                <strong style="color: #EEEBE3;">Order Number:</strong><br>
                <span style="font-size: 16px; color: #F0BE00; font-weight: 900; letter-spacing: 0.1em;">${orderId}</span>
              </p>

              <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
                <thead>
                  <tr>
                    <th style="text-align: left; padding: 8px 0; color: #C94E0A; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; border-bottom: 1px solid rgba(201,78,10,0.2);">ITEM</th>
                    <th style="text-align: center; padding: 8px 0; color: #C94E0A; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; border-bottom: 1px solid rgba(201,78,10,0.2);">SIZE</th>
                    <th style="text-align: center; padding: 8px 0; color: #C94E0A; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; border-bottom: 1px solid rgba(201,78,10,0.2);">QTY</th>
                    <th style="text-align: right; padding: 8px 0; color: #C94E0A; font-size: 10px; font-weight: 900; letter-spacing: 0.1em; border-bottom: 1px solid rgba(201,78,10,0.2);">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 1px solid rgba(201,78,10,0.2);">
                <p style="margin: 0; color: #EEEBE3; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em;">TOTAL</p>
                <p style="margin: 0; color: #F0BE00; font-weight: 900; font-size: 16px; font-family: 'Bebas Neue', sans-serif;">KES ${totalAmount.toLocaleString()}</p>
              </div>
            </div>

            <a href="https://gunfits.vercel.app/orders/track?orderId=${orderId}&email=${email}" class="cta-button">TRACK ORDER</a>

            <p style="margin: 32px 0 0; font-size: 12px; color: #888888; line-height: 1.6;">
              Questions? Reply to this email or visit our site.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0;">GUNFITS • Cut From A Different Cloth</p>
            <p style="margin: 8px 0 0;">© 2026. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const result = await resend.emails.send({
      from: 'GUNFITS <orders@gunfits.vercel.app>',
      to: email,
      subject: `Your Order ${orderId} is ${status} 🔥`,
      html: emailHTML,
    });

    if (result.error) {
      console.error('Resend error:', result.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, messageId: result.data?.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}