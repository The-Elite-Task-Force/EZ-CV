import {
  BlobServiceClient,
  ContainerClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Injectable, InternalServerErrorException, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createId } from "@paralleldrive/cuid2";
import slugify from "@sindresorhus/slugify";
import sharp from "sharp";

import { Config } from "../config/schema";

type ImageUploadType = "pictures" | "previews";
type DocumentUploadType = "resumes";
export type UploadType = ImageUploadType | DocumentUploadType;

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);

  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(private readonly configService: ConfigService<Config>) {}

  async onModuleInit() {
    const accountName = this.configService.getOrThrow<string>("AZURE_ACCOUNT_NAME");
    const accountKey = this.configService.getOrThrow<string>("AZURE_ACCOUNT_KEY");
    const containerName = this.configService.getOrThrow<string>("AZURE_STORAGE_CONTAINER");
    const skipContainerCheck = this.configService.getOrThrow<boolean>("STORAGE_SKIP_BUCKET_CHECK");
    const storageType = this.configService.getOrThrow<string>("STORAGE_TYPE");
    const credentials = new StorageSharedKeyCredential(accountName, accountKey);
    if (storageType == "azurite") {
      this.logger.warn("Azurite storage type is not supported in production.");
      this.blobServiceClient = new BlobServiceClient(
        `http://azurite:10000/${accountName}`,
        credentials,
      );
    } else {
      this.blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        credentials,
      );
    }
    this.containerClient = this.blobServiceClient.getContainerClient(containerName);

    if (skipContainerCheck) {
      this.logger.warn("Skipping the verification of whether the container exists.");
    } else {
      try {
        await this.containerClient.createIfNotExists();
        this.logger.log(`Successfully connected to the container "${containerName}".`);
      } catch (error) {
        throw new InternalServerErrorException(
          `Error creating/verifying Azure container: ${error.message}`,
        );
      }
    }
  }

  async uploadObject(
    userId: string,
    type: UploadType,
    buffer: Buffer,
    filename: string = createId(),
  ): Promise<string> {
    const extension = type === "resumes" ? "pdf" : "jpg";
    const storageUrl = this.configService.getOrThrow<string>("STORAGE_URL");

    let normalizedFilename = slugify(filename);
    if (!normalizedFilename) normalizedFilename = createId();

    const filepath = `${userId}/${type}/${normalizedFilename}.${extension}`;
    const url = `${storageUrl}/${filepath}`;

    if (extension === "jpg") {
      buffer = await sharp(buffer)
        .resize({ width: 600, height: 600, fit: sharp.fit.outside })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    try {
      const contentType = extension === "jpg" ? "image/jpeg" : "application/pdf";
      const blockBlobClient = this.containerClient.getBlockBlobClient(filepath);
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: contentType },
      });
      return url;
    } catch {
      throw new InternalServerErrorException("There was an error while uploading the file.");
    }
  }

  async deleteObject(userId: string, type: UploadType, filename: string): Promise<void> {
    const extension = type === "resumes" ? "pdf" : "jpg";
    const path = `${userId}/${type}/${filename}.${extension}`;

    try {
      const blobClient = this.containerClient.getBlockBlobClient(path);
      await blobClient.deleteIfExists();
    } catch {
      throw new InternalServerErrorException(
        `There was an error while deleting the document at the specified path: ${path}.`,
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
    } catch {
      throw new InternalServerErrorException(
        `There was an error while deleting the folder at the specified path: ${prefix}.`,
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
