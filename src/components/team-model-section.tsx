"use client";

import { motion, type Variants } from "framer-motion";
import { Compass, GraduationCap, Lightbulb, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export function TeamModelSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const teamRoles = [
    {
      letter: siteConfig.teamStructure.techie.letter,
      title: siteConfig.teamStructure.techie.title,
      description: `${siteConfig.teamStructure.techie.years} students who are eager to learn and contribute`,
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      letter: siteConfig.teamStructure.explorer.letter,
      title: siteConfig.teamStructure.explorer.title,
      description: `${siteConfig.teamStructure.explorer.years} students who dive deeper into specific technologies`,
      icon: <Compass className="h-5 w-5" />,
    },
    {
      letter: siteConfig.teamStructure.advisor.letter,
      title: siteConfig.teamStructure.advisor.title,
      description: `${siteConfig.teamStructure.advisor.years} students who provide strategic guidance to projects`,
      icon: <Users className="h-5 w-5" />,
    },
    {
      letter: siteConfig.teamStructure.mentor.letter,
      title: siteConfig.teamStructure.mentor.title,
      description: `${siteConfig.teamStructure.mentor.years} who provide industry insights and connections to students`,
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ];

  return (
    <section
      id="team"
      className="relative py-16 overflow-hidden max-w-7xl mx-auto"
    >
      {/* Subtle Background Elements - matching vision section */}
      <div className="absolute inset-0 bg-linear-to-br from-red-50/20 via-white to-amber-50/10 dark:from-red-950/5 dark:via-background dark:to-amber-950/5" />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl -translate-x-28 translate-y-28" />

      <div className="container relative mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            Community Structure
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Our SDLA model creates a sustainable structure for knowledge sharing
            and growth across all years
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto"
        >
          {teamRoles.map((role, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
              className="group h-full"
            >
              <Card className="h-full relative overflow-hidden bg-white/80 dark:bg-background/80 backdrop-blur-sm border-red-50 dark:border-red-900/30 shadow-lg hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300">
                {/* Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-red-100/40 via-red-300/50 to-amber-200/40 group-hover:from-red-300/60 group-hover:via-red-400/70 group-hover:to-amber-300/60 transition-colors duration-300" />

                <CardContent className="relative p-5 flex flex-col items-center text-center h-full">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-red-100 to-red-200 dark:from-red-800/50 dark:to-red-700/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <div className="text-red-700 dark:text-red-400">
                        {role.icon}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2 mb-4">
                    <h3 className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {role.letter}
                    </h3>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {role.title}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <div className="mt-6 w-8 h-px bg-linear-to-r from-transparent via-red-300/50 to-transparent group-hover:via-red-500 transition-colors duration-300" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
