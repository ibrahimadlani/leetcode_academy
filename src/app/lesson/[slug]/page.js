"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Code,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Circle,
  Lightbulb,
  ArrowLeft,
  Moon,
  Sun,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";
import AuthGate from "@/components/AuthGate";
import VisualizationCanvas from "@/components/canvas/VisualizationCanvas";
import ArrayViz from "@/components/visualizations/ArrayViz";
import LinkedListViz from "@/components/visualizations/LinkedListViz";
import HashMapViz from "@/components/visualizations/HashMapViz";
import HashSetViz from "@/components/visualizations/HashSetViz";
import CodeBlock from "@/components/CodeBlock";
import { useAnimation } from "@/hooks/useAnimation";
import { useProgress } from "@/hooks/useProgress";
import chapters from "@/data/chapters.json";

const lessonModules = {
  "two-sum": () => import("@/data/lessons/two-sum.json"),
  "contains-duplicate": () => import("@/data/lessons/contains-duplicate.json"),
  "valid-anagram": () => import("@/data/lessons/valid-anagram.json"),
  "reverse-linked-list": () => import("@/data/lessons/reverse-linked-list.json"),
  "maximum-subarray": () => import("@/data/lessons/maximum-subarray.json"),
};

const languages = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const difficultyColors = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

// Flatten all problems for navigation
const allProblems = chapters.blind75?.flatMap((cat) =>
  cat.problems.map((p) => ({ ...p, category: cat.category }))
) || [];

