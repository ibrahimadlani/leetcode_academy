"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ExternalLink,
  Shield,
  Calendar,
  CheckCircle,
  Zap,
  Infinity,
  Settings,
} from "lucide-react";
import Logo from "@/components/Logo";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const planDetails = {
  yearly: {
    name: "Premium Yearly",
    icon: Zap,
    features: [
      "Accès aux 75 problèmes Blind75",
      "Visualisations interactives",
      "Solutions en 3 langages",
      "Suivi de progression",
      "Support prioritaire",
    ],
  },
  lifetime: {
    name: "Premium Lifetime",
    icon: Infinity,
    features: [
      "Accès à vie",
      "Toutes les futures mises à jour",
      "Accès anticipé aux nouvelles fonctionnalités",
      "Communauté Discord exclusive",
      "Support VIP",
    ],
  },
};

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      fetchSubscription();
    }
  }, [session, status, router]);

  const fetchSubscription = async () => {
    try {
      const userId = session.user.id || session.user.email;
      const subscriptionDoc = await getDoc(doc(db, "subscriptions", userId));

      if (subscriptionDoc.exists()) {
        setSubscription(subscriptionDoc.data());
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const isActive = subscription?.status === "active";
  const plan = isActive ? planDetails[subscription?.type] || planDetails.yearly : null;

  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
          <p className="text-muted-foreground">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-pink-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-600/5 to-transparent rounded-full blur-3xl" />
      </div>

      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="small" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Facturation</h1>
            <p className="text-muted-foreground">
              Gérez votre abonnement et vos informations de paiement
            </p>
          </motion.div>

          {/* Profile & Plan Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              {/* Header */}
              <div className={`h-24 ${isActive ? "bg-pink-600" : "bg-muted"}`} />

              {/* Profile Content */}
              <div className="relative px-6 pb-6">
                {/* Avatar - overlapping header */}
                <div className="flex justify-center -mt-12 mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-background shadow-2xl">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800 text-foreground">
                      {session?.user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="text-center space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold">{session?.user?.name || "Utilisateur"}</h2>
                    <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                  </div>

                  {/* Plan Badge */}
                  <div className="flex flex-col items-center gap-2">
                    <Badge
                      variant={isActive ? "default" : "secondary"}
                      className={`px-4 py-1 text-sm ${isActive ? "bg-pink-600 text-white border-0 hover:bg-pink-700" : ""}`}
                    >
                      {isActive ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          {plan?.name}
                        </>
                      ) : (
                        "Plan Gratuit"
                      )}
                    </Badge>
                    {isActive && subscription?.type !== "lifetime" && subscription?.currentPeriodEnd && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                        <Calendar className="h-3 w-3" />
                        Renouvellement le {formatDate(subscription.currentPeriodEnd)}
                      </span>
                    )}
                    {isActive && subscription?.type === "lifetime" && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                        <Infinity className="h-3 w-3" />
                        Accès à vie
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="mx-6" />
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Features list */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {plan?.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-pink-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {subscription?.type !== "lifetime" && (
                        <>
                          <Separator />
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={handleManageBilling}
                            disabled={portalLoading}
                          >
                            {portalLoading ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Settings className="mr-2 h-4 w-4" />
                            )}
                            Gérer l'abonnement
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="free"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="text-center">
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Passez à Premium pour débloquer toutes les visualisations,
                          solutions et fonctionnalités avancées.
                        </p>
                      </div>

                      {/* Plan selection */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Yearly Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="relative p-4 rounded-xl border border-border hover:border-pink-600/50 transition-colors cursor-pointer group"
                          onClick={() => router.push("/checkout?plan=yearly")}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <Zap className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Premium Yearly</h4>
                              <p className="text-2xl font-bold mt-1">$49<span className="text-sm font-normal text-muted-foreground">/an</span></p>
                              <p className="text-xs text-muted-foreground mt-1">Renouvelé annuellement</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-4 group-hover:border-pink-600 group-hover:text-pink-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/checkout?plan=yearly");
                            }}
                          >
                            Choisir ce plan
                          </Button>
                        </motion.div>

                        {/* Lifetime Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="relative p-4 rounded-xl border border-pink-600/50 bg-pink-600/5 cursor-pointer group"
                          onClick={() => router.push("/checkout?plan=lifetime")}
                        >
                          <Badge className="absolute -top-2.5 left-4 bg-pink-600 text-white border-0">
                            Recommandé
                          </Badge>
                          <div className="flex items-start gap-3 mt-2">
                            <div className="w-10 h-10 rounded-lg bg-pink-600/10 flex items-center justify-center flex-shrink-0">
                              <Infinity className="h-5 w-5 text-pink-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Premium Lifetime</h4>
                              <p className="text-2xl font-bold mt-1">$99<span className="text-sm font-normal text-muted-foreground"> une fois</span></p>
                              <p className="text-xs text-muted-foreground mt-1">Paiement unique, accès à vie</p>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4 bg-pink-600 text-white hover:bg-pink-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/checkout?plan=lifetime");
                            }}
                          >
                            Choisir ce plan
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Payment Method Card (for active subscriptions) */}
          {isActive && subscription?.type !== "lifetime" && (
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Méthode de paiement
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations de paiement via le portail Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    onClick={handleManageBilling}
                    disabled={portalLoading}
                    className="w-full sm:w-auto"
                  >
                    {portalLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Modifier la méthode de paiement
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Help Section */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground mb-4">
              <Shield className="h-4 w-4" />
              <span>Vos paiements sont sécurisés par Stripe</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Besoin d&apos;aide ?{" "}
              <a
                href="mailto:support@leetcode-academy.com"
                className="text-primary hover:underline font-medium"
              >
                Contactez notre support
              </a>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
