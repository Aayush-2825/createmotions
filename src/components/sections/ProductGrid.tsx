"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const PRODUCTS = [
  {
    id: 1,
    title: "Viral Typography Pack",
    category: "Typography",
    price: "FREE",
    image: "/placeholder-1.jpg", 
    color: "#00E5FF",
  },
  {
    id: 2,
    title: "Neon Glitch Overlay",
    category: "Overlays",
    price: "100 Coins",
    image: "/placeholder-2.jpg",
    color: "#BD00FF",
  },
  {
    id: 3,
    title: "Paper Rip Transitions",
    category: "Transitions",
    price: "50 Coins",
    image: "/placeholder-3.jpg",
    color: "#FF5E00",
  },
  {
    id: 4,
    title: "3D Camera Shake Presets",
    category: "Presets",
    price: "FREE",
    image: "/placeholder-4.jpg",
    color: "#00E5FF",
  },
  {
    id: 5,
    title: "Cyberpunk HUD Elements",
    category: "Assets",
    price: "200 Coins",
    image: "/placeholder-5.jpg",
    color: "#BD00FF",
  },
  {
    id: 6,
    title: "Grain & Texture Pack",
    category: "Textures",
    price: "FREE",
    image: "/placeholder-6.jpg",
    color: "#FF5E00",
  },
];

export function ProductGrid() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Trending <span className="text-primary">Assets</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hand-picked viral editing assets to level up your content immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl bg-card border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] h-full flex flex-col">
                
                {/* Image Placeholder */}
                <div className="relative aspect-[16/9] w-full bg-neutral-900 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-heading text-4xl font-bold bg-gradient-to-br from-white/5 to-transparent">
                        {product.category[0]}
                    </div>
                     {/* Overlay on hover */}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-black">
                            View Details
                        </Button>
                     </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-xs font-bold text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20 uppercase tracking-wider">
                      {product.category}
                     </span>
                     <span className="text-sm font-semibold text-white">
                        {product.price}
                     </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-center text-sm text-muted-foreground group-hover:text-white transition-colors">
                    Get this file <ArrowUpRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
            <Button size="lg" className="rounded-full px-10 bg-white text-black hover:bg-gray-200 text-lg font-bold">
                View All Products
            </Button>
        </div>

      </div>
    </section>
  );
}
