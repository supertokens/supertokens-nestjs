import { Injectable, NestMiddleware } from "@nestjs/common"
import { middleware } from "supertokens-node/framework/express"

@Injectable()
export class SuperTokensExpressAuthMiddleware implements NestMiddleware {
  middleware: ReturnType<typeof middleware>

  constructor() {
    this.middleware = middleware()
  }

  use(req: Request, res: any, next: () => void) {
    return this.middleware(req, res, next)
  }
}
