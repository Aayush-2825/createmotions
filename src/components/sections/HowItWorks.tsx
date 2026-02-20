"use client";

import { motion } from "motion/react";
import { Download, PlayCircle, Layers } from "lucide-react";

const STEPS = [
  {
    icon: PlayCircle,
    title: "Choose Your Viral Project",
    description: "Browse our curated library of proven viral formats. Don't start from scratch—start with a winner.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: Download,
    title: "Download the AEP File",
    description: "Get instant access to the full After Effects project file, including all assets, layers, and effects.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: Layers,
    title: "Learn, Edit & Create",
    description: "Deconstruct the pro techniques, swap in your footage, and export high-quality content in minutes.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-black relative">
       {/* Background Grid */}
       <div className="absolute inset-0 grid-surface opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground">
                Stop guessing. Start creating. The fastest workflow for modern creators.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        viewport={{ once: true }}
                        className="relative group text-center"
                    >
                        
                        <div className={`mx-auto w-24 h-24 rounded-3xl ${step.bg} flex items-center justify-center mb-8 rotate-3 dark:border dark:border-white/10 group-hover:rotate-6 transition-transform duration-300`}>
                            <Icon className={`w-10 h-10 ${step.color}`} />
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-4">
                            {step.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed px-4">
                            {step.description}
                        </p>
                    </motion.div>
                )
            })}
        </div>
      </div>
    </section>
  );
}
