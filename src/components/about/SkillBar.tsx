"use client";

import { useEffect, useRef, useState } from "react";

interface SkillBarProps {
  readonly name: string;
  readonly months: number;
  readonly maxMonths?: number;
}

function formatDuration(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths}ヶ月`;
  }
  if (remainingMonths === 0) {
    return `${years}年`;
  }
  return `${years}年${remainingMonths}ヶ月`;
}

export default function SkillBar({
  name,
  months,
  maxMonths = 32,
}: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = barRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  const percentage = Math.min((months / maxMonths) * 100, 100);

  return (
    <div ref={barRef} className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-text-main">{name}</span>
        <span className="text-text-sub">{formatDuration(months)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000 ease-out"
          style={{ width: isVisible ? `${percentage}%` : "0%" }}
        />
      </div>
    </div>
  );
}
