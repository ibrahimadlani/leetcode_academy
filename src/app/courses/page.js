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
import {
  ArrowRight,
  BookMarked,
  GraduationCap,
  Layers,
  PlayCircle,
  Clock,
  Users,
  Star,
  CheckCircle,
  Lock,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useSubscription } from "@/hooks/useSubscription";

const courses = [
  {
    id: "dsa-beginner",
    title: "DSA Débutant",
    subtitle: "Data Structures & Algorithms",
    description: "Maîtrisez les fondamentaux des structures de données et algorithmes. Parfait pour les débutants en programmation.",
    href: "/courses/dsa-beginner",
    icon: GraduationCap,
    gradient: "from-green-500 to-emerald-500",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    level: "Débutant",
    duration: "20 heures",
    lessons: 45,
    rating: 4.8,
    students: "2.5k",
    topics: [
      "Arrays & Strings",
      "Linked Lists",
      "Stacks & Queues",
      "Hash Tables",
      "Recursion Basics",
      "Sorting Algorithms",
    ],
    free: true,
  },
  {
    id: "dsa-advanced",
    title: "DSA Avancé",
    subtitle: "Advanced Algorithms",
    description: "Algorithmes avancés et techniques d'optimisation pour réussir les entretiens des grandes entreprises tech.",
    href: "/courses/dsa-advanced",
    icon: Layers,
    gradient: "from-violet-500 to-purple-500",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    level: "Avancé",
    duration: "35 heures",
    lessons: 72,
    rating: 4.9,
    students: "1.8k",
    topics: [
      "Binary Trees & BST",
      "Graphs & BFS/DFS",
      "Dynamic Programming",
      "Greedy Algorithms",
      "Backtracking",
      "System Design Basics",
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

export default function CoursesPage() {
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 text-violet-500 text-sm font-medium mb-6">
              <BookMarked className="h-4 w-4" />
              Formations
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Apprenez à Votre Rythme
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des cours structurés pour maîtriser les structures de données et algorithmes, du débutant à l'expert.
            </p>
          </motion.div>

          {/* Course Cards */}
          <div className="grid lg:grid-cols-2 gap-8">
            {courses.map((course) => {
              const Icon = course.icon;
              const isLocked = !course.free && !isPremium;

              return (
                <motion.div
                  key={course.id}
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
                    isLocked ? "opacity-75" : "hover:shadow-xl hover:border-primary/30"
                  }`}>
                    {/* Header gradient */}
                    <div className={`h-32 bg-gradient-to-br ${course.gradient} p-6 relative overflow-hidden`}>
                      <div className="absolute -right-8 -bottom-8 opacity-20">
                        <Icon className="h-40 w-40 text-white" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {course.level}
                      </Badge>
                      <h2 className="text-2xl font-bold text-white mt-2">{course.title}</h2>
                      <p className="text-white/80 text-sm">{course.subtitle}</p>
                    </div>

                    <CardContent className="p-6 space-y-6">
                      <p className="text-muted-foreground">{course.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-muted/50">
                          <PlayCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <div className="font-semibold text-sm">{course.lessons}</div>
                          <div className="text-xs text-muted-foreground">Leçons</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <div className="font-semibold text-sm">{course.duration}</div>
                          <div className="text-xs text-muted-foreground">Durée</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <div className="font-semibold text-sm">{course.students}</div>
                          <div className="text-xs text-muted-foreground">Étudiants</div>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50">
                          <Star className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                          <div className="font-semibold text-sm">{course.rating}</div>
                          <div className="text-xs text-muted-foreground">Note</div>
                        </div>
                      </div>

                      {/* Topics */}
                      <div>
                        <h4 className="font-semibold mb-3">Ce que vous apprendrez</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {course.topics.map((topic, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className={`h-4 w-4 ${course.color} flex-shrink-0`} />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      {isLocked ? (
                        <Button asChild className="w-full" variant="secondary">
                          <Link href="/pricing">
                            <Lock className="mr-2 h-4 w-4" />
                            Débloquer avec Premium
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild className={`w-full bg-gradient-to-r ${course.gradient} text-white hover:opacity-90`}>
                          <Link href={course.href}>
                            Commencer le cours
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

          {/* Bottom CTA */}
          <motion.div variants={itemVariants} className="mt-16">
            <Card className="bg-gradient-to-r from-primary/5 to-violet-500/5 border-primary/20">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Prêt à commencer ?</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Rejoignez des milliers d'étudiants qui ont transformé leur carrière grâce à nos formations.
                </p>
                <div className="flex justify-center gap-4">
                  <Button asChild variant="outline">
                    <Link href="/courses/dsa-beginner">
                      Cours gratuit
                    </Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                    <Link href="/pricing">
                      Accès Premium
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
