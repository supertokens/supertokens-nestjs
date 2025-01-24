import {
  MiddlewareConsumer,
  Module,
  Provider,
  DynamicModule,
  Global,
} from "@nestjs/common"

import { SuperTokensAuthMiddleware } from "./supertokens.middleware"
import { SUPERTOKENS_MODULE_OPTIONS } from "./supertokens.constants"
import { SupertokensService } from "./supertokens.service"

import {
  SuperTokensModuleOptions,
  SuperTokensModuleOptionsFactory,
  SuperTokensModuleAsyncOptions,
} from "./supertokens.types"

@Module({
  providers: [SupertokensService],
  exports: [],
  controllers: [],
})
export class SuperTokensModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SuperTokensAuthMiddleware).forRoutes("*")
  }

  static forRoot(options: SuperTokensModuleOptions): DynamicModule {
    const { global = true } = options
    return {
      module: SuperTokensModule,
      global,
      providers: [
        {
          useValue: options,
          provide: SUPERTOKENS_MODULE_OPTIONS,
        },
        SupertokensService,
      ],
    }
  }

  static forRootAsync(options: SuperTokensModuleAsyncOptions): DynamicModule {
    const { global = true } = options

    return {
      module: SuperTokensModule,
      global,
      imports: options.imports || [],
      providers: [...this.createAsyncProviders(options)],
    }
  }

  private static createAsyncProviders(
    options: SuperTokensModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }
    if (options.useClass) {
      return [
        this.createAsyncOptionsProvider(options),
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ]
    }

    throw new Error("Invalid configuration options")
  }

  private static createAsyncOptionsProvider(
    options: SuperTokensModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SUPERTOKENS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }
    if (options.useExisting) {
      return {
        provide: SUPERTOKENS_MODULE_OPTIONS,
        useFactory: async (optionsFactory: SuperTokensModuleOptionsFactory) =>
          await optionsFactory.createSuperTokensModuleOptions(),
        inject: [options.useExisting],
      }
    }
    throw new Error("Invalid configuration options")
  }
}
