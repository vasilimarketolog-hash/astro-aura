import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, email } = body;

    const gatewayActive = process.env.PAYMENT_GATEWAY_ACTIVE === 'true';

    if (!gatewayActive) {
      return NextResponse.json({
        success: false,
        gatewayActive: false,
        message: 'Payment gateway is currently being connected'
      });
    }

    const orderId = `ASTRO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      success: true,
      gatewayActive: true,
      orderId,
      status: 'pending',
      paymentUrl: `/checkout-success?orderId=${orderId}&planId=${planId}`,
      message: 'Payment session created'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