function LessonContent() {
  const params = useParams();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("python");
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Progress tracking
  const { progress, saveProgress, markComplete } = useProgress(params.slug);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load lesson data
  useEffect(() => {
    async function loadLesson() {
      setLoading(true);
      const loader = lessonModules[params.slug];
      if (loader) {
        try {
          const data = await loader();
          setLesson(data.default || data);
        } catch (e) {
          console.error("Failed to load lesson:", e);
          setLesson(null);
        }
      } else {
        setLesson(null);
      }
      setLoading(false);
    }
    loadLesson();
  }, [params.slug]);

  const totalSteps = lesson?.steps?.length || 0;
  const { currentStep, nextStep, previousStep, reset, goToStep } = useAnimation(totalSteps);

  // Reset on lesson change
  useEffect(() => {
    reset();
  }, [params.slug, reset]);

  // Save progress when step changes
  useEffect(() => {
    if (lesson && currentStep > 0) {
      saveProgress(currentStep, false);
    }
  }, [currentStep, lesson, saveProgress]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      if (currentStep < totalSteps - 1) {
        nextStep();
      } else {
        setIsAutoPlaying(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStep, totalSteps, nextStep]);

  const currentStepData = lesson?.steps?.[currentStep];

  // Find current problem info
  const currentProblem = allProblems.find((p) => p.id === params.slug);
  const currentIndex = allProblems.findIndex((p) => p.id === params.slug);
  const prevProblem = currentIndex > 0 ? allProblems[currentIndex - 1] : null;
  const nextProblem = currentIndex < allProblems.length - 1 ? allProblems[currentIndex + 1] : null;

  const handleComplete = async () => {
    await markComplete();
    if (nextProblem) {
      router.push(`/lesson/${nextProblem.id}`);
    }
  };

  const renderVisualization = () => {
    if (!currentStepData?.visualState) {
      return (
        <div className="text-center text-muted-foreground">
          <p>Pas de visualisation pour cette étape</p>
        </div>
      );
    }

    const { visualState } = currentStepData;
    const components = [];

    if (visualState.array) {
      components.push(
        <ArrayViz
          key="array"
          data={visualState.array}
          label={visualState.arrayLabel || "Array"}
        />
      );
    }

    if (visualState.hashmap) {
      components.push(
        <HashMapViz
          key="hashmap"
          data={visualState.hashmap}
          label={visualState.hashmapLabel || "HashMap"}
        />
      );
    }

    if (visualState.linkedList) {
      components.push(
        <LinkedListViz
          key="linkedlist"
          data={visualState.linkedList}
          label={visualState.linkedListLabel || "Linked List"}
        />
      );
    }

    if (visualState.hashset) {
      components.push(
        <HashSetViz
          key="hashset"
          data={visualState.hashset}
          label={visualState.hashsetLabel || "HashSet"}
        />
      );
    }

    return (
      <div className="flex flex-col gap-8 items-center">
        {components}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === totalSteps - 1;
  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center px-4 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
          >
            <Link href="/practices/leetcode75">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Logo size="small" />
        </div>

        {/* Problem info - center */}
        {currentProblem && (
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              #{currentProblem.number}
            </span>
            <span className="font-medium">{lesson?.title || currentProblem.title}</span>
            <Badge variant="outline" className={difficultyColors[currentProblem.difficulty]}>
              {currentProblem.difficulty}
            </Badge>
          </div>
        )}

        {/* Right section */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <UserMenu />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="fixed left-0 top-14 bottom-0 w-72 bg-background border-r z-50 md:hidden"
              >
                <div className="p-4 flex items-center justify-between border-b">
                  <h2 className="font-semibold">Problèmes</h2>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100%-57px)]">
                  <div className="p-2">
                    {chapters.blind75?.map((category) => (
                      <div key={category.category} className="mb-4">
                        <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-2">
                          {category.category}
                        </h3>
                        {category.problems.map((problem) => (
                          <Link
                            key={problem.id}
                            href={`/lesson/${problem.id}`}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm hover:bg-accent transition-colors ${
                              params.slug === problem.id ? "bg-accent" : ""
                            }`}
                          >
                            {progress?.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="truncate">{problem.title}</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Visualization Canvas */}
          <div className="flex-1 relative">
            <VisualizationCanvas>
              {!lesson ? (
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-bold mb-2">Leçon non disponible</h2>
                  <p className="text-muted-foreground mb-4">
                    Cette leçon n'est pas encore disponible.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/practices/leetcode75">
                      Retour aux problèmes
                    </Link>
                  </Button>
                </div>
              ) : (
                renderVisualization()
              )}
            </VisualizationCanvas>

            {/* Step progress bar - bottom of canvas */}
            {lesson && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                <div className="flex-1 bg-background/80 backdrop-blur rounded-lg border p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Étape {currentStep + 1} / {totalSteps}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={reset}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      >
                        {isAutoPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar - Explanation panel */}
          {lesson && (
            <aside className="w-full md:w-96 border-t md:border-t-0 md:border-l flex flex-col bg-background">
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* Step explanation */}
                  {currentStepData && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {currentStep + 1}
                          </div>
                          Étape {currentStep + 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm leading-relaxed">
                          {currentStepData.explanation}
                        </p>

                        {currentStepData.code && (
                          <div className="mt-4">
                            <CodeBlock code={currentStepData.code} language={language} />
                          </div>
                        )}

                        {currentStepData.tip && (
                          <div className="mt-4 p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                            <div className="flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-amber-700 dark:text-amber-400">
                                {currentStepData.tip}
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Complete solution on last step */}
                  {isLastStep && lesson.solutions?.[language] && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Solution complète
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CodeBlock code={lesson.solutions[language]} language={language} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>

              <Separator />

              {/* Navigation controls */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={previousStep}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={nextStep}
                    disabled={isLastStep}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {isLastStep && (
                  <Button
                    className="w-full"
                    onClick={handleComplete}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {nextProblem ? "Marquer comme terminé et continuer" : "Terminer"}
                  </Button>
                )}

                {/* Problem navigation */}
                <div className="flex items-center justify-between text-sm">
                  {prevProblem ? (
                    <Link
                      href={`/lesson/${prevProblem.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← {prevProblem.title}
                    </Link>
                  ) : (
                    <span />
                  )}
                  {nextProblem && (
                    <Link
                      href={`/lesson/${nextProblem.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {nextProblem.title} →
                    </Link>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LessonPage() {
  return (
    <AuthGate>
      <LessonContent />
    </AuthGate>
  );
}
