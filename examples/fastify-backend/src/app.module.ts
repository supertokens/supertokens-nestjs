import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { AppController } from './app.controller'

import { SuperTokensModule, SuperTokensAuthGuard } from 'supertokens-nestjs'

import { appInfo, connectionURI, recipeList } from './config'

@Module({
  imports: [
    SuperTokensModule.forRoot({
      framework: 'express',
      debug: true,
      supertokens: {
        connectionURI,
      },
      appInfo,
      recipeList,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class AppModule {}
