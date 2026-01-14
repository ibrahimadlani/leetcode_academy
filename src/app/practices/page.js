"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Brain,
  Target,
  Trophy,
  Flame,
  Clock,
  CheckCircle,
  Lock,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useAllProgress } from "@/hooks/useProgress";
import { useSubscription } from "@/hooks/useSubscription";

const practices = [
  {
    id: "leetcode75",
    title: "LeetCode 75",
    description: "Les 75 problèmes essentiels pour maîtriser les entretiens techniques. Parfait pour commencer.",
    href: "/practices/leetcode75",
    icon: Target,
    gradient: "from-blue-500 to-cyan-500",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    totalProblems: 75,
    difficulty: "Intermédiaire",
    estimatedTime: "4-6 semaines",
    features: [
      "Problèmes les plus fréquents",
      "Couvre toutes les catégories",
      "Difficulté progressive",
    ],
    free: true,
  },
  {
    id: "leetcode150",
    title: "LeetCode 150",
    description: "150 problèmes pour une préparation complète. Idéal pour les entreprises FAANG.",
    href: "/practices/leetcode150",
    icon: Trophy,
    gradient: "from-violet-500 to-purple-500",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    totalProblems: 150,
    difficulty: "Avancé",
    estimatedTime: "8-12 semaines",
    features: [
      "Couverture exhaustive",
      "Problèmes avancés",
      "Préparation FAANG",
    ],
    free: false,
  },
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

export default function PracticesPage() {
  const { stats, loading } = useAllProgress();
  const { isPremium } = useSubscription();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/" />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              Entraînement
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Practice Makes Perfect
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choisissez votre parcours et maîtrisez les algorithmes avec des problèmes soigneusement sélectionnés.
            </p>
          </motion.div>

          {/* Stats Bar */}
          {!loading && stats.total > 0 && (
            <motion.div variants={itemVariants} className="mb-12">
              <Card className="bg-gradient-to-r from-primary/5 to-violet-500/5 border-primary/20">
                <CardContent className="py-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary">{stats.completed}</div>
                      <div className="text-sm text-muted-foreground">Complétés</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-500">{stats.inProgress}</div>
                      <div className="text-sm text-muted-foreground">En cours</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{stats.notStarted}</div>
                      <div className="text-sm text-muted-foreground">À faire</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500">
                        {Math.round((stats.completed / 75) * 100)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Progression</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Practice Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {practices.map((practice, index) => {
              const Icon = practice.icon;
              const isLocked = !practice.free && !isPremium;

              return (
                <motion.div
                  key={practice.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  {isLocked && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}

                  <Card className={`h-full overflow-hidden transition-all duration-300 ${
                    isLocked ? "opacity-75" : "hover:shadow-lg hover:border-primary/30"
                  }`}>
                    <div className={`h-2 bg-gradient-to-r ${practice.gradient}`} />

                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${practice.bgColor}`}>
                          <Icon className={`h-8 w-8 ${practice.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl">{practice.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {practice.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="font-bold text-lg">{practice.totalProblems}</div>
                          <div className="text-xs text-muted-foreground">Problèmes</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="font-bold text-lg">{practice.difficulty}</div>
                          <div className="text-xs text-muted-foreground">Niveau</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="font-bold text-lg flex items-center justify-center gap-1">
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="text-xs text-muted-foreground">{practice.estimatedTime}</div>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {practice.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`h-4 w-4 ${practice.color}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Progress (if any) */}
                      {practice.id === "leetcode75" && stats.completed > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{stats.completed}/{practice.totalProblems}</span>
                          </div>
                          <Progress value={(stats.completed / practice.totalProblems) * 100} className="h-2" />
                        </div>
                      )}

                      {/* CTA */}
                      {isLocked ? (
                        <Button asChild className="w-full" variant="secondary">
                          <Link href="/pricing">
                            <Lock className="mr-2 h-4 w-4" />
                            Débloquer avec Premium
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild className={`w-full bg-gradient-to-r ${practice.gradient} text-white`}>
                          <Link href={practice.href}>
                            Commencer
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Motivation */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <Flame className="h-5 w-5 text-orange-500" />
              <span>La pratique régulière est la clé du succès</span>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
