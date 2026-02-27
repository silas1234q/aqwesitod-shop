import { v2 as cloudinary } from "cloudinary";
import { catchAsync } from "../utils/catchAsync.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const getUploadSignature = catchAsync(async (req, res) => {
  const { CLOUD_API_SECRET, CLOUD_API_KEY, CLOUD_NAME } = process.env;

  if (!CLOUD_API_SECRET || !CLOUD_API_KEY || !CLOUD_NAME) {
    return res.status(500).json({ message: "Cloudinary env vars missing" });
  }

  const timestamp = Math.round(Date.now() / 1000);

  // optional: force a folder (recommended)
  const folder = "aqwesitod/products";

  // Sign only what you will send to Cloudinary
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    CLOUD_API_SECRET
  );

  return res.json({
    timestamp,
    signature,
    apiKey: CLOUD_API_KEY,
    cloudName: CLOUD_NAME,
    folder,
  });
});