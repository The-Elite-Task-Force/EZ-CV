import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import type { ResumeDto, VariantDto } from "@reactive-resume/dto";

export const Resume = createParamDecorator(
  (data: keyof ResumeDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const resume = request.payload?.resume as ResumeDto | VariantDto;

    return data ? resume[data] : resume;
  },
);
