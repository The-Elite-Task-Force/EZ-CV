import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { ResumeModule } from "../resume/resume.module";
import { SectionItemController } from "./section-item.controller";
import { SectionItemService } from "./section-item.service";

@Module({
  imports: [AuthModule, ResumeModule],
  controllers: [SectionItemController],
  providers: [SectionItemService],
  exports: [SectionItemService],
})
export class SectionItemModule {}
