const URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function uploadToCloudinary(file: File) {
  // 1) get signature from backend
  const sigRes = await fetch(`${URL}/cloudinary/cloudinary-signature`);
  if (!sigRes.ok) throw new Error("Failed to get Cloudinary signature");

  const { timestamp, signature, apiKey, cloudName, folder } = await sigRes.json();

  // 2) prepare form data
  const formData = new FormData();
  formData.append("file", file);                 // ✅ web: File object
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  // optional but common
  if (folder) formData.append("folder", folder);

  // 3) upload
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData, // ✅ do NOT set Content-Type
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? "Cloudinary upload failed");
  }

  return data.secure_url as string;
}