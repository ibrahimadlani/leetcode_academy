"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Lock, Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useSubscription } from "@/hooks/useSubscription";

export default function LeetCode150Page() {
  const { isPremium } = useSubscription();

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader backHref="/practices" />

        <main className="max-w-2xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 p-0.5">
              <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                <Lock className="h-10 w-10 text-violet-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">LeetCode 150</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Ce parcours de 150 problèmes est réservé aux membres Premium.
              Débloquez l'accès pour une préparation complète aux entretiens FAANG.
            </p>

            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-violet-500">150</div>
                    <div className="text-sm text-muted-foreground">Problèmes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-violet-500">8-12</div>
                    <div className="text-sm text-muted-foreground">Semaines</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-violet-500">FAANG</div>
                    <div className="text-sm text-muted-foreground">Niveau</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button asChild size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              <Link href="/pricing">
                <Sparkles className="mr-2 h-5 w-5" />
                Débloquer avec Premium
              </Link>
            </Button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/practices" />

      <main className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-4">LeetCode 150</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Bientôt disponible
          </p>

          <Card className="max-w-md mx-auto">
            <CardContent className="py-8">
              <p className="text-muted-foreground">
                Nous travaillons activement sur ce parcours.
                Vous serez notifié dès qu'il sera disponible.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
