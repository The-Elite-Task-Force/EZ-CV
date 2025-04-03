import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

import { CompanyService } from "../company.service";

export const ALLOWED_ROLES_KEY = "allowedRoles";
export const AllowedRoles = (...roles: string[]) => SetMetadata(ALLOWED_ROLES_KEY, roles);

@Injectable()
export class CompanyRoleGuard implements CanActivate {
  constructor(
    private readonly companyService: CompanyService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<string[]>(ALLOWED_ROLES_KEY, context.getHandler());
    if (!allowedRoles || allowedRoles.length === 0) {
      // If no roles specified, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: string } | undefined;
    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    // Check for company identifier in multiple ways.
    const companyId =
      request.params.id || request.body.company?.id || request.body.companyId || request.body.id;
    if (!companyId) {
      throw new ForbiddenException("Company identifier is missing");
    }

    const mapping = await this.companyService.getMapping(user.id, companyId);
    if (!mapping) {
      throw new ForbiddenException("User is not associated with the company");
    }

    if (mapping.role) {
      const userRole = mapping.role.name.toLowerCase();
      if (allowedRoles.includes(userRole)) {
        return true;
      } else {
        throw new ForbiddenException(
          `User with role '${mapping.role.name}' does not have the required privileges. ` +
            `Allowed roles are: ${allowedRoles.join(", ")}.`,
        );
      }
    } else {
      throw new ForbiddenException("User role information is missing in the mapping");
    }
  }
}
