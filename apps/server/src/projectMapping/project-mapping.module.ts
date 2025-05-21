import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module";
import { CompanyService } from "../company/company.service";
import { ProjectMappingController } from "./project-mapping.controller";
import { ProjectMappingService } from "./project-mapping.service";

@Module({
  imports: [AuthModule],
  controllers: [ProjectMappingController],
  providers: [ProjectMappingService, CompanyService],
  exports: [ProjectMappingService],
})
export class ProjectMappingModule {}
