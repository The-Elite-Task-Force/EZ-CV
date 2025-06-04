import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client as MinioClient } from "minio";
import type {} from "multer";

import { AzureBlobStorageAdapter } from "./adapters/azure-storage.adapter";
import { MinioStorageAdapter } from "./adapters/minio-storage.adapter";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

@Module({
  controllers: [StorageController],
  providers: [
    {
      provide: "STORAGE_ADAPTER",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = configService.getOrThrow<string>("STORAGE_TYPE");
        const storageUrl = configService.getOrThrow<string>("STORAGE_URL");

        if (type === "minio") {
          const client = new MinioClient({
            endPoint: configService.getOrThrow("STORAGE_ENDPOINT"),
            port: configService.getOrThrow("STORAGE_PORT"),
            accessKey: configService.getOrThrow("STORAGE_ACCESS_KEY"),
            secretKey: configService.getOrThrow("STORAGE_SECRET_KEY"),
            useSSL: configService.getOrThrow("STORAGE_USE_SSL"),
          });
          const bucket = configService.getOrThrow("STORAGE_BUCKET");
          return new MinioStorageAdapter(client, bucket, storageUrl);
        }

        // default to Azure
        return new AzureBlobStorageAdapter(
          configService.getOrThrow("AZURE_ACCOUNT_NAME"),
          configService.getOrThrow("AZURE_ACCOUNT_KEY"),
          configService.getOrThrow("AZURE_STORAGE_CONTAINER"),
          storageUrl,
        );
      },
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
