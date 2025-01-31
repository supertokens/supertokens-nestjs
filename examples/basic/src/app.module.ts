import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';

import { SuperTokensModule, SuperTokensAuthGuard } from 'supertokens-nestjs';

export const appInfo = {
  // Learn more about this on https://supertokens.com/docs/thirdpartypasswordless/appInfo
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};

export const connectionUri = 'https://try.supertokens.com';

export const recipeList = [];

@Module({
  imports: [
    SuperTokensModule.forRoot({
      framework: 'express',
      debug: true,
      supertokens: {
        connectionURI: connectionUri,
      },
      appInfo,
      recipeList: [EmailPassword.init(), Session.init()],
      // recipes: {
      //   EmailPassword: {},
      // Passwordless.init({
      //   contactMethod: 'EMAIL_OR_PHONE',
      //   flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
      // }),
      // ThirdParty.init({
      //   signInAndUpFeature: {
      //     providers: [
      //       // We have provided you with development keys which you can use for testing.
      //       // IMPORTANT: Please replace them with your own OAuth keys for production use.
      //       {
      //         config: {
      //           thirdPartyId: 'google',
      //           clients: [
      //             {
      //               clientId:
      //                 '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
      //               clientSecret: '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',
      //             },
      //           ],
      //         },
      //       },
      //       {
      //         config: {
      //           thirdPartyId: 'github',
      //           clients: [
      //             {
      //               clientId: '467101b197249757c71f',
      //               clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
      //             },
      //           ],
      //         },
      //       },
      //       {
      //         config: {
      //           thirdPartyId: 'apple',
      //           clients: [
      //             {
      //               clientId: '4398792-io.supertokens.example.service',
      //               additionalConfig: {
      //                 keyId: '7M48Y4RYDL',
      //                 privateKey:
      //                   '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
      //                 teamId: 'YWQCXGJRJL',
      //               },
      //             },
      //           ],
      //         },
      //       },
      //       {
      //         config: {
      //           thirdPartyId: 'twitter',
      //           clients: [
      //             {
      //               clientId: '4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ',
      //               clientSecret:
      //                 'BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC',
      //             },
      //           ],
      //         },
      //       },
      //     ],
      //   },
      // }),
      // Session: {},
      // Dashboard.init(),
      // UserRoles.init(),
      // },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class AppModule {}
