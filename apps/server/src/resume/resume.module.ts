import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { PrinterModule } from "../printer/printer.module";
import { SearchModule } from "../search/search.module";
import { StorageModule } from "../storage/storage.module";
import { ResumeController } from "./resume.controller";
import { ResumeService } from "./resume.service";

@Module({
  imports: [AuthModule, PrinterModule, StorageModule, SearchModule],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
