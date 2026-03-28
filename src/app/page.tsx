import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { Suspense } from "react";

export const metadata = {
  title: "Create Motions - Transform Your Ideas Into Motion",
  description: "Create stunning motion graphics and animations for your projects with our intuitive platform. Professional tools and resources for creators.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Hero />
      <HowItWorks />
      <Suspense fallback={<div className="min-h-100 flex items-center justify-center text-muted-foreground text-lg">Loading products…</div>}>
        <ProductGrid />
      </Suspense>
      <Features />
    </main>
  );
}