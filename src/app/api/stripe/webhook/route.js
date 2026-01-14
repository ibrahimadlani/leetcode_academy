import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Helper to ensure user document exists
async function ensureUserExists(userId, customerEmail, customerName = null) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      id: userId,
      email: customerEmail,
      name: customerName || customerEmail.split("@")[0],
      image: null,
      preferences: {
        language: "python",
        theme: "system",
        emailNotifications: true,
      },
      stats: {
        totalCompleted: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: null,
      },
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function POST(request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planId = session.metadata.planId;

        if (userId) {
          const subscriptionData = {
            status: "active",
            planId: planId,
            stripeCustomerId: session.customer,
            stripeSessionId: session.id,
            updatedAt: serverTimestamp(),
          };

          if (planId === "lifetime") {
            subscriptionData.type = "lifetime";
            subscriptionData.expiresAt = null;
          } else {
            subscriptionData.type = "subscription";
            subscriptionData.stripeSubscriptionId = session.subscription;
          }

          await setDoc(
            doc(db, "subscriptions", userId),
            subscriptionData,
            { merge: true }
          );
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata.userId;
        const planId = paymentIntent.metadata.planId;
        const type = paymentIntent.metadata.type;

        if (userId && type === "lifetime") {
          // Get customer info from Stripe
          let customerEmail = null;
          let customerName = null;
          if (paymentIntent.customer) {
            try {
              const customer = await stripe.customers.retrieve(paymentIntent.customer);
              customerEmail = customer.email;
              customerName = customer.name;
            } catch (e) {
              console.error("Error fetching customer:", e);
            }
          }

          // Ensure user document exists
          if (customerEmail) {
            await ensureUserExists(userId, customerEmail, customerName);
          }

          // Save subscription data
          await setDoc(
            doc(db, "subscriptions", userId),
            {
              status: "active",
              planId: planId,
              type: "lifetime",
              stripeCustomerId: paymentIntent.customer,
              stripePaymentIntentId: paymentIntent.id,
              amount: paymentIntent.amount,
              currency: paymentIntent.currency,
              expiresAt: null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata.userId;

          if (userId) {
            await setDoc(
              doc(db, "subscriptions", userId),
              {
                status: "active",
                planId: subscription.metadata.planId || "yearly",
                type: "subscription",
                stripeCustomerId: invoice.customer,
                stripeSubscriptionId: subscriptionId,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        if (userId) {
          await setDoc(
            doc(db, "subscriptions", userId),
            {
              status: subscription.status === "active" ? "active" : "inactive",
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        if (userId) {
          await setDoc(
            doc(db, "subscriptions", userId),
            {
              status: "cancelled",
              cancelledAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = subscription.metadata.userId;

          if (userId) {
            await setDoc(
              doc(db, "subscriptions", userId),
              {
                status: "past_due",
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
