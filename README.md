# SuperTokens Nestjs

## Internal

The library makes it easier for people to use SuperTokens in their NestJS applications.
It does that by exposing NestJS entities (modules, guards, decorators, etc.) that abstract some of the logic that a user would need to write by themselves.
That being said, the library **should not** include any additional functionality besides what you can create with the Node SDK.

### What do we expose?

- A `SuperTokensModule`
  It's used to save the configuration and then initialize the SDK through an internal service.

- A `SuperTokensAuthGuard`
  Abstracts logic that verifies if authentication and authorization requirements set on a method are met.
  It can be applied globally or on a per-controller basis.

- A set of decorators that can be grouped into the following categories:

  - Enforce auth requirements: `@Roles`, `@Permissions`, `@MFARequired`, `@EmailVerified`, `@SessionOptions`
  - Access session data: `@Session`, `@SessionProperty('propName')`

## Open Questions

- Is the current SDK init approach correct? The config differs in how you define the recipe list. You pass only the recipe config without calling the `init` (in order to ensure that SDK gets initialized before the recipes).
- Do we want to add/drop abstractions (decorators in particular)?
- What approach should we take in terms of defining decorators?
  Do we expose multiple ones (`Roles`, `Permissions`, etc.) or just a single decorator that accepts an options object (`Auth(options)`)?
  I would go with the latter. Adding a lot of decorators to a function would make it harder to read.

  ```ts
    @Post('/create')
    @Roles(['admin'])
    @Permissions(['create', 'update'])
    @MFARequired()
    @EmailVerified()
    async create(req: Request, res: Response) {}

    @Post('/create')
    @Auth({
      roles: ['admin'],
      permissions: ['create', 'update'],
      requireMFA: true,
      requireEmailVerification: true,
    })
    async create(req: Request, res: Response) {}
  ```

- Do we want to handle the GraphQL context?
- Can we also support fastify?

---

The `supertokens-nestjs` package includes utilities for using SuperTokens in a NestJS application.

## Prerequisites

```bash
npm install supertokens-node supertokens-nestjs
```

## Usage

### 1. Include the `SuperTokensModule` inside your main application module

### 2. Add the `SuperTokensAuthGuard` to protect your routes

### 3. Update your `bootstrap` function
