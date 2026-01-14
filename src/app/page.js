"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  BookMarked,
  Code2,
  Sparkles,
  Play,
  CheckCircle,
  Zap,
  Target,
  Users,
  Trophy,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

const features = [
  {
    icon: Code2,
    title: "Visualisations Interactives",
    description: "Comprenez les algorithmes grâce à des animations pas à pas.",
  },
  {
    icon: Brain,
    title: "Apprentissage Progressif",
    description: "Du débutant à l'expert, progressez à votre rythme.",
  },
  {
    icon: Target,
    title: "Problèmes Ciblés",
    description: "Les exercices les plus demandés en entretien technique.",
  },
];

const stats = [
  { value: "75+", label: "Problèmes" },
  { value: "20h", label: "De contenu" },
  { value: "4.9", label: "Note moyenne" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/" />

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="mb-6">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Nouvelle plateforme d'apprentissage
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              >
                Maîtrisez les
                <span className="text-primary"> Algorithmes</span>
                <br />
                Visuellement
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              >
                Apprenez les structures de données et algorithmes avec des
                visualisations interactives. Préparez vos entretiens techniques
                efficacement.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg">
                  <Link href="/practices">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/courses">
                    <Play className="mr-2 h-4 w-4" />
                    Voir les cours
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-y bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Pourquoi LeetCode Academy ?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Une approche moderne pour maîtriser les concepts fondamentaux.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="pt-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tracks Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Choisissez votre parcours</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Des programmes structurés pour tous les niveaux.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Practice Track */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Brain className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Practice</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Entraînez-vous sur les problèmes les plus fréquents en entretien.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">LeetCode 75</Badge>
                          <Badge variant="secondary">LeetCode 150</Badge>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/practices">
                            Explorer
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Courses Track */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                        <BookMarked className="h-6 w-6 text-violet-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">Courses</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Apprenez les fondamentaux avec des cours structurés.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary">DSA Débutant</Badge>
                          <Badge variant="secondary">DSA Avancé</Badge>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/courses">
                            Explorer
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="py-12 text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Prêt à commencer ?
                  </h2>
                  <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
                    Rejoignez des milliers de développeurs qui préparent leurs
                    entretiens techniques avec nous.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" variant="secondary">
                      <Link href="/practices">
                        Commencer gratuitement
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      <Link href="/pricing">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Voir les offres
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2024 LeetCode Academy. Tous droits réservés.
              </p>
              <div className="flex gap-6">
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Conditions
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Confidentialité
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
