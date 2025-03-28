import ThirdParty from 'supertokens-node/recipe/thirdparty'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Passwordless from 'supertokens-node/recipe/passwordless'
import Session from 'supertokens-node/recipe/session'
import Dashboard from 'supertokens-node/recipe/dashboard'
import UserRoles from 'supertokens-node/recipe/userroles'
import MultiFactorAuth from 'supertokens-node/recipe/multifactorauth'
import AccountLinking from 'supertokens-node/recipe/accountlinking'
import EmailVerification from 'supertokens-node/recipe/emailverification'
import TOTP from 'supertokens-node/recipe/totp'

export const appInfo = {
  appName: 'ST',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
}

export const connectionURI = 'https://try.supertokens.com'

export const recipeList = [
  EmailPassword.init(),
  ThirdParty.init({
    signInAndUpFeature: {
      providers: [
        // We have provided you with development keys which you can use for testing.
        // IMPORTANT: Please replace them with your own OAuth keys for production use.
        {
          config: {
            thirdPartyId: 'google',
            clients: [
              {
                clientId:
                  '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
                clientSecret: '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',
              },
            ],
          },
        },
        {
          config: {
            thirdPartyId: 'github',
            clients: [
              {
                clientId: '467101b197249757c71f',
                clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
              },
            ],
          },
        },
        {
          config: {
            thirdPartyId: 'apple',
            clients: [
              {
                clientId: '4398792-io.supertokens.example.service',
                additionalConfig: {
                  keyId: '7M48Y4RYDL',
                  privateKey:
                    '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
                  teamId: 'YWQCXGJRJL',
                },
              },
            ],
          },
        },
        {
          config: {
            thirdPartyId: 'twitter',
            clients: [
              {
                clientId: '4398792-WXpqVXRiazdRMGNJdEZIa3RVQXc6MTpjaQ',
                clientSecret:
                  'BivMbtwmcygbRLNQ0zk45yxvW246tnYnTFFq-LH39NwZMxFpdC',
              },
            ],
          },
        },
      ],
    },
  }),
  Passwordless.init({
    contactMethod: 'EMAIL_OR_PHONE',
    flowType: 'USER_INPUT_CODE_AND_MAGIC_LINK',
  }),
  EmailVerification.init({
    mode: 'REQUIRED',
  }),
  AccountLinking.init({
    shouldDoAutomaticAccountLinking: async () => ({
      shouldAutomaticallyLink: true,
      shouldRequireVerification: true,
    }),
  }),
  Session.init(),
  Dashboard.init(),
  UserRoles.init(),
]
