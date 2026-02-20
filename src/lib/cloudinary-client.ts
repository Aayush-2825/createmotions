type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  playback_url?: string;
  resource_type: "image" | "video" | "raw";
};

type CloudinaryError = {
  error?: {
    message?: string;
  };
};

type ResourceType = "image" | "video" | "raw";

function getCloudinaryConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Missing Cloudinary env variables: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    );
  }

  return { cloudName, uploadPreset };
}

async function uploadToCloudinary(
  file: File,
  resourceType: ResourceType,
  folder: string,
): Promise<CloudinaryUploadResponse> {
  const { cloudName, uploadPreset } = getCloudinaryConfig();

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  let res: Response;

  try {
    res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Network error while uploading to Cloudinary");
  }

  let data: CloudinaryUploadResponse & CloudinaryError;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid response from Cloudinary");
  }

  if (!res.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed");
  }

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return a secure URL");
  }

  return data;
}

function validateFile(file: File, type: ResourceType) {
  const MAX_VIDEO_MB = 200;
  const MAX_IMAGE_MB = 10;

  const sizeMB = file.size / (1024 * 1024);

  if (type === "video" && sizeMB > MAX_VIDEO_MB) {
    throw new Error(`Video must be smaller than ${MAX_VIDEO_MB}MB`);
  }

  if (type === "image" && sizeMB > MAX_IMAGE_MB) {
    throw new Error(`Image must be smaller than ${MAX_IMAGE_MB}MB`);
  }
}

export async function uploadVideoClient(file: File): Promise<string> {
  validateFile(file, "video");

  try {
    const res = await uploadToCloudinary(file, "video", "resources/videos");
    return res.secure_url;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";

    const videoDisabled = /video.*disabled|disabled.*video/i.test(message);

    if (!videoDisabled) {
      throw err;
    }

    // fallback
    const res = await uploadToCloudinary(file, "raw", "resources/videos");
    return res.secure_url;
  }
}

export async function uploadImageClient(file: File): Promise<string> {
  validateFile(file, "image");

  const res = await uploadToCloudinary(
    file,
    "image",
    "resources/thumbnails",
  );

  return res.secure_url;
}