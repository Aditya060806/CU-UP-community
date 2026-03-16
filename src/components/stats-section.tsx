"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BookOpen, Code, Users, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";

function useCountUp(target: number, started: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out
      const ease = 1 - (1 - progress) ** 3;
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, started, duration]);
  return count;
}

type StatItem = {
  icon: React.ReactNode;
  label: string;
  value: string;
  numericValue: number;
  suffix: string;
  color: string;
  bgColor: string;
};

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const stats: StatItem[] = [
    {
      icon: <Users className="h-6 w-6" />,
      label: "Active Students",
      value: siteConfig.stats.students,
      numericValue: 5000,
      suffix: "+",
      color: "text-red-700 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Tech Clubs",
      value: siteConfig.stats.clubs,
      numericValue: 12,
      suffix: "+",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      icon: <Code className="h-6 w-6" />,
      label: "Projects Shipped",
      value: siteConfig.stats.projects,
      numericValue: 80,
      suffix: "+",
      color: "text-blue-700 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      label: "Events Hosted",
      value: siteConfig.stats.events,
      numericValue: 200,
      suffix: "+",
      color: "text-green-700 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <section ref={ref} className="py-12 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            stat={stat}
            index={index}
            started={isInView}
          />
        ))}
      </motion.div>
    </section>
  );
}

function StatCard({
  stat,
  index,
  started,
}: {
  stat: StatItem;
  index: number;
  started: boolean;
}) {
  const count = useCountUp(stat.numericValue, started, 2000 + index * 200);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={started ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="relative p-6 rounded-2xl bg-white dark:bg-background/80 border border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 text-center overflow-hidden">
        {/* Background glow */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${stat.bgColor}`}
        />

        <div
          className={`inline-flex p-3 rounded-xl ${stat.bgColor} mb-4 group-hover:scale-105 transition-transform duration-300`}
        >
          <div className={stat.color}>{stat.icon}</div>
        </div>

        <div className={`text-3xl md:text-4xl font-black mb-1 ${stat.color}`}>
          {count.toLocaleString()}
          {stat.suffix}
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {stat.label}
        </p>
      </div>
    </motion.div>
  );
}
