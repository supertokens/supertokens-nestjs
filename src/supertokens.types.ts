import {
  InjectionToken,
  OptionalFactoryDependency,
  ModuleMetadata,
  Type,
} from "@nestjs/common"

import { getSession } from "supertokens-node/recipe/session"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import ThirdParty from "supertokens-node/recipe/thirdparty"
import Passwordless from "supertokens-node/recipe/passwordless"
import Session from "supertokens-node/recipe/session"
import Dashboard from "supertokens-node/recipe/dashboard"
import UserRoles from "supertokens-node/recipe/userroles"

import supertokens from "supertokens-node"

interface Recipes {
  EmailPassword?: () => ReturnType<typeof EmailPassword.init>
  ThirdParty?: Parameters<typeof ThirdParty.init>[0]
  Passwordless?: Parameters<typeof Passwordless.init>[0]
  Session?: Parameters<typeof Session.init>[0]
  Dashboard?: Parameters<typeof Dashboard.init>[0]
  UserRoles?: Parameters<typeof UserRoles.init>[0]
}

type SuperTokensInitParams = Omit<
  Parameters<typeof supertokens.init>[0],
  "framework" | "recipeList"
> & { recipes: Recipes }

export type SuperTokensModuleOptions = SuperTokensInitParams & {
  global?: boolean
}

export interface SuperTokensModuleOptionsFactory {
  createSuperTokensModuleOptions():
    | Promise<SuperTokensModuleOptions>
    | SuperTokensModuleOptions
}

export interface SuperTokensModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  global?: boolean
  useExisting?: Type<SuperTokensModuleOptionsFactory>
  useClass?: Type<SuperTokensModuleOptionsFactory>
  useFactory?: (
    ...args: unknown[]
  ) =>
    | Promise<SuperTokensModuleOptionsFactory>
    | SuperTokensModuleOptionsFactory
  inject?: (InjectionToken | OptionalFactoryDependency)[]
}

export type AuthDecoratorOptions =
  | {
      permissions: string[]
    }
  | {
      roles: string[]
    }
  | {
      permissions: string[]
      roles: string[]
    }

export type SuperTokensSession = Awaited<ReturnType<typeof getSession>>
