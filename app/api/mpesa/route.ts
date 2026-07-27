import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { Resend } from 'resend';

const firebaseConfig = {
  apiKey: "AIzaSyBPLVqZ_CgguwH9W_yaCWiQiz2nzGniBZM",
  authDomain: "gunfits.firebaseapp.com",
  projectId: "gunfits",
  storageBucket: "gunfits.firebasestorage.app",
  messagingSenderId: "841263994035",
  appId: "1:841263994035:web:124e56aa1caff4fa3d8cc6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // M-Pesa callback data
    const { 
      Body: { 
        stkCallback: { 
          MerchantRequestID, 
          CheckoutRequestID, 
          ResultCode, 
          ResultDesc,
          CallbackMetadata 
        } 
      } 
    } = body;

    console.log('M-Pesa Callback:', { MerchantRequestID, ResultCode, ResultDesc });

    // Check if payment was successful (ResultCode 0 = success)
    if (ResultCode !== 0) {
      console.log('Payment failed:', ResultDesc);
      return NextResponse.json({ success: false, message: ResultDesc });
    }

    // Extract payment details from callback
    const callbackItems = CallbackMetadata?.Item || [];
    const amount = callbackItems.find((item: any) => item.Name === 'Amount')?.Value;
    const mpesaCode = callbackItems.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;
    const phoneNumber = callbackItems.find((item: any) => item.Name === 'PhoneNumber')?.Value;

    if (!amount || !mpesaCode) {
      return NextResponse.json({ success: false, message: 'Missing payment details' }, { status: 400 });
    }

    // TODO: Get cart items and customer email from your session/context
    // For now, we'll create a placeholder order
    // You need to modify this to get actual cart data from your app
    
    const orderId = `ORD-${Date.now()}`;
    const customerEmail = 'customer@email.com'; // TODO: Get from session/user
 const cartItems: any[] = []; // TODO: Get from CartContext
    // Create order in Firestore
    const orderRef = await addDoc(collection(db, 'orders'), {
      id: orderId,
      email: customerEmail,
      items: cartItems,
      totalAmount: amount,
      shippingAddress: '', // TODO: Get from checkout form
      status: 'Pending',
      createdAt: new Date().toISOString(),
      mpesaRef: mpesaCode,
      mpesaPhone: phoneNumber,
      statusUpdates: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          message: 'Payment confirmed! We are getting your order ready.'
        }
      ]
    });

    console.log('Order created:', orderId);

    // Send confirmation email
    const trackingLink = `https://gunfits.vercel.app/orders/track?orderId=${orderId}&email=${encodeURIComponent(customerEmail)}`;

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
          .status-badge { display: inline-block; padding: 8px 16px; background: #F0BE0020; color: #F0BE00; font-weight: 900; font-size: 12px; letter-spacing: 0.15em; border-radius: 4px; margin: 16px 0; }
          .cta-button { display: inline-block; margin-top: 16px; padding: 12px 28px; background: #C94E0A; color: #060606; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 0.15em; border-radius: 4px; }
          .footer { padding: 24px; border-top: 1px solid rgba(201,78,10,0.2); text-align: center; font-size: 12px; color: #888888; }
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
              Order Confirmed! 🔥
            </h2>
            
            <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #888888;">
              Your payment was successful. We've received your order and are getting your pieces ready to ship.
            </p>

            <div class="status-badge">PAYMENT CONFIRMED</div>

            <div style="margin: 32px 0; padding: 24px; background: linear-gradient(135deg, rgba(201,78,10,0.08), transparent); border: 1px solid rgba(201,78,10,0.2); border-radius: 4px;">
              <p style="margin: 0 0 12px; font-size: 10px; color: #C94E0A; letter-spacing: 0.2em; font-weight: 900; text-transform: uppercase;">YOUR ORDER</p>
              
              <p style="margin: 0 0 16px; font-size: 12px;">
                <strong style="color: #EEEBE3;">Order Number:</strong><br>
                <span style="font-size: 16px; color: #F0BE00; font-weight: 900; letter-spacing: 0.1em;">${orderId}</span>
              </p>

              <p style="margin: 0 0 16px; font-size: 12px;">
                <strong style="color: #EEEBE3;">Amount Paid:</strong><br>
                <span style="font-size: 16px; color: #F0BE00; font-weight: 900;">KES ${amount?.toLocaleString()}</span>
              </p>

              <p style="margin: 0; font-size: 12px;">
                <strong style="color: #EEEBE3;">M-Pesa Reference:</strong><br>
                <span style="color: #888888;">${mpesaCode}</span>
              </p>
            </div>

            <a href="${trackingLink}" class="cta-button">TRACK YOUR ORDER</a>

            <p style="margin: 32px 0 0; font-size: 12px; color: #888888; line-height: 1.6;">
              You can track your order anytime using the link above. Questions? Reply to this email or visit our site.
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

    try {
      await resend.emails.send({
        from: 'GUNFITS <orders@gunfits.vercel.app>',
        to: customerEmail,
        subject: `Order Confirmed! Your Order ${orderId} 🔥`,
        html: emailHTML,
      });
      console.log('Confirmation email sent');
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      trackingLink: trackingLink,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}