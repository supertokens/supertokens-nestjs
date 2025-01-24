import { Injectable, NestMiddleware } from "@nestjs/common"
import { middleware } from "supertokens-node/framework/express"

// TODO: Figure out how to make this work with fastify
@Injectable()
export class SuperTokensAuthMiddleware implements NestMiddleware {
  middleware: ReturnType<typeof middleware>

  constructor() {
    this.middleware = middleware()
  }

  use(req: Request, res: any, next: () => void) {
    return this.middleware(req, res, next)
  }
}
