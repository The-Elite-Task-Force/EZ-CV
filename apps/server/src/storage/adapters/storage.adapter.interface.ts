export type IStorageProvider = {
  uploadObject(userId: string, type: string, buffer: Buffer, filename?: string): Promise<string>;

  deleteObject(userId: string, type: string, filename: string): Promise<void>;

  deleteFolder(prefix: string): Promise<void>;

  containerExists(): Promise<boolean>;
};
