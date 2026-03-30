"use client";

import { useMemo, useState, useTransition } from "react";
// Helper to get unique file URLs from all resources
function getUniqueFileUrls(items: { fileUrl: string }[]): string[] {
  const urls = items.map((item) => item.fileUrl).filter(Boolean);
  return Array.from(new Set(urls));
}
// Simple URL validation
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { deleteResource, updateResource } from "@/actions/resource-actions";
import { uploadImageClient, uploadVideoClient } from "@/lib/cloudinary-client";
import {
  Coins,
  CreditCard,
  FilePenLine,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

/* ---------- TYPES ---------- */

type SectionTag = {
  id: string;
  name: string;
  slug: string;
};

type AdminResource = {
  id: string;
  title: string;
  description?: string | null;
  sections?: SectionTag[];
  type: "PROJECT_FILE" | "RESOURCE" | "INSPIRATION";
  paymentType: "COINS" | "MONEY" | "BOTH";
  priceMoney: number | null;
  priceCoins: number | null;
  thumbnail?: string | null;
  fileUrl: string;
  videoUrl?: string | null;
  isActive: boolean;
};

type EditForm = {
  title: string;
  description: string;
  type: AdminResource["type"];
  paymentType: AdminResource["paymentType"];
  priceMoney: number;
  priceCoins: number;
  fileUrl: string;
  thumbnail: string;
  videoUrl: string;
  isActive: boolean;
  sectionIds: string[];
};

/* ---------- CONSTANTS ---------- */

const paymentLabel: Record<AdminResource["paymentType"], string> = {
  COINS: "Coins only",
  MONEY: "Money only",
  BOTH: "Coins or money",
};

/* ---------- COMPONENT ---------- */

export const ResourceManage = ({ resource }: { resource: AdminResource[] }) => {
  const [items, setItems] = useState<AdminResource[]>(resource ?? []);
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState<AdminResource | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);


  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [thumbnailPreviewBroken, setThumbnailPreviewBroken] = useState(false);
  const [uploadedThumbnailName, setUploadedThumbnailName] = useState<string | null>(null);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);
  const [fileUrlError, setFileUrlError] = useState<string | null>(null);

  const isUploading = isUploadingThumbnail || isUploadingVideo;

  const totalActive = useMemo(
    () => items.filter((item) => item.isActive).length,
    [items],
  );

  const openEdit = (item: AdminResource) => {
    setEditing(item);
    setUploadedThumbnailName(null);
    setUploadedVideoName(null);
    setThumbnailPreviewBroken(false);
    setEditForm({
      title: item.title,
      description: item.description ?? "",
      type: item.type,
      paymentType: item.paymentType,
      priceMoney: item.priceMoney ?? 0,
      priceCoins: item.priceCoins ?? 0,
      fileUrl: item.fileUrl,
      thumbnail: item.thumbnail ?? "",
      videoUrl: item.videoUrl ?? "",
      isActive: item.isActive,
      sectionIds: item.sections?.map((s) => s.id) ?? [],
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setEditForm(null);
  };

  const handleEditSubmit = () => {
    if (!editing || !editForm) return;
    if (isUploading) {
      toast.warning("Please wait for uploads to finish.");
      return;
    }
    // Validate fileUrl
    if (!editForm.fileUrl || !isValidUrl(editForm.fileUrl)) {
      setFileUrlError("A valid File URL is required.");
      return;
    } else {
      setFileUrlError(null);
    }

    const formData = new FormData();
    Object.entries(editForm).forEach(([k, v]) =>
      formData.set(k, typeof v === "string" ? v : JSON.stringify(v)),
    );

    startTransition(() => {
      updateResource(editing.id, formData).then((result) => {
        if (result?.success && result.resource) {
          setItems((prev) =>
            prev.map((item) =>
              item.id === editing.id ? { ...item, ...result.resource } : item,
            ),
          );
          toast.success("Resource updated");
          closeEdit();
        } else if (result?.error) {
          toast.error(result.error);
        } else {
          toast.error("Failed to update resource");
        }
      });
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    startTransition(() => {
      deleteResource(id).then((result) => {
        if (result?.success) {
          setItems((prev) => prev.filter((item) => item.id !== id));
          toast.success("Resource deleted");
        }
        setDeleteId(null);
      });
    });
  };

  return (
    <section className="space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Your resources
          </h2>
          <p className="text-sm text-slate-600">
            Manage availability, pricing, and files you have published.
          </p>
        </div>

        <Badge variant="outline">
          {totalActive} active / {items.length} total
        </Badge>
      </div>

      <CardContent className="space-y-4 overflow-x-hidden">
        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No resources created yet.
          </div>
        ) : (
          <div className="space-y-10">
            {items.map((item) => (
              <div
                key={item.id}
                className="border-b border-slate-200 pb-6 last:border-none transition-colors duration-200   p-4 rounded-lg"
              >
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {item.description || "No description provided."}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2 text-xs">
                      <Badge variant="secondary">{item.type}</Badge>
                      <Badge
                        variant={item.isActive ? "default" : "destructive"}
                      >
                        {item.isActive ? "Active" : "Disabled"}
                      </Badge>
                      <Badge variant="outline">
                        {paymentLabel[item.paymentType]}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(item)}
                    >
                      <FilePenLine className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete resource?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={deleteId === item.id}
                            onClick={() => handleDelete(item.id)}
                          >
                            {deleteId === item.id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Confirm delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Coins className="h-4 w-4 text-amber-500" />
                    {item.priceCoins ?? 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-4 w-4" />₹{item.priceMoney ?? 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={Boolean(editing)} onOpenChange={(o) => !o && closeEdit()}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {editing && editForm && (
            <>
              <DialogHeader>
                <DialogTitle>Edit resource</DialogTitle>
                <DialogDescription>
                  Update pricing, links, or visibility.
                </DialogDescription>
              </DialogHeader>

              {/* KEEP your existing dialog form JSX here exactly as-is */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="h-10 w-full rounded-md border px-3 text-sm"
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        type: e.target.value as AdminResource["type"],
                      })
                    }
                  >
                    <option value="PROJECT_FILE">Project file</option>
                    <option value="RESOURCE">Resource</option>
                    <option value="INSPIRATION">Inspiration</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment">Payment type</Label>
                  <select
                    id="payment"
                    className="h-10 w-full rounded-md border px-3 text-sm"
                    value={editForm.paymentType}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        paymentType: e.target
                          .value as AdminResource["paymentType"],
                      })
                    }
                  >
                    <option value="COINS">Coins</option>
                    <option value="MONEY">Money</option>
                    <option value="BOTH">Coins or money</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coins">Coins price</Label>
                  <Input
                    id="coins"
                    type="number"
                    min={0}
                    value={editForm.priceCoins}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        priceCoins: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="money">Money price</Label>
                  <Input
                    id="money"
                    type="number"
                    min={0}
                    step="0.01"
                    value={editForm.priceMoney}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        priceMoney: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileUrl">File URL</Label>
                  <Input
                    id="fileUrl"
                    value={editForm?.fileUrl ?? ""}
                    onChange={(e) => {
                      if (!editForm) return;
                      setEditForm({ ...editForm, fileUrl: e.target.value });
                      if (!e.target.value || !isValidUrl(e.target.value)) {
                        setFileUrlError("A valid File URL is required.");
                      } else {
                        setFileUrlError(null);
                      }
                    }}
                    className={fileUrlError ? "border-red-500" : ""}
                  />
                  {fileUrlError && (
                    <div className="text-xs text-red-500">{fileUrlError}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail</Label>
                  <input
                    type="hidden"
                    name="thumbnail"
                    value={editForm.thumbnail}
                  />
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    disabled={isUploadingThumbnail}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadedThumbnailName(file.name);
                      setIsUploadingThumbnail(true);
                      uploadImageClient(file)
                        .then((url) => {
                          setThumbnailPreviewBroken(false);
                          setEditForm((prev) =>
                            prev ? { ...prev, thumbnail: url } : prev,
                          );
                          toast.success("Thumbnail uploaded");
                        })
                        .catch((err) => {
                          console.error(err);
                          toast.error("Thumbnail upload failed");
                          setUploadedThumbnailName(null);
                        })
                        .finally(() => setIsUploadingThumbnail(false));
                    }}
                  />

                  {editForm.thumbnail && !thumbnailPreviewBroken && (
                    <AspectRatio
                      ratio={16 / 9}
                      className="relative overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={editForm.thumbnail}
                        alt="Thumbnail preview"
                        fill
                        unoptimized
                        onError={() => setThumbnailPreviewBroken(true)}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </AspectRatio>
                  )}
                  {thumbnailPreviewBroken && (
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                      Thumbnail preview unavailable.
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {isUploadingThumbnail && (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Uploading thumbnail...
                      </span>
                    )}
                    {uploadedThumbnailName && !isUploadingThumbnail && (
                      <span>Selected: {uploadedThumbnailName}</span>
                    )}
                    {editForm.thumbnail && !isUploadingThumbnail && (
                      <Badge variant="outline" className="gap-1">
                        <Upload className="h-3 w-3" /> Uploaded
                      </Badge>
                    )}
                    {editForm.thumbnail && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditForm({ ...editForm, thumbnail: "" });
                          setUploadedThumbnailName(null);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Preview Video (optional)</Label>
                  <input
                    type="hidden"
                    name="videoUrl"
                    value={editForm.videoUrl}
                  />
                  <Input
                    id="videoUrl"
                    type="file"
                    accept="video/*"
                    disabled={isUploadingVideo}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadedVideoName(file.name);
                      setIsUploadingVideo(true);
                      uploadVideoClient(file)
                        .then((url) => {
                          setEditForm((prev) =>
                            prev ? { ...prev, videoUrl: url } : prev,
                          );
                          toast.success("Video uploaded");
                        })
                        .catch((err) => {
                          console.error(err);
                          const message =
                            err instanceof Error
                              ? err.message
                              : "Video upload failed";
                          toast.error(message);
                          setUploadedVideoName(null);
                        })
                        .finally(() => setIsUploadingVideo(false));
                    }}
                  />

                  {editForm.videoUrl && (
                    <div className="text-xs text-muted-foreground">
                      Video uploaded
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {isUploadingVideo && (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Uploading video...
                      </span>
                    )}
                    {uploadedVideoName && !isUploadingVideo && (
                      <span>Selected: {uploadedVideoName}</span>
                    )}
                    {editForm.videoUrl && !isUploadingVideo && (
                      <Badge variant="outline" className="gap-1">
                        <Upload className="h-3 w-3" /> Uploaded
                      </Badge>
                    )}
                    {editForm.videoUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditForm({ ...editForm, videoUrl: "" });
                          setUploadedVideoName(null);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 md:col-span-2">
                  <Switch
                    id="isActive"
                    checked={editForm.isActive}
                    onCheckedChange={(checked) =>
                      setEditForm({ ...editForm, isActive: Boolean(checked) })
                    }
                  />
                  <Label htmlFor="isActive" className="font-medium">
                    Resource is active
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeEdit}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditSubmit}
                  disabled={isPending || isUploading}
                >
                  {(isPending || isUploading) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isUploading ? "Uploads in progress" : "Save changes"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
