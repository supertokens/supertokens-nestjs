import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { GqlExceptionFilter, GqlArgumentsHost } from '@nestjs/graphql'
import { errorHandler } from 'supertokens-node/framework/express'
import { Error as STError } from 'supertokens-node'
import { GraphQLError } from 'graphql'

@Catch(STError)
export class AppExceptionFilter implements ExceptionFilter {
  handler: ReturnType<typeof errorHandler>

  constructor() {
    this.handler = errorHandler()
  }

  catch(exception: Error, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host)
    const ctx = gqlHost.getContext()

    return new GraphQLError(exception.message, {
      extensions: {
        code: 401,
        statusCode: 401,
      },
    })
  }
}
