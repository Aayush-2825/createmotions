
import { getResources } from "@/lib/resource";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

// Server component to fetch data
export async function ProductGrid() {
  const products = (await getResources()).slice(0, 6);
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
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative"
            >
              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl bg-card border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)] h-full flex flex-col">
                {/* Image or Placeholder */}
                <div className="relative aspect-video w-full bg-neutral-900 group-hover:scale-105 transition-transform duration-500">
                  {product.videoUrl ? (
                    <video
                      src={product.videoUrl}
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                      poster={product.thumbnail ?? undefined}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : product.thumbnail ? (
                    <Image src={product.thumbnail} alt={product.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20 font-heading text-4xl font-bold bg-linear-to-br from-white/5 to-transparent">
                      {product.type?.[0] || "?"}
                    </div>
                  )}
                  {/* Overlay on hover intentionally removed */}
                </div>

                <div className="p-6 flex flex-col grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20 uppercase tracking-wider">
                      {product.sections?.[0]?.name || product.type}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {product.paymentType === "COINS" && product.priceCoins ? `${product.priceCoins} Coins` : product.paymentType === "MONEY" && product.priceMoney ? `₹${product.priceMoney}` : product.paymentType === "BOTH" ? `${product.priceCoins} Coins / ₹${product.priceMoney}` : "FREE"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  {/* Get this file button intentionally removed */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="rounded-full px-10 bg-white text-black hover:bg-gray-200 text-lg font-bold">
            <Link href="/project-files">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
