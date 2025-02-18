![SuperTokens banner](https://raw.githubusercontent.com/supertokens/supertokens-logo/master/images/Artboard%20%E2%80%93%2027%402x.png)

# SuperTokens Nestjs

<a href="https://supertokens.com/discord">
<img src="https://img.shields.io/discord/603466164219281420.svg?logo=discord"
    alt="chat on Discord"></a>

## Description

The library makes it easier to use SuperTokens in NestJS applications.
It does that by exposing NestJS entities (modules, guards, decorators, etc.) which abstract some of the logic that a user would normally need to write by themselves.
That being said, the library **does not** include any additional functionality besides what you can create with the SuperTokens Node SDK.

## Usage

### 1. Install the dependencies

```bash
npm install supertokens-node supertokens-nestjs
```

### 2. Initialize the `SuperTokensModule` inside your main application module

```ts
import { Module } from '@nestjs/common'
import { SuperTokensModule } from 'supertokens-nestjs'

@Module({
  imports: [
    SuperTokensModule.forRoot({
      framework: 'express',
      supertokens: {
        connectionURI: '...',
      },
      appInfo: {
        appName: '...',
        apiDomain: '...',
        websiteDomain: '...',
      },
      recipeList: [
        /* ... */
      ],
    }),
  ],
  controllers: [
    /* ... */
  ],
  providers: [
    /* ... */
  ],
})
export class AppModule {}
```

### 3. Add the `SuperTokensAuthGuard` to protect your routes

#### Option 1: As a global guard

```ts
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { SuperTokensAuthGuard } from 'supertokens-nestjs'

@Module({
  imports: [
    /* ... */
  ],
  controllers: [
    /* ... */
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SuperTokensAuthGuard,
    },
  ],
})
export class AppModule {}
```

#### Option 2: As a controller guard

```ts
import { Controller, UseGuards } from '@nestjs/common'
import { SuperTokensAuthGuard } from 'supertokens-nestjs'

@Controller()
@UseGuards(SuperTokensAuthGuard)
export class AppController {}
```

### 4. Add the CORS config and the exception filter in your `bootstrap` function

```ts
import supertokens from 'supertokens-node'
import { SuperTokensExceptionFilter } from 'supertokens-nestjs'
import { appInfo } from './config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: [appInfo.websiteDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  })
  app.useGlobalFilters(new SuperTokensExceptionFilter())

  await app.listen(3001)
}
```

### 5. Use the provided decorators to customize the route protection logic and access the authentication state

```ts
import { Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { PublicAccess, Session, VerifySession } from 'supertokens-nestjs'

@Controller()
class AppController {
  @Get('/user')
  @VerifySession()
  async getUserInfo(@Session('userId') userId: string) {}

  @Get('/user/:userId')
  @VerifySession({
    roles: ['admin'],
  })
  async deleteUser() {}

  @Get('/user/profile')
  @PublicAccess()
  async getUserProfile() {}
}
```
