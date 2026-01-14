import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const PLANS = {
  YEARLY: {
    id: "prod_TmuM8HtXTSkVXz",
    name: "Premium Yearly",
    price: 49,
    priceId: process.env.STRIPE_YEARLY_PRICE_ID,
    description: "Billed annually",
    features: [
      "Access to all 75 Blind75 problems",
      "Interactive visualizations",
      "Code solutions in 3 languages",
      "Progress tracking",
      "Priority support",
    ],
  },
  LIFETIME: {
    id: "prod_TmuNmwqAzl8cOn",
    name: "Premium Lifetime",
    price: 99,
    priceId: process.env.STRIPE_LIFETIME_PRICE_ID,
    description: "One-time payment",
    features: [
      "Everything in Yearly",
      "Lifetime access",
      "All future updates",
      "Early access to new features",
      "Exclusive Discord community",
    ],
    popular: true,
  },
};
