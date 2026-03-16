"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ArrowRight, Github, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container justify-center text-center flex mx-auto px-4 py-12 md:py-24 lg:py-32">
      <div className="grid lg:grid-cols-2 max-w-7xl gap-8 items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-6 text-left"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 w-fit"
          >
            <Zap className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Chandigarh University, Uttar Pradesh
            </span>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-left">
              Build.{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-500">
                Learn.
              </span>{" "}
              Innovate.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              {siteConfig.tagline}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              asChild
              className="bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-700/25"
            >
              <Link href="/join" className="flex items-center gap-2">
                Join the Community
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <Link href="/projects" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                Explore Projects
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Right side – logo panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-96 rounded-2xl overflow-hidden shadow-2xl shadow-red-900/40"
        >
          {/* Overlay gradient at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
          <Image
            src="/cu-campus.png"
            alt="Chandigarh University, Uttar Pradesh Campus"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              console.error("Image failed to load:", e);
            }}
          />
          {/* Corner accent badge */}
          <div className="absolute bottom-4 left-4 bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 z-20">
            <p className="text-white text-sm font-bold">CU-UP Campus</p>
            <p className="text-white/70 text-xs">Lucknow, Uttar Pradesh</p>
          </div>
          <div className="absolute top-4 right-4 bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-3 py-2 z-20">
            <p className="text-white text-xs font-semibold">CU-UP</p>
            <p className="text-white/60 text-xs">Est. 2024</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
