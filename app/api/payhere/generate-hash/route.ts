import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { merchant_id, order_id, amount, currency } = await req.json();
  const merchant_secret = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_SECRET;

  if (!merchant_id || !order_id || !amount || !currency || !merchant_secret) {
    return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
  }

  const formattedAmount = Number(amount).toFixed(2);
  const secretMd5 = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
  const hashString = merchant_id + order_id + formattedAmount + currency + secretMd5;
  const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

  return NextResponse.json({ success: true, hash });
}