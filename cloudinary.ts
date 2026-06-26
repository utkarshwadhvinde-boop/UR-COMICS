const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadToCloudinary(file: File, folder = "urcomics"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) throw new Error("Failed to upload image to Cloudinary");

  const data = await response.json();
  return data.secure_url;
}

export function getCloudinaryUrl(url: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
}) {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  const transforms = [];
  if (options?.width) transforms.push(`w_${options.width}`);
  if (options?.height) transforms.push(`h_${options.height}`);
  if (options?.quality) transforms.push(`q_${options.quality}`);
  else transforms.push("q_auto");
  transforms.push("f_auto");

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
}
