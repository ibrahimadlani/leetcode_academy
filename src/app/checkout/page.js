"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Lock,
  Shield,
  Check,
  Loader2,
  CreditCard,
  Sparkles,
  AlertCircle,
  Zap,
  Infinity,
} from "lucide-react";
import Logo from "@/components/Logo";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const plans = {
  yearly: {
    id: "yearly",
    name: "Premium Yearly",
    price: 49,
    period: "/year",
    description: "Accès complet pendant 1 an",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      "Accès aux 75 problèmes Blind75",
      "Visualisations interactives",
      "Solutions en 3 langages",
      "Suivi de progression",
      "Support prioritaire",
    ],
  },
  lifetime: {
    id: "lifetime",
    name: "Premium Lifetime",
    price: 99,
    period: "",
    description: "Accès à vie, paiement unique",
    icon: Infinity,
    gradient: "from-violet-500 to-purple-500",
    popular: true,
    features: [
      "Tout du plan Yearly",
      "Accès à vie",
      "Toutes les futures mises à jour",
      "Accès anticipé aux nouvelles fonctionnalités",
      "Communauté Discord exclusive",
    ],
  },
};

function CheckoutForm({ planId, clientSecret, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 rounded-xl p-6 border">
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                email: "",
              },
            },
          }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20"
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 shadow-lg shadow-violet-500/25"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-5 w-5" />
            Payer ${plans[planId]?.price || 0}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-4 w-4" />
          <span>Paiement sécurisé</span>
        </div>
        <div className="flex items-center gap-1">
          <CreditCard className="h-4 w-4" />
          <span>Cryptage SSL 256-bit</span>
        </div>
      </div>
    </form>
  );
}

function CheckoutContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "lifetime";

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const plan = plans[planId] || plans.lifetime;
  const Icon = plan.icon;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user) {
      createPaymentIntent();
    }
  }, [status, session, planId]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push("/checkout/success");
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Préparation du paiement...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={createPaymentIntent} className="w-full">
              Réessayer
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/pricing">Retour aux tarifs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-violet-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pricing">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="small" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Récapitulatif de la commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan details */}
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.gradient} p-0.5 flex-shrink-0`}>
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                      <Icon className="h-7 w-7" style={{ color: plan.popular ? '#8b5cf6' : '#3b82f6' }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.popular && (
                        <Badge variant="secondary" className="text-xs">Populaire</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-3">
                  <p className="text-sm font-medium">Inclus :</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>${plan.price}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                  </div>
                </div>

                {/* Account info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Facturé à</p>
                  <p className="font-medium">{session?.user?.name}</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Informations de paiement
                </CardTitle>
                <CardDescription>
                  Vos informations sont protégées par un cryptage de niveau bancaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#8b5cf6",
                          colorBackground: "hsl(var(--background))",
                          colorText: "hsl(var(--foreground))",
                          colorDanger: "hsl(var(--destructive))",
                          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                          borderRadius: "8px",
                          spacingUnit: "4px",
                        },
                        rules: {
                          ".Input": {
                            border: "1px solid hsl(var(--border))",
                            boxShadow: "none",
                            padding: "12px",
                          },
                          ".Input:focus": {
                            border: "1px solid #8b5cf6",
                            boxShadow: "0 0 0 1px #8b5cf6",
                          },
                          ".Label": {
                            fontWeight: "500",
                            fontSize: "14px",
                            marginBottom: "8px",
                          },
                          ".Tab": {
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          },
                          ".Tab--selected": {
                            borderColor: "#8b5cf6",
                            backgroundColor: "hsl(var(--background))",
                          },
                        },
                      },
                    }}
                  >
                    <CheckoutForm
                      planId={planId}
                      clientSecret={clientSecret}
                      onSuccess={handleSuccess}
                    />
                  </Elements>
                )}
              </CardContent>
            </Card>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-muted-foreground mb-4">
                Paiement sécurisé propulsé par
              </p>
              <div className="flex justify-center items-center gap-2 text-muted-foreground">
                <svg viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg" width="60" height="25" className="fill-current">
                  <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a10.6 10.6 0 0 1-4.56.95c-4.01 0-6.83-2.5-6.83-7.28 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.23 0 .67-.04 1.35-.06 1.7zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-5.13L32.37 0v3.77l-4.13.88V.44zm-4.32 9.35v10.22H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.43zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.69-2.94.69-2.04 0-4.07-.78-4.07-4.07V3.79l3.89-.82v3.75h3.12v3.37h-3.12v4.42zm-8.16-3.12c0-1.93-1.6-2.48-3.08-2.76-1.53-.29-2.02-.42-2.02-1.03s.52-.85 1.4-.85c1.23 0 2.64.39 3.84 1.11V5.4a11.34 11.34 0 0 0-3.84-.69c-3.18 0-5.37 1.48-5.37 4.06 0 2.11 1.5 3.26 3.84 3.74 1.48.3 2.04.52 2.04 1.1 0 .58-.58.94-1.56.94-1.28 0-3.05-.58-4.2-1.33v3.73c1.28.63 2.73.94 4.2.94 3.06 0 5.43-1.35 5.43-4.1 0-1.6-.91-2.87-3.68-3.44z"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
