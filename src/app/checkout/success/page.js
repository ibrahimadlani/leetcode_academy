"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  PartyPopper,
  Code2,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import Logo from "@/components/Logo";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const features = [
  {
    icon: Code2,
    title: "75 Problèmes Blind75",
    description: "Accédez à tous les problèmes avec solutions détaillées",
  },
  {
    icon: TrendingUp,
    title: "Visualisations Interactives",
    description: "Comprenez les algorithmes avec des animations",
  },
  {
    icon: Users,
    title: "Communauté Discord",
    description: "Rejoignez des développeurs passionnés",
  },
  {
    icon: BookOpen,
    title: "Ressources Premium",
    description: "Guides et tutoriels exclusifs",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
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

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.2,
    },
  },
};

const pulseVariants = {
  initial: { scale: 1, opacity: 0.5 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 0.2, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowConfetti(true);
    }, 2000);

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.1}
            colors={["#8b5cf6", "#6366f1", "#3b82f6", "#22c55e", "#eab308"]}
          />
        )}
      </AnimatePresence>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl w-full"
        >
          <Card className="border-0 shadow-2xl bg-background/80 backdrop-blur-sm overflow-hidden">
            {/* Gradient top bar */}
            <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />

            <CardHeader className="text-center pt-12 pb-6">
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <Logo size="small" />
              </motion.div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative">
                      <motion.div
                        variants={pulseVariants}
                        initial="initial"
                        animate="animate"
                        className="absolute inset-0 rounded-full bg-primary"
                      />
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center relative">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl mt-6">Traitement en cours...</CardTitle>
                    <CardDescription className="mt-2">
                      Veuillez patienter pendant que nous confirmons votre paiement
                    </CardDescription>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      variants={checkmarkVariants}
                      className="relative"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="absolute inset-0 rounded-full bg-green-500/20 blur-xl"
                      />
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 relative">
                        <CheckCircle className="h-12 w-12 text-white" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <CardTitle className="text-3xl mt-6 flex items-center gap-2 justify-center">
                        <PartyPopper className="h-8 w-8 text-yellow-500" />
                        Paiement Réussi !
                      </CardTitle>
                      <CardDescription className="mt-3 text-base">
                        Bienvenue dans la communauté Premium ! Votre accès est maintenant actif.
                      </CardDescription>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>

            <AnimatePresence>
              {!loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <CardContent className="space-y-8 pb-12">
                    {/* Features grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-3">
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      <Button
                        asChild
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-violet-500 to-purple-500 hover:opacity-90 shadow-lg shadow-violet-500/25"
                      >
                        <Link href="/">
                          <Sparkles className="mr-2 h-5 w-5" />
                          Commencer à Apprendre
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        asChild
                        size="lg"
                        className="w-full"
                      >
                        <Link href="/billing">
                          Voir ma facturation
                        </Link>
                      </Button>
                    </div>

                    {/* Thank you message */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Merci de faire confiance à LeetCode Academy !
                      <br />
                      Un email de confirmation a été envoyé à votre adresse.
                    </motion.p>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
