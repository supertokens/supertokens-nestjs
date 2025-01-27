import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

import { PublicAccess } from 'supertokens/nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @PublicAccess()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  getProtected(): string {
    return 'protected';
  }
}
