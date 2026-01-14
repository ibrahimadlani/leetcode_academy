"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  CheckCircle,
  Circle,
  PlayCircle,
  Target,
  Filter,
  BookOpen,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { useAllProgress } from "@/hooks/useProgress";
import chaptersData from "@/data/chapters.json";

const chapters = chaptersData.blind75 || [];

const difficultyColors = {
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function LeetCode75Page() {
  const { allProgress, stats, loading } = useAllProgress();
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Create a map of progress by lessonId
  const progressMap = useMemo(() => {
    const map = {};
    allProgress.forEach((p) => {
      map[p.lessonId || p.id] = p;
    });
    return map;
  }, [allProgress]);

  // Filter problems
  const filteredChapters = useMemo(() => {
    return chapters.map((chapter) => ({
      ...chapter,
      problems: chapter.problems.filter((problem) => {
        const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
        const matchesDifficulty = filterDifficulty === "all" || problem.difficulty.toLowerCase() === filterDifficulty;

        const progress = progressMap[problem.id];
        const status = progress?.completed ? "completed" : progress?.currentStep > 0 ? "in_progress" : "not_started";
        const matchesStatus = filterStatus === "all" || status === filterStatus;

        return matchesSearch && matchesDifficulty && matchesStatus;
      }),
    })).filter((chapter) => chapter.problems.length > 0);
  }, [search, filterDifficulty, filterStatus, progressMap]);

  const totalProblems = chapters.reduce((acc, ch) => acc + ch.problems.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader backHref="/practices" />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">LeetCode 75</h1>
              <p className="text-muted-foreground">Les 75 problèmes essentiels</p>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm text-muted-foreground">
                  {stats.completed} / {totalProblems} complétés
                </span>
              </div>
              <Progress value={(stats.completed / totalProblems) * 100} className="h-3" />
              <div className="flex gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>{stats.completed} Complétés</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span>{stats.inProgress} En cours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span>{stats.notStarted} À faire</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un problème..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="easy">Facile</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="hard">Difficile</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="completed">Complétés</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="not_started">À faire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chapters */}
        <div className="space-y-6">
          {filteredChapters.map((chapter, chapterIndex) => (
            <motion.div
              key={chapter.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: chapterIndex * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {chapter.category}
                    </CardTitle>
                    <Badge variant="secondary">
                      {chapter.problems.filter((l) => progressMap[l.id]?.completed).length} / {chapter.problems.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {chapter.problems.map((lesson) => {
                      const progress = progressMap[lesson.id];
                      const isCompleted = progress?.completed;
                      const isInProgress = !isCompleted && progress?.currentStep > 0;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/lesson/${lesson.id}`}
                          className="flex items-center gap-4 py-3 hover:bg-muted/50 -mx-4 px-4 rounded-lg transition-colors"
                        >
                          {/* Status Icon */}
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : isInProgress ? (
                            <PlayCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}

                          {/* Problem Number & Title */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-sm">
                                #{lesson.number}
                              </span>
                              <span className="font-medium truncate">{lesson.title}</span>
                            </div>
                          </div>

                          {/* Difficulty Badge */}
                          <Badge
                            variant="outline"
                            className={difficultyColors[lesson.difficulty.toLowerCase()]}
                          >
                            {lesson.difficulty === "Easy" ? "Facile" : lesson.difficulty === "Medium" ? "Moyen" : "Difficile"}
                          </Badge>

                          {/* Progress indicator */}
                          {isInProgress && (
                            <span className="text-xs text-muted-foreground">
                              Étape {progress.currentStep}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredChapters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun problème trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
