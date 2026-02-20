"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="absolute inset-0 grid-surface opacity-30" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full"
        />
        <motion.div
           animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 right-0 w-3/4 h-3/4 bg-purple-500/5 blur-[100px] rounded-full"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary tracking-wide uppercase">
              The #1 Marketplace for Motion
            </span>
          </div>

          {/* Heading */}
          <h1 className="max-w-6xl mx-auto text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-purple-500 neon-text mb-4 pb-2">
              CreateMotions
            </span>
            <span className="block text-white text-3xl md:text-5xl lg:text-6xl tracking-tight">
              Viral After Effects <span className="text-white/80">Project Files</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-light">
            Professional project files inspired by real viral trends.
            <span className="text-white font-medium"> Learn better, create faster,</span> and dominate your feed.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
             <Button
              size="lg"
              className="h-14 px-8 text-lg rounded-full bg-primary text-black font-bold hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => router.push("/project-files")}
            >
              Browse Projects
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300"
              onClick={() => router.push("/about")}
            >
              Who we are
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          
        </motion.div>
      </div>
    </section>
  );
}
