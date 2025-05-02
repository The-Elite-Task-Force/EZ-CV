import { Module } from "@nestjs/common";

import { AuthModule } from "@/server/auth/auth.module";

import { CompanyService } from "../company/company.service";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
  imports: [AuthModule],
  controllers: [ProjectController],
  providers: [ProjectService, CompanyService],
  exports: [ProjectService],
})
export class ProjectModule {}
