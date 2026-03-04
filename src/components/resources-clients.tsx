"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useCallback, useRef } from "react";
import { Coins, Layers, Search, PlayCircle, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ================= TYPES ================= */

type SectionTag = {
  id: string;
  name: string;
  slug: string;
};

type Resource = {
  id: string;
  title: string;
  description?: string | null;
  sections?: SectionTag[] | null;
  type: "PROJECT_FILE" | "RESOURCE" | "INSPIRATION";
  paymentType: "COINS" | "MONEY" | "BOTH";
  priceMoney?: number | null;
  priceCoins?: number | null;
  thumbnail?: string | null;
  videoUrl?: string | null;
  isActive?: boolean;
};

/* ================= CONSTANTS ================= */

const priceSortOptions = [
  { value: "popular", label: "Featured" },
  { value: "coins-asc", label: "Coins: Low to High" },
  { value: "coins-desc", label: "Coins: High to Low" },
  { value: "money-asc", label: "Money: Low to High" },
  { value: "money-desc", label: "Money: High to Low" },
];

/* ================= UTILS ================= */

const coinsValue = (item: Resource) =>
  item.priceCoins ?? Number.POSITIVE_INFINITY;

const moneyValue = (item: Resource) =>
  item.priceMoney ?? Number.POSITIVE_INFINITY;

const isFree = (item: Resource) => {
  const coins = item.priceCoins ?? 0;
  const money = item.priceMoney ?? 0;

  if (item.paymentType === "COINS") return coins === 0;
  if (item.paymentType === "MONEY") return money === 0;
  return coins === 0 && money === 0;
};

const priceLabel = (item: Resource) => {
  const coins = item.priceCoins ?? 0;
  const money = item.priceMoney ?? 0;

  if (item.paymentType === "COINS") return `${coins} coins`;
  if (item.paymentType === "MONEY") return `₹${money}`;
  return `${coins} coins / ₹${money}`;
};

/* ================= RESOURCE CARD ================= */

function ResourceCard({ item }: { item: Resource }) {
  const [videoUnsupported, setVideoUnsupported] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const playVideo = useCallback((video: HTMLVideoElement) => {
    const p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => null);
    }
  }, []);

  const stopVideo = useCallback((video: HTMLVideoElement) => {
    video.pause();
    video.currentTime = 0;
  }, []);

  const toggleAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsMuted((prevMuted) => {
      const nextMuted = !prevMuted;
      video.muted = nextMuted;
      playVideo(video);
      return nextMuted;
    });
  }, [playVideo]);


  const thumbnail =
    !thumbError && item.thumbnail ? item.thumbnail : "/logo.png";

  return (
    <div className="group relative rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
      {/* Preview */}
      <div className="relative aspect-video bg-black/50 overflow-hidden">
        {item.videoUrl && !videoUnsupported ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={item.videoUrl}
              className="h-full w-full cursor-pointer object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              poster={item.thumbnail ?? undefined}
              onError={() => setVideoUnsupported(true)}
              onMouseEnter={(e) => playVideo(e.currentTarget)}
              onMouseLeave={(e) => stopVideo(e.currentTarget)}
              onClick={toggleAudio}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
              <PlayCircle className="w-12 h-12 text-white/50" />
            </div>

            <button
              type="button"
              onClick={toggleAudio}
              className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm"
              aria-label={isMuted ? "Enable preview audio" : "Mute preview audio"}
            >
              {isMuted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
              {isMuted ? "Sound off" : "Sound on"}
            </button>
          </div>
        ) : (
          <Image
            src={thumbnail}
            alt={item.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
            onError={() => setThumbError(true)}
            className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
            {item.type === "PROJECT_FILE" ? "Project File" : "Resource"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-sm text-neutral-400 line-clamp-2 min-h-[2.5em]">
            {item.description || "No description"}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-xs text-neutral-500">
          {item.sections?.map((section) => (
            <span
              key={section.id}
              className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5"
            >
              {section.name}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
            {item.paymentType !== "MONEY" && (
              <Coins className="size-4 text-primary" />
            )}
            {priceLabel(item)}
          </div>

          {item.paymentType === "MONEY" ? (
            <Button size="sm" variant="secondary" disabled className="h-8 text-xs">
              Soon
            </Button>
          ) : item.isActive !== false ? (
            <Button
              asChild
              size="sm"
              className="h-8 text-xs bg-white text-black hover:bg-primary hover:text-black font-bold"
            >
              <Link href={`/checkout/${item.id}`}>
                {isFree(item) ? "Get" : "Buy"}
              </Link>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled
              className="h-8 text-xs border-white/10 text-neutral-500"
            >
              N/A
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

export default function ResourcesClient({
  resources,
  sections,
}: {
  resources: Resource[];
  sections: SectionTag[];
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();

    let list = [...resources];

    if (term) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.sections?.some((s) =>
            s.name.toLowerCase().includes(term),
          ),
      );
    }

    switch (sort) {
      case "coins-asc":
        list.sort((a, b) => coinsValue(a) - coinsValue(b));
        break;
      case "coins-desc":
        list.sort((a, b) => coinsValue(b) - coinsValue(a));
        break;
      case "money-asc":
        list.sort((a, b) => moneyValue(a) - moneyValue(b));
        break;
      case "money-desc":
        list.sort((a, b) => moneyValue(b) - moneyValue(a));
        break;
    }

    return list;
  }, [resources, query, sort]);

  const grouped = useMemo(() => {
    const sectionGroups = sections
      .map((section) => ({
        section,
        items: filtered
          .filter((item) =>
            item.sections?.some((s) => s.id === section.id),
          ),
      }))
      .filter((g) => g.items.length > 0);

    const unsectioned = filtered.filter(
      (item) => !item.sections || item.sections.length === 0,
    );

    return { sectionGroups, unsectioned };
  }, [filtered, sections]);


  return (
    <div className="min-h-screen bg-background px-4 py-20 pb-32">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-4xl pt-10">
          <h1 className="text-4xl sm:text-6xl font-black leading-tight text-white">
            Curated Assets for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
              Viral Creators
            </span>
          </h1>

          <p className="text-neutral-400 max-w-xl">
            High-quality project files, textures and presets.
          </p>
        </div>

        {/* Controls */}
        <div className="sticky top-20 z-30 p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets..."
              className="pl-10"
            />
          </div>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {priceSortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {grouped.sectionGroups.map(({ section, items }) => (
            <div key={section.id} className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold text-white border-b border-white/10 pb-4">
                <Layers className="size-6 text-primary" />
                {section.name}
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                  <ResourceCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}

          {grouped.unsectioned.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold text-white border-b border-white/10 pb-4">
                <Layers className="size-6 text-neutral-500" />
                Other resources
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {grouped.unsectioned.map((item) => (
                  <ResourceCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}