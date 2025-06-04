import { InternalServerErrorException } from "@nestjs/common";
import { createId } from "@paralleldrive/cuid2";
import slugify from "@sindresorhus/slugify";
import type { Client as MinioClient } from "minio";
import sharp from "sharp";

import type { IStorageProvider } from "./storage.adapter.interface";

export class MinioStorageAdapter implements IStorageProvider {
  constructor(
    private client: MinioClient,
    private bucketName: string,
    private storageUrl: string,
  ) {}

  async uploadObject(
    userId: string,
    type: string,
    buffer: Buffer,
    filename: string = createId(),
  ): Promise<string> {
    const extension = type === "resumes" ? "pdf" : "jpg";
    const normalizedFilename = slugify(filename) || createId();
    const path = `${userId}/${type}/${normalizedFilename}.${extension}`;
    const url = `${this.storageUrl}/${path}`;

    const meta =
      extension === "jpg"
        ? { "Content-Type": "image/jpeg" }
        : {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${normalizedFilename}.${extension}`,
          };

    if (extension === "jpg") {
      buffer = await sharp(buffer)
        .resize({ width: 600, height: 600, fit: sharp.fit.outside })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    await this.client.putObject(this.bucketName, path, buffer, buffer.length, meta);
    return url;
  }

  async deleteObject(userId: string, type: string, filename: string): Promise<void> {
    const ext = type === "resumes" ? "pdf" : "jpg";
    const path = `${userId}/${type}/${filename}.${ext}`;
    await this.client.removeObject(this.bucketName, path);
  }

  async deleteFolder(prefix: string): Promise<void> {
    const stream = this.client.listObjectsV2(this.bucketName, prefix, true);
    const keys: string[] = [];
    for await (const obj of stream) {
      keys.push(obj.name);
    }
    await this.client.removeObjects(this.bucketName, keys);
  }

  async containerExists(): Promise<true> {
    const exists = await this.client.bucketExists(this.bucketName);

    if (!exists) {
      throw new InternalServerErrorException(
        "There was an error while checking if the storage bucket exists.",
      );
    }
    return exists;
  }
}
