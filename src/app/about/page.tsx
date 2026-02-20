import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, MessageCircle, Twitter } from "lucide-react";
import { motion } from "motion/react";

export const metadata = {
  title: "About | CreateMotion",
  description:
    "Learn how CreateMotion elevates brands through motion-first storytelling, crafted by a focused leadership team.",
};

export default function AboutPage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      {/* Background */}
      <div className="absolute inset-0 -z-10 grid-surface opacity-30 pointer-events-none" />
      <div className="absolute -top-1/2 left-1/2 w-full h-full bg-primary/5 blur-[150px] rounded-full pointer-events-none -translate-x-1/2" />

      <section className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 md:px-8 lg:pb-24 lg:pt-32">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary shadow-sm shadow-primary/20">
              About CreateMotion
            </Badge>
            <span className="hidden text-sm uppercase tracking-[0.24em] text-neutral-500 sm:inline">
              Elevating Brands Through Motion
            </span>
          </div>
          <span className="text-xs uppercase tracking-[0.22em] text-neutral-500 sm:hidden">
            Elevating Brands Through Motion
          </span>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="space-y-8">
            <h1 className="text-4xl leading-tight sm:text-5xl lg:text-7xl font-black tracking-tight text-white">
              Our team of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">skilled storytellers</span> is committed to delivering
              <br className="hidden lg:block" /> motion that feels <span className="italic text-white/80 font-display">personal</span>,
              <span className="italic text-white/80 font-display"> human</span>, and <span className="italic text-white/80 font-display">high-performing</span>.
            </h1>

            <p className="max-w-2xl text-xl text-neutral-400 leading-relaxed">
              At CreateMotion, we believe every brand has a story worth telling. We transform ideas into immersive visual experiences that resonate, engage, and inspire action. Our creative philosophy is simple: combine cutting-edge motion design with authentic storytelling to create content that doesn't just look beautiful—it performs.
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-neutral-300 font-medium">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition-colors">Story-first strategy</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition-colors">Cinematic motion systems</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 hover:bg-white/10 transition-colors">Launch-ready delivery</span>
            </div>
          </div>

          <Card className="border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl">
            <CardContent className="space-y-8 p-8 text-neutral-200">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.28em] text-primary font-bold">Our Mission</p>
                <p className="text-xl font-medium text-white leading-relaxed">
                  We don't just make videos. We craft visual stories that drive results and leave lasting impressions. Every frame is built to move people and move metrics.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm hover:border-primary/30 transition-colors">
                  <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Approach</p>
                  <p className="text-lg font-bold text-white">Motion-led, insight-driven</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm hover:border-primary/30 transition-colors">
                  <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">Promise</p>
                  <p className="text-lg font-bold text-white">Beauty that performs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl sm:grid-cols-[1.1fr_0.9fr] lg:p-12 items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.28em] text-primary font-bold">Connect</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Catch us where we share behind-the-scenes, drops, and work-in-progress.
            </h2>
            <p className="text-base text-neutral-400 max-w-lg">
              Follow along for process clips, launch news, and how we build motion systems that perform.
            </p>
          </div>

          <div className="grid gap-4 text-sm font-medium text-white sm:max-w-sm ml-auto w-full">
            <a
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5"
              href="https://www.instagram.com/createmotions"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our Instagram"
            >
              <span className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-pink-500/20 text-pink-500">
                    <Instagram className="h-4 w-4" aria-hidden />
                </div>
                Instagram
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500 group-hover:text-primary transition-colors">Reels + BTS</span>
            </a>
            <a
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5"
              href="https://x.com/createmotions3"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our X profile"
            >
               <span className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/10 text-white">
                    <Twitter className="h-4 w-4" aria-hidden />
                </div>
                X (Twitter)
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500 group-hover:text-primary transition-colors">Threads + drops</span>
            </a>
            <a
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-primary/5"
              href="https://discord.com/invite/qUxb9P3Ua"
              target="_blank"
              rel="noreferrer"
              aria-label="Join our Discord"
            >
               <span className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-500">
                    <MessageCircle className="h-4 w-4" aria-hidden />
                </div>
                Discord
              </span>
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500 group-hover:text-primary transition-colors">Community</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}