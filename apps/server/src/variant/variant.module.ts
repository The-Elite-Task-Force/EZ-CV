import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { PrinterModule } from "../printer/printer.module";
import { ResumeModule } from "../resume/resume.module";
import { StorageModule } from "../storage/storage.module";
import { VariantController } from "./variant.controller";
import { VariantService } from "./variant.service";

@Module({
  imports: [AuthModule, StorageModule, PrinterModule, ResumeModule],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
