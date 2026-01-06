import { Controller, Get } from '@nestjs/common'
import { PublicAccess } from 'supertokens-nestjs'

@PublicAccess()
@Controller()
export class HealthController {
  @Get('/healthz')
  healthCheck() {
    return { status: 'ok', message: 'Healthy!' }
  }
}
