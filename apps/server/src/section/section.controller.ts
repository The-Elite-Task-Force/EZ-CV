import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User as UserEntity } from "@prisma/client";
import { sectionSchemaWithData } from "@reactive-resume/schema";
import zodToJsonSchema from "zod-to-json-schema";

import { TwoFactorGuard } from "../auth/guards/two-factor.guard";
import { User } from "../user/decorators/user.decorator";
import { SectionService } from "./section.service";

@ApiTags("Section")
@Controller("section")
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get("schema")
  getSchema() {
    return zodToJsonSchema(sectionSchemaWithData);
  }

  @Get()
  @UseGuards(TwoFactorGuard)
  findAll(@User() user: UserEntity) {
    return this.sectionService.findAll(user.id);
  }
}
