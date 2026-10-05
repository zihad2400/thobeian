import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const user = await getCurrentUser();

    if (!user || !["admin", "superadmin"].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          message: "No image file provided",
        },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be 10MB or less",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "thobeian/products",
          resource_type: "image",
          transformation: [
            {
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Image uploaded successfully",
        image: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("========== CLOUDINARY UPLOAD ERROR ==========");
    console.error("name:", error?.name);
    console.error("message:", error?.message);
    console.error("http_code:", error?.http_code);
    console.error("error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Image upload failed",
      },
      { status: error?.http_code || 500 }
    );
  }
}
