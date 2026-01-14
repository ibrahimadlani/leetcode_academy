"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  ArrowLeft,
  Sparkles,
  Zap,
  Shield,
  Clock,
  Users,
  Code2,
  TrendingUp,
  Infinity,
} from "lucide-react";
import Logo from "@/components/Logo";

const plans = [
  {
    id: "yearly",
    name: "Premium Yearly",
    price: 49,
    period: "/year",
    description: "Perfect for dedicated learners",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    features: [
      { text: "Access to all 75 Blind75 problems", icon: Code2 },
      { text: "Interactive visualizations", icon: TrendingUp },
      { text: "Code solutions in 3 languages", icon: Code2 },
      { text: "Progress tracking", icon: TrendingUp },
      { text: "Priority support", icon: Shield },
    ],
  },
  {
    id: "lifetime",
    name: "Premium Lifetime",
    price: 99,
    period: "",
    description: "Best value - pay once, learn forever",
    icon: Infinity,
    gradient: "from-violet-500 to-purple-500",
    features: [
      { text: "Everything in Yearly", icon: Check },
      { text: "Lifetime access", icon: Infinity },
      { text: "All future updates", icon: Sparkles },
      { text: "Early access to new features", icon: Clock },
      { text: "Exclusive Discord community", icon: Users },
    ],
    popular: true,
  },
];

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

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const handleCheckout = (planId) => {
    if (!session) {
      router.push("/login");
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-violet-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Logo size="small" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Investissez dans votre carrière
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Débloquez Votre Plein Potentiel
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Maîtrisez les algorithmes avec un accès premium à toutes les visualisations,
            explications et solutions de code.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                variants={cardVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredPlan(plan.id)}
                onHoverEnd={() => setHoveredPlan(null)}
                className="relative"
              >
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <Badge className={`bg-gradient-to-r ${plan.gradient} text-white border-0 px-4 py-1 shadow-lg`}>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Le Plus Populaire
                    </Badge>
                  </motion.div>
                )}

                <Card
                  className={`relative h-full overflow-hidden transition-all duration-300 ${
                    plan.popular
                      ? "border-2 border-primary/50 shadow-xl shadow-primary/10"
                      : "border hover:border-primary/30"
                  }`}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 transition-opacity duration-300`}
                    animate={{ opacity: hoveredPlan === plan.id ? 0.03 : 0 }}
                  />

                  <CardHeader className="text-center pb-4 relative">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} p-0.5`}
                      whileHover={{ rotate: 5, scale: 1.05 }}
                    >
                      <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        <Icon className={`h-8 w-8 bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`} style={{ color: plan.popular ? '#8b5cf6' : '#3b82f6' }} />
                      </div>
                    </motion.div>

                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="text-center relative">
                    <div className="mb-8">
                      <motion.div
                        className="inline-flex items-baseline"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-5xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground ml-1 text-lg">{plan.period}</span>
                      </motion.div>
                      {plan.id === "lifetime" && (
                        <p className="text-sm text-muted-foreground mt-2">Paiement unique</p>
                      )}
                    </div>

                    <ul className="space-y-4 text-left">
                      {plan.features.map((feature, featureIndex) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <motion.li
                            key={featureIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * featureIndex + 0.3 }}
                            className="flex items-center gap-3"
                          >
                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${plan.gradient} p-0.5`}>
                              <div className="w-full h-full rounded-lg bg-background flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                            <span className="text-sm font-medium">{feature.text}</span>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button
                      className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
                        plan.popular
                          ? `bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white shadow-lg shadow-violet-500/25`
                          : ""
                      }`}
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleCheckout(plan.id)}
                    >
                      Commencer Maintenant
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center"
        >
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">Paiement sécurisé SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Accès instantané</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">Garantie satisfait ou remboursé 30 jours</span>
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-8 text-sm text-muted-foreground">
            Des questions ?{" "}
            <a
              href="mailto:support@leetcode-academy.com"
              className="text-primary hover:underline font-medium"
            >
              Contactez-nous
            </a>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
