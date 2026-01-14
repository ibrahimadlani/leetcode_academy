import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." },
        { status: 500 }
      );
    }

    // Dynamic import to catch initialization errors
    const { stripe, PLANS } = await import("@/lib/stripe");

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId || !["yearly", "lifetime"].includes(planId)) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    const plan = planId === "lifetime" ? PLANS.LIFETIME : PLANS.YEARLY;
    const userId = session.user.id || session.user.email;

    // For subscriptions, we need a priceId
    if (planId === "yearly" && !plan.priceId) {
      return NextResponse.json(
        { error: "STRIPE_YEARLY_PRICE_ID is not configured in environment variables" },
        { status: 500 }
      );
    }

    // Get or create customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name,
        metadata: { userId },
      });
    }

    if (planId === "lifetime") {
      // One-time payment with PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.price * 100, // Convert to cents
        currency: "eur",
        customer: customer.id,
        payment_method_types: ["card"],
        metadata: {
          userId,
          planId,
          type: "lifetime",
        },
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        type: "payment",
        planId,
        amount: plan.price,
      });
    } else {
      // Subscription with PaymentIntent
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: plan.priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId,
          planId,
          type: "subscription",
        },
      });

      const invoice = subscription.latest_invoice;
      const paymentIntent = invoice.payment_intent;

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        subscriptionId: subscription.id,
        type: "subscription",
        planId,
        amount: plan.price,
      });
    }
  } catch (error) {
    console.error("Create payment intent error:", error);

    // Return a proper JSON error response
    return NextResponse.json(
      {
        error: error.message || "Failed to create payment intent",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
