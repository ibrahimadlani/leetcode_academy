"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Code } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";

export default function RightSidebar({
  lesson,
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  language = "python",
}) {
  if (!lesson) {
    return (
      <aside className="w-96 border-l h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a lesson to begin</p>
      </aside>
    );
  }

  const step = lesson.steps?.[currentStep];
  const isLastStep = currentStep === totalSteps - 1;
  const solution = lesson.solutions?.[language];

  return (
    <aside className="w-96 border-l h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="font-semibold">{lesson.title}</h2>
          {lesson.difficulty && (
            <Badge variant="outline">{lesson.difficulty}</Badge>
          )}
        </div>
        {lesson.category && (
          <p className="text-sm text-muted-foreground">{lesson.category}</p>
        )}
      </div>
      <Separator />

      <ScrollArea className="flex-1 p-4">
        {step && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Step {currentStep + 1} of {totalSteps}
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <p className="text-sm leading-relaxed">{step.explanation}</p>

              {step.code && (
                <div className="mt-4 overflow-hidden">
                  <CodeBlock code={step.code} language={language} />
                </div>
              )}

              {step.tip && (
                <div className="mt-4 p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {step.tip}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isLastStep && solution && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code className="h-4 w-4" />
                Complete Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <CodeBlock code={solution} language={language} />
            </CardContent>
          </Card>
        )}
      </ScrollArea>

      <Separator />
      <div className="p-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentStep + 1} / {totalSteps}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </aside>
  );
}
