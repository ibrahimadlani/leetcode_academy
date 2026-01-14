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
  GraduationCap,
  PlayCircle,
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

const modules = [
  {
    id: 1,
    title: "Introduction aux Structures de Données",
    description: "Comprendre les fondamentaux et l'importance des structures de données",
    lessons: 4,
    duration: "45 min",
    completed: false,
    topics: ["Big O Notation", "Complexité temporelle", "Complexité spatiale", "Trade-offs"],
  },
  {
    id: 2,
    title: "Arrays et Strings",
    description: "Maîtriser les opérations sur les tableaux et chaînes de caractères",
    lessons: 8,
    duration: "2h 30min",
    completed: false,
    topics: ["Déclaration", "Parcours", "Recherche", "Two Pointers", "Sliding Window"],
  },
  {
    id: 3,
    title: "Linked Lists",
    description: "Comprendre et implémenter les listes chaînées",
    lessons: 6,
    duration: "1h 45min",
    completed: false,
    topics: ["Singly Linked", "Doubly Linked", "Insertion", "Suppression", "Reversal"],
  },
  {
    id: 4,
    title: "Stacks et Queues",
    description: "Les structures LIFO et FIFO essentielles",
    lessons: 5,
    duration: "1h 30min",
    completed: false,
    topics: ["Stack operations", "Queue operations", "Applications", "Implémentations"],
  },
  {
    id: 5,
    title: "Hash Tables",
    description: "Comprendre le hashing et ses applications",
    lessons: 6,
    duration: "2h",
    completed: false,
    topics: ["Hash functions", "Collision handling", "HashMap", "HashSet"],
  },
  {
    id: 6,
    title: "Récursion",
    description: "Maîtriser la pensée récursive",
    lessons: 7,
    duration: "2h 15min",
    completed: false,
    topics: ["Base cases", "Recursive calls", "Call stack", "Tail recursion"],
  },
  {
    id: 7,
    title: "Algorithmes de Tri",
    description: "Les algorithmes de tri essentiels",
    lessons: 9,
    duration: "3h",
    completed: false,
    topics: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort"],
  },
];

const totalLessons = modules.reduce((acc, m) => acc + m.lessons, 0);

export default function DSABeginnerPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/courses" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <Badge className="mb-2 bg-green-500/10 text-green-500 border-green-500/20">
                Débutant
              </Badge>
              <h1 className="text-3xl font-bold mb-2">DSA Débutant</h1>
              <p className="text-muted-foreground">
                Maîtrisez les fondamentaux des structures de données et algorithmes
              </p>
            </div>
          </div>

          {/* Course Stats */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="grid grid-cols-4 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-green-500">{modules.length}</div>
                  <div className="text-sm text-muted-foreground">Modules</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalLessons}</div>
                  <div className="text-sm text-muted-foreground">Leçons</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">20h</div>
                  <div className="text-sm text-muted-foreground">Durée totale</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">0%</div>
                  <div className="text-sm text-muted-foreground">Complété</div>
                </div>
              </div>
              <Progress value={0} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Programme du cours
          </h2>

          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:border-green-500/30 transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <CardDescription>{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <PlayCircle className="h-4 w-4" />
                      {module.lessons} leçons
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {module.duration}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <PlayCircle className="mr-2 h-5 w-5" />
            Commencer le cours
          </Button>
        </div>
      </main>
    </div>
  );
}
