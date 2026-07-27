import { NextResponse, NextRequest } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { Body } = body;

    if (Body.stkCallback.ResultCode === 0) {
      const metadata = Body.stkCallback.CallbackMetadata.Item;
      const amount = metadata.find((i: any) => i.Name === 'Amount')?.Value;
      const phone = metadata.find((i: any) => i.Name === 'PhoneNumber')?.Value;
      const receiptNumber = metadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const checkoutRequestId = Body.stkCallback.CheckoutRequestID;
      const accountRef = Body.stkCallback.CallbackMetadata?.Item?.find((i: any) => i.Name === 'AccountReference')?.Value;

      // Save ticket to Firestore
      await addDoc(collection(db, 'tickets'), {
        phone: phone?.toString(),
        amount,
        receiptNumber,
        checkoutRequestId,
        accountRef,
        createdAt: new Date().toISOString(),
        status: 'paid'
      });

      // Update sold tickets count on event
      const eventId = accountRef?.replace('GUNFITS-', '');
      if (eventId) {
        await updateDoc(doc(db, 'events', eventId), {
          soldTickets: increment(1)
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}