"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import VisualizationCanvas from "@/components/canvas/VisualizationCanvas";
import ArrayViz from "@/components/visualizations/ArrayViz";
import LinkedListViz from "@/components/visualizations/LinkedListViz";
import HashMapViz from "@/components/visualizations/HashMapViz";
import HashSetViz from "@/components/visualizations/HashSetViz";
import { useAnimation } from "@/hooks/useAnimation";
import chapters from "@/data/chapters.json";

const lessonModules = {
  "two-sum": () => import("@/data/lessons/two-sum.json"),
  "contains-duplicate": () => import("@/data/lessons/contains-duplicate.json"),
  "valid-anagram": () => import("@/data/lessons/valid-anagram.json"),
  "reverse-linked-list": () => import("@/data/lessons/reverse-linked-list.json"),
  "maximum-subarray": () => import("@/data/lessons/maximum-subarray.json"),
};

export default function LessonPage() {
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("python");

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
  const { currentStep, nextStep, previousStep, reset } = useAnimation(totalSteps);

  useEffect(() => {
    reset();
  }, [params.slug, reset]);

  const currentStepData = lesson?.steps?.[currentStep];

  const renderVisualization = () => {
    if (!currentStepData?.visualState) {
      return (
        <div className="text-center text-muted-foreground">
          <p>No visualization for this step</p>
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
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading lesson...</p>
      </div>
    );
  }

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
          currentLesson={params.slug}
        />

        <VisualizationCanvas>
          {!lesson ? (
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Lesson not found</h2>
              <p className="text-muted-foreground">
                This lesson is not yet available
              </p>
            </div>
          ) : (
            renderVisualization()
          )}
        </VisualizationCanvas>

        <RightSidebar
          lesson={lesson}
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
