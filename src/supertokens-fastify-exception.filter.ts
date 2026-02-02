import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Error as STError } from 'supertokens-node'
import { errorHandler } from 'supertokens-node/framework/fastify'

@Catch(STError)
export class SuperTokensFastifyExceptionFilter implements ExceptionFilter {
  private handler: ReturnType<typeof errorHandler>

  constructor() {
    this.handler = errorHandler()
  }

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    this.handler(exception, ctx.getRequest(), ctx.getResponse())
  }
}
