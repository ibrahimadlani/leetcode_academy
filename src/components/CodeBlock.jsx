"use client";

import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const languageMap = {
  python: "python",
  python3: "python",
  java: "java",
  cpp: "cpp",
  "c++": "cpp",
  javascript: "javascript",
  js: "javascript",
};

export default function CodeBlock({ code, language = "python" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!code) return null;

  const prismLanguage = languageMap[language.toLowerCase()] || "python";
  const theme = mounted && resolvedTheme === "dark" ? themes.nightOwl : themes.github;

  return (
    <div className="w-full overflow-hidden rounded-md">
      <Highlight theme={theme} code={code.trim()} language={prismLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="p-3 text-xs overflow-x-auto font-[family-name:var(--font-jetbrains-mono)]"
            style={{ ...style, margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="whitespace-pre">
                <span className="inline-block w-6 text-right mr-3 select-none opacity-50">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
