import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common'
import supertokens from 'supertokens-node'
import { SUPERTOKENS_MODULE_OPTIONS } from './supertokens.constants'
import { SuperTokensModuleOptions } from './supertokens.types'
import { plugin } from 'supertokens-node/framework/fastify'

@Injectable()
export class SuperTokensService implements OnModuleInit {
  constructor(
    @Inject(SUPERTOKENS_MODULE_OPTIONS)
    private options: SuperTokensModuleOptions,
  ) {
    supertokens.init(this.options)
  }

  async onModuleInit() {
    if (this.options.framework === 'fastify') {
      if (!this.options.fastifyAdapter)
        throw new Error(
          'fastifyAdapter is required when using fastify as a framework',
        )
      await this.options.fastifyAdapter.register(plugin)
    }
  }
}
