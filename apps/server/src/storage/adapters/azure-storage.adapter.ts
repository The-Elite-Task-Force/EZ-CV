import type { ContainerClient } from "@azure/storage-blob";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { InternalServerErrorException } from "@nestjs/common";
import { createId } from "@paralleldrive/cuid2";
import slugify from "@sindresorhus/slugify";
import sharp from "sharp";

import type { IStorageProvider } from "./storage.adapter.interface";

export class AzureBlobStorageAdapter implements IStorageProvider {
  private containerClient: ContainerClient;

  constructor(
    private accountName: string,
    private accountKey: string,
    private containerName: string,
    private storageUrl: string,
  ) {
    const credentials = new StorageSharedKeyCredential(accountName, accountKey);
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      credentials,
    );
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

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

    if (extension === "jpg") {
      buffer = await sharp(buffer)
        .resize({ width: 600, height: 600, fit: sharp.fit.outside })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const contentType = extension === "jpg" ? "image/jpeg" : "application/pdf";
    const blockBlobClient = this.containerClient.getBlockBlobClient(path);
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    return url;
  }

  async deleteObject(userId: string, type: string, filename: string): Promise<void> {
    const ext = type === "resumes" ? "pdf" : "jpg";
    const path = `${userId}/${type}/${filename}.${ext}`;

    try {
      const blobClient = this.containerClient.getBlockBlobClient(path);
      await blobClient.deleteIfExists();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while deleting blob: ${(error as Error).message}`,
      );
    }
  }

  async deleteFolder(prefix: string): Promise<void> {
    const deletes = [];
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      deletes.push(this.containerClient.deleteBlob(blob.name));
    }
    try {
      await Promise.all(deletes);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while deleting folder: ${(error as Error).message}`,
      );
    }
  }

  async containerExists(): Promise<boolean> {
    try {
      return await this.containerClient.exists();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while checking container existence: ${(error as Error).message}`,
      );
    }
  }
}
