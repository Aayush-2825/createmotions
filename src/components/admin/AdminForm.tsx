"use client";

import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Coins, BadgeCheck, Loader2, Upload, X } from "lucide-react";
import * as z from "zod";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupText,
} from "@/components/ui/input-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createResource } from "@/actions/resource-actions";
import { useSectionsController } from "@/hooks/use-section-controller";
import { uploadImageClient, uploadVideoClient } from "@/lib/cloudinary-client";

function normalizeDriveUrl(input: string) {
  if (!input) return input;

  const trimmed = input.trim();

  // already converted
  if (trimmed.includes("uc?id=")) return trimmed;

  // extract id from different formats
  const match =
    trimmed.match(/\/file\/d\/([^/]+)/) || trimmed.match(/[?&]id=([^&]+)/);

  const id = match?.[1] ?? trimmed;

  // simple id validation
  if (/^[a-zA-Z0-9_-]{10,}$/.test(id)) {
    return `https://drive.google.com/uc?id=${id}&export=download`;
  }

  return input;
}

const resourceSchema = z.object({
  title: z.string().min(3),
  type: z.enum(["PROJECT_FILE", "RESOURCE", "INSPIRATION"]),
  sections: z.array(z.string()).min(1),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  fileUrl: z.string().url(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  paymentType: z.enum(["COINS", "MONEY", "BOTH"]),
  priceMoney: z.number().min(0),
  priceCoins: z.number().min(0),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof resourceSchema>;

const resourceTypes = [
  { value: "PROJECT_FILE", label: "Project File" },
  { value: "RESOURCE", label: "Resource" },
  { value: "INSPIRATION", label: "Inspiration" },
];

const paymentTypes = [
  { value: "COINS", label: "Coins" },
  { value: "MONEY", label: "Money" },
  { value: "BOTH", label: "Coins + Money" },
];

type SectionTag = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function AdminForm({
  sectionsList,
}: {
  sectionsList: SectionTag[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      type: "PROJECT_FILE",
      sections: [],
      description: "",
      thumbnail: "",
      fileUrl: "",
      videoUrl: "",
      paymentType: "COINS",
      priceMoney: 0,
      priceCoins: 0,
      isActive: true,
    },
  });

  const [state, formAction] = useActionState(createResource, undefined);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(
    null,
  );
  const [uploadedThumbnailName, setUploadedThumbnailName] = useState<
    string | null
  >(null);

  const watchedData = useWatch({
    control: form.control,
  });

  const preview = (watchedData as FormValues) || form.getValues();

  const sectionsController = useSectionsController(
    form.getValues("sections"),
    (val) => form.setValue("sections", val),
    sectionsList,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Resource created!");
      form.reset();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, form.reset, form]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 py-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Publish Marketplace Resource
        </h1>
        <p className="text-muted-foreground text-sm">
          Upload files, configure pricing, and manage marketplace visibility.
        </p>
      </div>

      <form action={formAction} className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
              <CardDescription>
                Information shown on the marketplace listing
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FieldGroup>
                {/* TITLE */}
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Title</FieldLabel>
                      <Input
                        {...field}
                        placeholder="Advanced Framer Motion Templates"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <input type="hidden" name="type" value={preview.type} />
                {/* TYPE */}
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Type</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {resourceTypes.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                {/* DESCRIPTION */}
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Description</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          rows={4}
                          placeholder="Explain what users will learn or download..."
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText>
                            {(field.value ?? "").length}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />

                <Controller
                  name="thumbnail"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Thumbnail Image URL</FieldLabel>
                      <Input {...field} placeholder="https://.../preview.jpg" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Used as the click-to-play preview to avoid loading the
                        video immediately.
                      </p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Input
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
                                field.onChange(url);
                                form.setValue("thumbnail", url, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
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
                        {preview.thumbnail && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              field.onChange("");
                              form.setValue("thumbnail", "", {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setUploadedThumbnailName(null);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove thumbnail
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                        {isUploadingThumbnail && (
                          <span className="flex items-center gap-1">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                            Uploading thumbnail...
                          </span>
                        )}
                        {uploadedThumbnailName && (
                          <span>Selected: {uploadedThumbnailName}</span>
                        )}
                        {preview.thumbnail && !isUploadingThumbnail && (
                          <Badge variant="outline" className="gap-1">
                            <Upload className="h-3 w-3" /> Ready
                          </Badge>
                        )}
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <input
                  type="hidden"
                  name="thumbnail"
                  value={preview.thumbnail ?? ""}
                />

                <Field>
                  <FieldLabel>Preview Video Upload (optional)</FieldLabel>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
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
                            form.setValue("videoUrl", url, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            toast.success("Video uploaded");
                          })
                          .catch((err) => {
                            console.error(err);
                            toast.error("Upload failed");
                            setUploadedVideoName(null);
                          })
                          .finally(() => setIsUploadingVideo(false));
                      }}
                    />

                    {preview.videoUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          form.setValue("videoUrl", "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setUploadedVideoName(null);
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove video
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a short preview video. Max size depends on your
                    Cloudinary plan.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                    {isUploadingVideo && (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />{" "}
                        Uploading...
                      </span>
                    )}
                    {uploadedVideoName && (
                      <span>Selected: {uploadedVideoName}</span>
                    )}
                    {preview.videoUrl && (
                      <Badge variant="outline" className="gap-1">
                        <Upload className="h-3 w-3" /> Uploaded
                      </Badge>
                    )}
                  </div>

                  <input
                    type="hidden"
                    name="videoUrl"
                    value={preview.videoUrl ?? ""}
                  />
                </Field>

                <Controller
                  name="sections"
                  control={form.control}
                  render={({ field }) => {
                    const {
                      newSectionName,
                      setNewSectionName,
                      handleCreateSection,
                    } = sectionsController;

                    return (
                      <Field>
                        <FieldLabel>Sections</FieldLabel>

                        <input
                          type="hidden"
                          name="sections"
                          value={JSON.stringify(field.value)}
                        />

                        {/* Select existing sections */}
                        <Select
                          onValueChange={(val) => {
                            if (!field.value.includes(val)) {
                              field.onChange([...field.value, val]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>

                          <SelectContent>
                            {sectionsList.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Selected badges (readonly, no delete) */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((id) => {
                            const section = sectionsList.find(
                              (s) => s.id === id,
                            );
                            if (!section) return null;
                            return (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="px-3 py-1 flex items-center gap-2"
                              >
                                {section.name}
                                <button
                                  type="button"
                                  aria-label={`Remove ${section.name}`}
                                  className="rounded-full p-1 hover:bg-muted"
                                  onClick={() =>
                                    field.onChange(
                                      field.value.filter((val) => val !== id),
                                    )
                                  }
                                >
                                  <X className="size-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>

                        {field.value.length > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="mt-2"
                            onClick={() => field.onChange([])}
                          >
                            Clear all sections
                          </Button>
                        )}

                        {/* Create new section */}
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newSectionName}
                            placeholder="New section name"
                            onChange={(e) => setNewSectionName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleCreateSection();
                              }
                            }}
                          />
                          <Button type="button" onClick={handleCreateSection}>
                            + Add
                          </Button>
                        </div>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </CardContent>
          </Card>

          {/* FILE & PRICING */}
          <Card>
            <CardHeader>
              <CardTitle>File & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Controller
                name="fileUrl"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Drive File ID or URL</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Paste Google Drive ID or link"
                      onBlur={(e) => {
                        const normalized = normalizeDriveUrl(e.target.value);
                        form.setValue("fileUrl", normalized, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </Field>
                )}
              />

              <input
                type="hidden"
                name="paymentType"
                value={preview.paymentType}
              />

              <Controller
                name="paymentType"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Payment Type</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentTypes.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <input
                type="hidden"
                name="priceMoney"
                value={preview.priceMoney}
              />
              <Controller
                name="priceMoney"
                control={form.control}
                render={({ field }) => {
                  const paymentType = form.getValues("paymentType");
                  return (
                    <Field>
                      <FieldLabel>Price (Money)</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        disabled={paymentType === "COINS"}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </Field>
                  );
                }}
              />

              <input
                type="hidden"
                name="priceCoins"
                value={preview.priceCoins}
              />
              <Controller
                name="priceCoins"
                control={form.control}
                render={({ field }) => {
                  const paymentType = form.getValues("paymentType");
                  return (
                    <Field>
                      <FieldLabel>Price (Coins)</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        disabled={paymentType === "MONEY"}
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </Field>
                  );
                }}
              />

              <input
                type="hidden"
                name="isActive"
                value={preview.isActive ? "true" : "false"}
              />
              <Controller
                name="isActive"
                control={form.control}
                render={({ field }) => (
                  <Field className="flex items-center justify-between border rounded-lg p-4">
                    <div className="space-y-1">
                      <FieldLabel>Visibility</FieldLabel>
                      <p className="text-xs text-muted-foreground">
                        Control if resource appears in marketplace
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* LIVE PREVIEW */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="size-4" />
                Marketplace Preview
              </CardTitle>
              <CardDescription>
                Simulated resource card users will see
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-xl border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {preview.type.replace("_", " ")}
                  </Badge>
                  <Badge variant={preview.isActive ? "default" : "secondary"}>
                    {preview.isActive ? "Active" : "Hidden"}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg">
                  {preview.title || "Untitled Resource"}
                </h3>

                {preview.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {preview.description}
                  </p>
                )}

                {preview.videoUrl ? (
                  <AspectRatio
                    ratio={16 / 9}
                    className="overflow-hidden rounded-lg border"
                  >
                    <video
                      src={preview.videoUrl}
                      className="h-full w-full object-cover"
                      controls
                      preload="metadata"
                    />
                  </AspectRatio>
                ) : preview.thumbnail ? (
                  <AspectRatio
                    ratio={16 / 9}
                    className="relative overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={preview.thumbnail}
                      alt="Thumbnail preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </AspectRatio>
                ) : (
                  <div className="text-xs text-muted-foreground rounded-lg border border-dashed p-3">
                    Optional preview video or thumbnail will show here.
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {preview.sections.length ? (
                    preview.sections.map((id) => {
                      const section = sectionsList.find((s) => s.id === id);
                      if (!section) return null;

                      return (
                        <Badge key={id} variant="secondary">
                          {section.name}
                        </Badge>
                      );
                    })
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No sections yet
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Coins className="size-4" />
                  {preview.paymentType === "MONEY"
                    ? `${preview.priceMoney} MONEY`
                    : preview.paymentType === "COINS"
                      ? `${preview.priceCoins} COINS`
                      : `${preview.priceCoins} COINS / ${preview.priceMoney} MONEY`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACTIONS PANEL */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Save draft or reset changes</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <BadgeCheck className="size-4 mr-2" />
                    Publish Resource
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => form.reset()}
              >
                Reset Form
              </Button>

              <p className="text-xs text-muted-foreground">
                Connect this form to your server action or API route to persist
                resources.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
