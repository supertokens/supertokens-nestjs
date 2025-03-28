import { ExecutionContext, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GqlExecutionContext, GraphQLModule } from '@nestjs/graphql'
import { DirectiveLocation, GraphQLDirective } from 'graphql'

import { ProductsModule } from './products/products.module'

import { SuperTokensModule, SuperTokensAuthGuard } from 'supertokens-nestjs'

import { appInfo, connectionURI, recipeList } from './config'

function contextDataExtractor(ctx: ExecutionContext) {
  const gqlContext = GqlExecutionContext.create(ctx)
  const contextObject = gqlContext.getContext()
  return {
    request: contextObject.req,
    response: contextObject.res,
  }
}

@Module({
  imports: [
    ProductsModule,
    SuperTokensModule.forRoot({
      framework: 'express',
      debug: true,
      supertokens: {
        connectionURI,
      },
      appInfo,
      recipeList,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      installSubscriptionHandlers: true,
      context: ({ req, res }) => {
        return { req, res }
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: () => {
        return new SuperTokensAuthGuard(contextDataExtractor)
      },
    },
  ],
})
export class AppModule {}
