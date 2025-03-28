import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'

import { errorHandler } from 'supertokens-node/framework/express'
import { Error as STError } from 'supertokens-node'

@Catch(STError)
export class SuperTokensExceptionFilter implements ExceptionFilter {
  handler: ReturnType<typeof errorHandler>

  constructor() {
    this.handler = errorHandler()
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const resp = ctx.getResponse()

    this.handler(exception, ctx.getRequest(), resp, ctx.getNext())
  }
}
