import {
  InjectionToken,
  OptionalFactoryDependency,
  ModuleMetadata,
  Type,
} from "@nestjs/common"

import { getSession } from "supertokens-node/recipe/session"
import { FastifyAdapter } from "@nestjs/platform-fastify"
import { TypeInput } from "supertokens-node/types"

export type SuperTokensModuleOptions = TypeInput & {
  framework: "express" | "fastify"
  fastifyAdapter?: FastifyAdapter
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
  ) => Promise<SuperTokensModuleOptions> | SuperTokensModuleOptions
  inject?: (InjectionToken | OptionalFactoryDependency)[]
}

export type SuperTokensSession = Awaited<ReturnType<typeof getSession>>

export type AuthDecoratorOptions = {
  roles?: string[]
  permissions?: string[]
  requireEmailVerification?: boolean
  requireMFA?: boolean
}
