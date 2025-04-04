import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Request } from "express";

import { CompanyService } from "../company.service";

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  constructor(private readonly companyService: CompanyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    Logger.log("-----CompanyAdminGuard-------");

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user as { id: string } | undefined;
    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Check for company identifier in multiple ways:
    const companyId =
      request.params.id || request.body.company?.id || request.body.companyId || request.body.id; // For invite endpoints, you might pass companyId directly

    if (!companyId) {
      throw new ForbiddenException("Company identifier is missing");
    }

    const mapping = await this.companyService.getMapping(user.id, companyId);
    if (!mapping) {
      throw new ForbiddenException("User is not associated with the company");
    }

    if (
      mapping.role &&
      (mapping.role.name.toLowerCase() === "admin" || mapping.role.name.toLowerCase() === "owner")
    ) {
      return true;
    }

    throw new ForbiddenException("User does not have admin privileges");
  }
}
