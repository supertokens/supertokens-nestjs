import { createParamDecorator, ExecutionContext } from "@nestjs/common"

type SessionPropertyName =
  | "userId"
  | "tenantId"
  | "accessToken"
  | "accessTokenPayload"

// We are using a separate property decorator instead of just using @Session(propName)
// to enforce a more explicit usage of our APIs.
export const SessionProperty = createParamDecorator(
  (propName: SessionPropertyName, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const session = request.session
    if (!session) {
      throw new Error(`Session does not exist`)
    }
    const propNameCapitalized =
      propName.charAt(0).toUpperCase() + propName.slice(1)
    const getterName = `get${propNameCapitalized}`
    if (session[getterName]) {
      throw new Error(`Session property ${propName} does not exist`)
    }
    return session[getterName]()
  },
)
