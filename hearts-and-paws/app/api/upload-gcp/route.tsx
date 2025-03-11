// app/api/upload-gcp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { IncomingForm, File as FormFile } from "formidable";
import path from "path";
import { PassThrough } from "stream";
import { IncomingMessage } from "http";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Get the entire request body as an ArrayBuffer and convert it to a Buffer
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a PassThrough stream and end it with the buffer data
    const stream = new PassThrough();
    stream.end(buffer);

    // Cast the stream as an IncomingMessage and manually set headers
    const fakeReq = stream as unknown as IncomingMessage;
    fakeReq.headers = {
      "content-length": buffer.length.toString(),
      "content-type": req.headers.get("content-type") || "",
    };

    // Parse incoming form data with formidable
    const formData = await new Promise<{ files: FormFile[] }>(
      (resolve, reject) => {
        const form = new IncomingForm({
          maxFileSize: 5 * 1024 * 1024, // 5MB limit
          keepExtensions: true,
        });

        form.parse(fakeReq, (err, fields, files) => {
          if (err) {
            return reject(err);
          }
          const filesArray: FormFile[] = [];
          for (const key in files) {
            const fileOrFiles = files[key];
            if (Array.isArray(fileOrFiles)) {
              filesArray.push(...fileOrFiles);
            } else if (fileOrFiles) {
              filesArray.push(fileOrFiles);
            }
          }
          resolve({ files: filesArray });
        });
      }
    );

    // Initialize GCS
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEYFILE_PATH,
    });
    const bucketName = process.env.GCP_BUCKET_NAME || "my-bucket";
    const bucket = storage.bucket(bucketName);

    const urls: string[] = [];

    // Upload each file to GCS
    for (const file of formData.files) {
      const ext = path.extname(file.originalFilename || "");
      const fileName = `rehomer-docs/${Date.now()}-${file.newFilename}${ext}`;

      await bucket.upload(file.filepath, {
        destination: fileName,
        resumable: false,
      });

      // Note: Removed makePublic() since uniform bucket-level access is enabled.
      // Ensure your bucket's IAM policy grants 'Storage Object Viewer' to 'allUsers' for public access.

      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      urls.push(publicUrl);
    }

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("Error uploading to GCP:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
