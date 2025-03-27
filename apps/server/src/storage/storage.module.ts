import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {} from "multer";

import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

@Module({
  imports: [],
  controllers: [StorageController],
  providers: [
    {
      provide: "AZURE_STORAGE_OPTIONS",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        accountName: configService.getOrThrow<string>("AZURE_ACCOUNT_NAME"),
        accountKey: configService.getOrThrow<string>("AZURE_ACCOUNT_KEY"),
        containerName: configService.getOrThrow<string>("AZURE_STORAGE_CONTAINER"),
        skipContainerCheck: configService.getOrThrow<boolean>("STORAGE_SKIP_BUCKET_CHECK"),
        storageUrl: configService.getOrThrow<string>("STORAGE_URL"),
        storageType: configService.get<string>("STORAGE_TYPE"),
      }),
    },
    StorageService,
  ],
  exports: [StorageService],
})
export class StorageModule {}
