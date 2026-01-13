"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import VisualizationCanvas from "@/components/canvas/VisualizationCanvas";
import { useAnimation } from "@/hooks/useAnimation";
import chapters from "@/data/chapters.json";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [language, setLanguage] = useState("python");

  const totalSteps = currentLesson?.steps?.length || 0;
  const { currentStep, nextStep, previousStep } = useAnimation(totalSteps);

  return (
    <div className="h-screen flex flex-col">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        language={language}
        onLanguageChange={setLanguage}
      />

      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar
          isOpen={sidebarOpen}
          chapters={chapters}
          currentLesson={currentLesson?.id}
        />

        <VisualizationCanvas>
          {!currentLesson ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to LeetCode Academy</h2>
              <p className="text-muted-foreground">
                Select a lesson from the sidebar to get started
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground">
              Visualization for {currentLesson.title}
            </div>
          )}
        </VisualizationCanvas>

        <RightSidebar
          lesson={currentLesson}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrevious={previousStep}
          onNext={nextStep}
          language={language}
        />
      </div>
    </div>
  );
}
