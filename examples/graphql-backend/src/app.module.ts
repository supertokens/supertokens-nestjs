import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { DirectiveLocation, GraphQLDirective } from 'graphql'

import { ProductsModule } from './products/products.module'

import { SuperTokensModule, SuperTokensAuthGuard } from 'supertokens-nestjs'

import { appInfo, connectionURI, recipeList } from './config'

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
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class AppModule {}
