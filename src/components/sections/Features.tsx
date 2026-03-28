"use client";

import { Folder, Lightbulb, Package, Users } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Folder,
    title: "Project Files",
    description: "Organize, version, and handoff in one calm place—built for motion teams.",
    color: "text-blue-400",
  },
  {
    icon: Lightbulb,
    title: "Inspiration Library",
    description: "Curated motion references to spark ideas without the scroll fatigue.",
    color: "text-amber-400",
  },
  {
    icon: Package,
    title: "Resources Hub",
    description: "Essential assets and templates that slot cleanly into your pipeline.",
    color: "text-emerald-400",
  },
  {
    icon: Users,
    title: "Referral System",
    description: "Invite peers, earn rewards, and keep the creative circle tight.",
    color: "text-pink-400",
  },
];

export function Features() {
  return (
    <section className="relative isolate overflow-hidden bg-background py-24 sm:py-32">
      {/* Background Gradients */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-gradient-to-tr from-primary to-purple-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-widest">
                The Workflow
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Create faster</span>
            </p>
            <p className="mt-6 text-lg leading-8 text-neutral-400">
                A focused toolkit—no clutter. Just the essentials for motion-first teams to dominate the feed.
            </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-4 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors duration-300"
                >
                  <dt className="flex items-center gap-x-3 text-xl font-bold leading-7 text-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                        <Icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="flex flex-auto flex-col text-base leading-7 text-neutral-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </motion.div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
