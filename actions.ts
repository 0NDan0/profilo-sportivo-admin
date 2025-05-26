"use server";

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { nanoid } from "nanoid";

export async function onSubmit(
  formData: FormData,
  onProgress: (progressEvent: ProgressEvent) => void,
  onComplete: (fileUrl: string | null) => void
) {
  const entries = Object.fromEntries(formData.entries());
  console.log("Form data:", entries);

  try {
    const client = new S3Client({
      region: "eu-north-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!
      }
    });

    const key = nanoid();

    const { url, fields } = await createPresignedPost(client, {
      Bucket: "profilo-sportivo",
      Key: key
    });

    console.log("Presigned URL:", url);
    console.log("Presigned fields:", fields);

    const formDataS3 = new FormData();
    Object.entries(fields).forEach(([name, value]) => {
      formDataS3.append(name, value);
    });
    formDataS3.append("file", formData.get("file") as Blob);

    console.log("Uploading to:", url, fields);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(event);
      }
    });

    xhr.onload = () => {
      const fileUrl = `https://profilo-sportivo.s3.eu-north-1.amazonaws.com/${key}`;
      if (xhr.status === 200) {
        console.log("Upload successful:", fileUrl);
        onComplete(fileUrl);
      } else {
        console.log("Upload completed with status", xhr.status, fileUrl);
        onComplete(fileUrl);
      }
    };

    xhr.onerror = () => {
      console.error("Error during file upload.");
      onComplete(null);
    };

    xhr.send(formDataS3);

  } catch (e) {
    console.error("Error:", e);
    onComplete(null);
  }
}

// import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// import { NextApiRequest, NextApiResponse } from "next";

// const ses = new SESClient({
//     region: 'eu-north-1', // metti la tua regione
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
//   });
  
//   export async function fetchFile(fileUrl: string): Promise<Blob | null> {
//     try {
//       const response = await fetch(fileUrl);
  
//       if (response.ok) {
//         const fileBlob = await response.blob();
//         console.log("File fetched successfully");
//         return fileBlob;
//       } else {
//         console.error("Failed to fetch file:", response.statusText);
//         return null;
//       }
//     } catch (e) {
//       console.error("Error fetching file:", e);
//       return null;
//     }
//   }
  
  // export async function handler(req: NextApiRequest, res: NextApiResponse) {
  //   if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  
  //   const { to, subject, body } = req.body;
  
  //   const params = {
  //     Destination: {
  //       ToAddresses: "fabio.cattaneo.0507@gmail.com",
  //     },
  //     Message: {
  //       Body: {
  //         Html: {
  //           Data: "dasjuidsani",
  //         },
  //       },
  //       Subject: {
  //         Data: "danskj",
  //       },
  //     },
  //     Source: "profilosportivo2025@gmail.com"
  //   };
  
  //   try {
  //     const command = new SendEmailCommand(params);
  //     const result = await ses.send(command);
  //     res.status(200).json({ messageId: result.MessageId });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: 'Errore nell\'invio email' });
  //   }
  // }