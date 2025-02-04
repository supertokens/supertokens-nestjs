import { createParamDecorator, ExecutionContext } from '@nestjs/common'

type SessionPropertyName =
  | 'userId'
  | 'tenantId'
  | 'accessToken'
  | 'accessTokenPayload'

export const Session = createParamDecorator(
  (propName: SessionPropertyName | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const session = request.session
    if (!propName) return session
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
