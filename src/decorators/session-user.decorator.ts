import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const SessionUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // TODO: Handle GqlContext
    const request = ctx.switchToHttp().getRequest()
    return request.session
  },
)
