"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

const MorphingText: React.FC<MorphingTextProps> = ({ texts, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((current) => (current + 1) % texts.length);
        setIsVisible(true);
      }, 200);
    }, 4000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className={cn("text-center", className)}>
      <h1 
        className="text-4xl font-bold transition-opacity duration-200"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        {texts[currentIndex]}
      </h1>
    </div>
  );
};

export { MorphingText };
