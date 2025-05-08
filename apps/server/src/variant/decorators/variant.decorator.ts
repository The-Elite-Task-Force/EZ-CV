import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import type { VariantDto } from "@reactive-resume/dto";

export const Variant = createParamDecorator(
  (data: keyof VariantDto | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const variant = request.payload?.variant as VariantDto;

    return data ? variant[data] : variant;
  },
);
