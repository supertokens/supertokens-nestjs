import { Controller, Delete, Get, Patch, Post } from '@nestjs/common'

import { PublicAccess, Auth, Session, VerifySession } from 'supertokens-nestjs'

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

  @Auth({
    roles: ['admin'],
  })
  @Delete('/product')
  deleteProduct() {
    return
  }

  @Auth({
    roles: ['admin'],
    permissions: ['product.update'],
  })
  @Patch('/product/:productId')
  updateProduct() {
    return
  }

  @Auth({
    requireEmailVerification: true,
  })
  @Get('/account/profile')
  getAccountProfile(@Session('userId') userId: string) {
    return {}
  }

  @Auth({
    requireEmailVerification: false,
  })
  @Get('/account/settings')
  getAccountSettings(@Session('userId') userId: string) {
    return {}
  }

  @Auth({
    requireMFA: false,
  })
  @Get('/order')
  listOrders() {
    return []
  }

  @Auth({
    requireMFA: true,
  })
  @Patch('/order/:orderId')
  updateOrder() {
    return
  }

  @VerifySession({
    checkDatabase: true,
  })
  @Post('/order/:orderId/cancel')
  cancelOrder() {
    return
  }
}
