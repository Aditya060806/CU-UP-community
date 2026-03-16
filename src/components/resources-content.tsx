"use client";

import { motion } from "framer-motion";
import { BookOpen, Code2, Globe, Lock, Rocket, Server, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const resources = [
  {
    category: "Web Development",
    icon: <Globe className="h-5 w-5" />,
    color: "from-blue-100 to-blue-200 dark:from-blue-800/50 dark:to-blue-700/50",
    textColor: "text-blue-700 dark:text-blue-400",
    hoverBorder: "hover:shadow-blue-500/10",
    accent: "via-blue-300/50",
    items: [
      { name: "React Docs", url: "https://react.dev", desc: "Official React documentation" },
      { name: "Next.js Learn", url: "https://nextjs.org/learn", desc: "Full-stack React framework guide" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "Web standards reference" },
      { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs", desc: "Typed JavaScript" },
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-purple-100 to-purple-200 dark:from-purple-800/50 dark:to-purple-700/50",
    textColor: "text-purple-700 dark:text-purple-400",
    hoverBorder: "hover:shadow-purple-500/10",
    accent: "via-purple-300/50",
    items: [
      { name: "fast.ai", url: "https://fast.ai", desc: "Practical deep learning for coders" },
      { name: "Hugging Face", url: "https://huggingface.co/learn", desc: "NLP and transformers hub" },
      { name: "Kaggle Learn", url: "https://www.kaggle.com/learn", desc: "Free data science micro-courses" },
      { name: "CS229 Lectures", url: "https://cs229.stanford.edu", desc: "Stanford ML course notes" },
    ],
  },
  {
    category: "DevOps & Cloud",
    icon: <Server className="h-5 w-5" />,
    color: "from-green-100 to-green-200 dark:from-green-800/50 dark:to-green-700/50",
    textColor: "text-green-700 dark:text-green-400",
    hoverBorder: "hover:shadow-green-500/10",
    accent: "via-green-300/50",
    items: [
      { name: "Docker Docs", url: "https://docs.docker.com", desc: "Container fundamentals" },
      { name: "Kubernetes Learn", url: "https://kubernetes.io/docs/tutorials", desc: "Container orchestration" },
      { name: "AWS Skill Builder", url: "https://skillbuilder.aws", desc: "Free AWS training" },
      { name: "Linux Journey", url: "https://linuxjourney.com", desc: "Interactive Linux learning" },
    ],
  },
  {
    category: "Cybersecurity",
    icon: <Lock className="h-5 w-5" />,
    color: "from-red-100 to-red-200 dark:from-red-800/50 dark:to-red-700/50",
    textColor: "text-red-700 dark:text-red-400",
    hoverBorder: "hover:shadow-red-500/10",
    accent: "via-red-300/50",
    items: [
      { name: "TryHackMe", url: "https://tryhackme.com", desc: "Hands-on cybersecurity training" },
      { name: "HackTheBox", url: "https://hackthebox.com", desc: "CTF challenges and labs" },
      { name: "PortSwigger Web Academy", url: "https://portswigger.net/web-security", desc: "Web vulnerability labs" },
      { name: "OWASP Top 10", url: "https://owasp.org/Top10", desc: "Web security risks guide" },
    ],
  },
  {
    category: "Competitive Programming",
    icon: <Code2 className="h-5 w-5" />,
    color: "from-amber-100 to-amber-200 dark:from-amber-800/50 dark:to-amber-700/50",
    textColor: "text-amber-700 dark:text-amber-500",
    hoverBorder: "hover:shadow-amber-500/10",
    accent: "via-amber-300/50",
    items: [
      { name: "Codeforces", url: "https://codeforces.com", desc: "Competitive programming contests" },
      { name: "LeetCode", url: "https://leetcode.com", desc: "DSA interview preparation" },
      { name: "CP Algorithms", url: "https://cp-algorithms.com", desc: "Algorithm explanations" },
      { name: "USACO Guide", url: "https://usaco.guide", desc: "Structured CP learning path" },
    ],
  },
  {
    category: "Getting Started",
    icon: <Rocket className="h-5 w-5" />,
    color: "from-orange-100 to-orange-200 dark:from-orange-800/50 dark:to-orange-700/50",
    textColor: "text-orange-700 dark:text-orange-400",
    hoverBorder: "hover:shadow-orange-500/10",
    accent: "via-orange-300/50",
    items: [
      { name: "The Odin Project", url: "https://www.theodinproject.com", desc: "Full web dev curriculum (free)" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", desc: "Learn to code for free" },
      { name: "Git & GitHub Docs", url: "https://docs.github.com/en/get-started", desc: "Version control essentials" },
      { name: "CS50x", url: "https://cs50.harvard.edu/x", desc: "Harvard's intro to CS (free)" },
    ],
  },
];

export function ResourcesContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 mb-5">
          <BookOpen className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
          <span className="text-sm font-medium text-red-700 dark:text-red-300">
            Curated by CU-UP
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
          Student{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-amber-500">
            Resources Hub
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          A curated collection of the best free learning resources, tools, and
          platforms to help you grow as a developer at CU-UP.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {resources.map((resource) => (
          <motion.div
            key={resource.category}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group"
          >
            <Card
              className={`h-full relative overflow-hidden bg-white/80 dark:bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl ${resource.hoverBorder} transition-all duration-300`}
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent ${resource.accent} to-transparent group-hover:opacity-100 transition-opacity duration-300`} />
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-full bg-linear-to-br ${resource.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <div className={resource.textColor}>{resource.icon}</div>
                  </div>
                  <h2 className={`text-lg font-bold ${resource.textColor}`}>
                    {resource.category}
                  </h2>
                </div>

                {/* Links */}
                <ul className="space-y-3 flex-1">
                  {resource.items.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-0.5 group/link hover:translate-x-1 transition-transform duration-200"
                      >
                        <span className={`text-sm font-semibold ${resource.textColor} group-hover/link:underline underline-offset-2`}>
                          {item.name}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.desc}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-center mt-16 p-10 rounded-2xl bg-gradient-to-br from-red-700 to-amber-600 shadow-xl shadow-red-900/30"
      >
        <h2 className="text-3xl font-bold text-white mb-3">
          Have a resource to share?
        </h2>
        <p className="text-white/80 text-lg mb-6">
          Know a great free resource that should be here? Contribute to our
          open-source repo and help your fellow students.
        </p>
        <Button asChild size="lg" className="bg-white text-red-700 hover:bg-white/90 font-bold shadow-lg">
          <Link href="https://github.com/cuuptech" target="_blank" rel="noopener noreferrer">
            Contribute on GitHub
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
