import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { ResumeModule } from "../resume/resume.module";
import { VariantController } from "./variant.controller";
import { VariantService } from "./variant.service";

@Module({
  imports: [AuthModule, ResumeModule],
  controllers: [VariantController],
  providers: [VariantService],
  exports: [VariantService],
})
export class VariantModule {}
