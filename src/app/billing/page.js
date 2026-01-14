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
import {
  ArrowLeft,
  CreditCard,
  Crown,
  Loader2,
  ExternalLink,
  Shield,
  Sparkles,
  Calendar,
  Mail,
  User,
  CheckCircle,
  Zap,
  Infinity,
  Clock,
  AlertCircle,
  Settings,
  Receipt,
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
    gradient: "from-blue-500 to-cyan-500",
    color: "#3b82f6",
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
    gradient: "from-violet-500 to-purple-500",
    color: "#8b5cf6",
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
  const PlanIcon = plan?.icon || Crown;

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
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-500/5 to-transparent rounded-full blur-3xl" />
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

          {/* Current Plan Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              {isActive && (
                <div className={`h-1 bg-gradient-to-r ${plan?.gradient || "from-primary to-primary"}`} />
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${isActive ? `bg-gradient-to-br ${plan?.gradient}` : "bg-muted"} p-0.5`}>
                      <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
                        <PlanIcon className="h-5 w-5" style={{ color: plan?.color || "currentColor" }} />
                      </div>
                    </div>
                    Plan actuel
                  </CardTitle>
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={isActive ? `bg-gradient-to-r ${plan?.gradient} text-white border-0` : ""}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Actif
                      </>
                    ) : (
                      "Gratuit"
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {isActive ? (
                    <motion.div
                      key="active"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold">{plan?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subscription?.type === "lifetime"
                              ? "Accès à vie - N&apos;expire jamais"
                              : "Renouvellement annuel automatique"}
                          </p>
                        </div>
                        {subscription?.type !== "lifetime" && subscription?.currentPeriodEnd && (
                          <div className="flex items-center gap-2 text-sm bg-muted/50 px-4 py-2 rounded-lg">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Prochain renouvellement : {formatDate(subscription.currentPeriodEnd)}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

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
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
                      <div className="text-center py-4">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Accès limité</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Passez à Premium pour débloquer toutes les visualisations,
                          solutions et fonctionnalités avancées.
                        </p>
                      </div>

                      <Separator />

                      {/* Plan selection */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Yearly Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="relative p-4 rounded-xl border-2 border-border hover:border-blue-500/50 transition-colors cursor-pointer group"
                          onClick={() => router.push("/checkout?plan=yearly")}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 flex-shrink-0">
                              <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                                <Zap className="h-5 w-5 text-blue-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Premium Yearly</h4>
                              <p className="text-2xl font-bold mt-1">$49<span className="text-sm font-normal text-muted-foreground">/an</span></p>
                              <p className="text-xs text-muted-foreground mt-1">Renouvelé annuellement</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full mt-4 group-hover:border-blue-500 group-hover:text-blue-500"
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
                          className="relative p-4 rounded-xl border-2 border-violet-500/50 bg-violet-500/5 cursor-pointer group"
                          onClick={() => router.push("/checkout?plan=lifetime")}
                        >
                          <Badge className="absolute -top-2.5 left-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Recommandé
                          </Badge>
                          <div className="flex items-start gap-3 mt-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 p-0.5 flex-shrink-0">
                              <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                                <Infinity className="h-5 w-5 text-violet-500" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">Premium Lifetime</h4>
                              <p className="text-2xl font-bold mt-1">$99<span className="text-sm font-normal text-muted-foreground"> une fois</span></p>
                              <p className="text-xs text-muted-foreground mt-1">Paiement unique, accès à vie</p>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push("/checkout?plan=lifetime");
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Choisir ce plan
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Info Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">{session?.user?.name || "Non défini"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{session?.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {isActive && subscription?.updatedAt && (
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Membre depuis</p>
                          <p className="font-medium">{formatDate(subscription.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
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
