import { Controller, Delete, Get, Patch, Post } from '@nestjs/common'

import { PublicAccess, Session, VerifySession } from 'supertokens-nestjs'

@Controller()
export class AppController {
  constructor() {}

  @Get('/product')
  @PublicAccess()
  listProducts() {
    return []
  }

  // This route will be protected by default
  // given that the SuperTokensAuthGuard was applied globally
  @Post('/product')
  addProduct() {
    return
  }

  @VerifySession({
    roles: ['admin'],
  })
  @Delete('/product')
  deleteProduct() {
    return
  }

  @VerifySession({
    roles: ['admin'],
    permissions: ['product.update'],
  })
  @Patch('/product/:productId')
  updateProduct() {
    return
  }

  @VerifySession({
    requireEmailVerification: true,
  })
  @Get('/account/profile')
  getAccountProfile(@Session('userId') userId: string) {
    return {}
  }

  @VerifySession({
    requireEmailVerification: false,
  })
  @Get('/account/settings')
  getAccountSettings(@Session('userId') userId: string) {
    return {}
  }

  @VerifySession({
    requireMFA: false,
  })
  @Get('/order')
  listOrders() {
    return []
  }

  @VerifySession({
    requireMFA: true,
  })
  @Patch('/order/:orderId')
  updateOrder() {
    return
  }

  @VerifySession({
    options: {
      checkDatabase: true,
    },
  })
  @Post('/order/:orderId/cancel')
  cancelOrder() {
    return
  }
}
