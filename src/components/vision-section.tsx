"use client";

import { motion, type Variants } from "framer-motion";
import { Code, Globe, Lightbulb, Sparkles, Target, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function VisionSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const visionPoints = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Innovation",
      description:
        "Cultivating a culture of innovation, creative problem-solving, and product thinking on campus",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Collaboration",
      description:
        "Breaking department silos to build cross-functional student teams that ship real products",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Build in Public",
      description:
        "Encouraging students to share their journey, contribute to open source, and learn through doing",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Campus Ecosystem",
      description:
        "Creating a thriving tech ecosystem at CU-UP where every student can access opportunities and mentorship",
    },
  ];

  return (
    <section
      id="vision"
      className="relative py-16 overflow-hidden max-w-7xl mx-auto"
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-linear-to-br from-red-50/20 via-white to-amber-50/10 dark:from-red-950/5 dark:via-background dark:to-amber-950/5" />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl -translate-x-28 translate-y-28" />

      <div className="container relative mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 mb-5">
            <Target className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">
              Our Vision & Mission
            </span>
          </div>

          <h2 className="md:text-4xl font-bold mb-12 text-gray-800 dark:text-gray-200">
            Building Tomorrow&apos;s{" "}
            <span className="text-red-700 dark:text-red-400">
              Campus Tech Leaders
            </span>
          </h2>

          {/* Vision Statement */}
          <div className="max-w-5xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-8 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100/80 dark:border-red-800/30 backdrop-blur-sm"
            >
              <div className="absolute top-4 left-4">
                <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400" />
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-800 dark:text-gray-100 font-medium leading-relaxed mb-6 pl-6">
                &ldquo;{siteConfig.vision}&rdquo;
              </blockquote>
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed pl-6">
                {siteConfig.visionDetail}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Vision Points Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {visionPoints.map((point, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <Card className="h-full relative overflow-hidden bg-white/80 dark:bg-background/80 backdrop-blur-sm border-red-50 dark:border-red-900/30 shadow-lg hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
                {/* Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-red-100/40 via-red-300/50 to-amber-200/40 group-hover:from-red-300/60 group-hover:via-red-400/70 group-hover:to-amber-300/60 transition-colors duration-300" />

                <CardContent className="relative pt-8 px-5 pb-5 flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-100 to-red-200 dark:from-red-800/50 dark:to-red-700/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-red-700 dark:text-red-400">
                        {point.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                    {point.description}
                  </p>

                  {/* Bottom Accent */}
                  <div className="mt-7 w-8 h-px bg-linear-to-r from-transparent via-red-300/50 to-transparent group-hover:via-red-500 transition-colors duration-300" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-16"
        ></motion.div>
      </div>
    </section>
  );
}
