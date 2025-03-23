import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { Storage } from '@google-cloud/storage';
import { PrismaClient } from "@prisma/client";

// Use the same environment variables as in upload-gcp route
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEYFILE_PATH,
});

const bucketName = process.env.GCP_BUCKET_NAME || "hearts-and-paws-bucket";
const bucket = storage.bucket(bucketName);
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the image URL and pet ID from the request
    const { imageUrl, petId } = await req.json();
    console.log("Delete request received for:", { imageUrl, petId });
    
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }
    
    // Verify that the user owns the pet if petId is provided
    if (petId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      });
      
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
  
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
        select: { ownerId: true, images: true },
      });
  
      if (!pet) {
        return NextResponse.json(
          { error: "Pet not found" },
          { status: 404 }
        );
      }
  
      // Ensure the authenticated user is the pet owner
      if (pet.ownerId !== user.id) {
        return NextResponse.json(
          { error: "You don't have permission to modify this pet" },
          { status: 403 }
        );
      }
      
      // Update the pet's images array to remove the deleted image
      const updatedImages = pet.images.filter(img => img !== imageUrl);
      
      await prisma.pet.update({
        where: { id: petId },
        data: { images: updatedImages },
      });
      
      console.log("Database updated successfully, removed image from pet");
    }

    // Extract the filename from the URL
    // Format: https://storage.googleapis.com/hearts-and-paws-bucket/rehomer-docs/filename.jpg
    try {
      const urlObj = new URL(imageUrl);
      const pathParts = urlObj.pathname.split('/');
      
      // Remove the first empty segment and the bucket name
      // The path will be like: "/hearts-and-paws-bucket/rehomer-docs/filename.jpg"
      // We want just: "rehomer-docs/filename.jpg"
      const filenamePath = pathParts.slice(2).join('/');
      
      console.log(`Attempting to delete file: ${filenamePath} from bucket: ${bucketName}`);
      
      await bucket.file(filenamePath).delete();
      console.log(`Successfully deleted image: ${filenamePath}`);
    } catch (storageError) {
      console.error('Error deleting from storage:', storageError);
      // We'll continue even if storage deletion fails, but let the client know
      return NextResponse.json({ 
        warning: "Image removed from pet profile, but deletion from storage failed",
        success: true 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: `Server error during deletion: ${error.message}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 