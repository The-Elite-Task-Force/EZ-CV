import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { UserWithSecrets } from "@reactive-resume/dto";
import { ERROR_MESSAGE } from "@reactive-resume/utils";
import { Request } from "express";

import { VariantService } from "../variant.service";

@Injectable()
export class VariantGuard implements CanActivate {
  constructor(private readonly variantService: VariantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserWithSecrets | false;

    try {
      const variant = await this.variantService.findOne(
        request.params.id,
        user ? user.id : undefined,
      );

      // First check if the resume is publicpage, if yes, attach the resume to there request payload.
      if (variant.visibility === "public") {
        request.payload = { variant };
      }

      // If the resume is private and the user is authenticated and is the owner of the resume, attach the resume to the request payload.
      // Else, if either the user is not authenticated or is not the owner of the resume, throw a 404 error.
      if (variant.visibility === "private") {
        if (user && user.id === variant.userId) {
          request.payload = { variant };
        } else {
          throw new NotFoundException(ERROR_MESSAGE.ResumeNotFound);
        }
      }

      return true;
    } catch {
      throw new NotFoundException(ERROR_MESSAGE.ResumeNotFound);
    }
  }
}
