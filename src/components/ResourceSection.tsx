"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";

type SectionTag = {
  id: string;
  name: string;
  slug: string;
};

type UserResource = {
  id: string;
  title: string;
  description?: string | null;
  sections?: SectionTag[];
  type: "PROJECT_FILE" | "RESOURCE" | "INSPIRATION";
  paymentType: "COINS" | "MONEY" | "BOTH";
  priceMoney: number | null;
  priceCoins: number | null;
  fileUrl: string;
  isActive: boolean;
};

const formatPrice = (item: UserResource) => {
  const coins = item.priceCoins ?? 0;
  const money = item.priceMoney ?? 0;

  if (item.paymentType === "COINS") return `${coins} coins`;
  if (item.paymentType === "MONEY") return `₹${money}`;
  return `${coins} coins / ₹${money}`;
};

export const ResourceSection = ({ resource }: { resource: UserResource[] }) => {
  const resources = resource ?? [];

  const handleDownload = (url: string) => {
    if (!url) return;
    window.open(url, "_blank");
  };

  if (resources.length === 0) {
    return (
      <Card className="border-white/70 bg-white/80 shadow-sm backdrop-blur">
        <CardContent className="py-6 text-center text-sm text-muted-foreground">
          You have not purchased any resources yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-10 md:grid-cols-2">
        {resources.map((item) => (
          <div
            key={item.id}
            className="space-y-4 border-b border-slate-200 pb-10 last:border-none"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>

              <p className="text-sm text-slate-600">
                {item.description || "No description provided."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">{item.type.replace("_", " ")}</Badge>

              <Badge variant={item.isActive ? "default" : "destructive"}>
                {item.isActive ? "Active" : "Unavailable"}
              </Badge>

              <Badge variant="outline">{formatPrice(item)}</Badge>

              {item.sections?.map((section) => (
                <Badge key={section.id} variant="outline">
                  {section.name}
                </Badge>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
              <p className="text-sm text-slate-500">
                Download your purchased file anytime.
              </p>

              <Button
                onClick={() => handleDownload(item.fileUrl)}
                variant="outline"
                className="gap-2"
                disabled={!item.fileUrl}
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
