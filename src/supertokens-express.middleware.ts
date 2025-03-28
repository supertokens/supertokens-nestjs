import { Injectable, NestMiddleware } from '@nestjs/common'
import { middleware } from 'supertokens-node/framework/express'

type Middleware = ReturnType<typeof middleware>
type MiddlewareRequest = Parameters<Middleware>[0]

@Injectable()
export class SuperTokensExpressAuthMiddleware implements NestMiddleware {
  middleware: Middleware

  constructor() {
    this.middleware = middleware()
  }

  use(req: MiddlewareRequest, res: any, next: () => void) {
    return this.middleware(req, res, next)
  }
}
