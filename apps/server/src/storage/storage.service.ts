import { Inject, Injectable } from "@nestjs/common";

import { IStorageProvider } from "./adapters/storage.adapter.interface";

@Injectable()
export class StorageService {
  constructor(@Inject("STORAGE_ADAPTER") private readonly storageAdapter: IStorageProvider) {}

  uploadObject(userId: string, type: string, buffer: Buffer, filename?: string): Promise<string> {
    return this.storageAdapter.uploadObject(userId, type, buffer, filename);
  }

  deleteObject(userId: string, type: string, filename: string): Promise<void> {
    return this.storageAdapter.deleteObject(userId, type, filename);
  }

  deleteFolder(prefix: string): Promise<void> {
    return this.storageAdapter.deleteFolder(prefix);
  }

  containerExists(): Promise<boolean> {
    return this.storageAdapter.containerExists();
  }
}
