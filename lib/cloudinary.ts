// import { v2 as cloudinary } from "cloudinary"

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// export async function uploadImage(base64Image: string, folder = "ai-roast-uploads"): Promise<string> {
//   try {
//     const result = await cloudinary.uploader.upload(base64Image, {
//       folder,
//       resource_type: "image",
//       transformation: [{ width: 800, height: 800, crop: "limit" }, { quality: "auto" }, { format: "webp" }],
//     })

//     return result.secure_url
//   } catch (error) {
//     console.error("Cloudinary upload error:", error)
//     throw new Error("Failed to upload image")
//   }
// }

// export async function deleteImage(publicId: string): Promise<void> {
//   try {
//     await cloudinary.uploader.destroy(publicId)
//   } catch (error) {
//     console.error("Cloudinary delete error:", error)
//     throw new Error("Failed to delete image")
//   }
// }

// export default cloudinary
