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

export type SuperTokensSession = Awaited<ReturnType<typeof getSession>>
