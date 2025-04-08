import { NotFoundException } from '@nestjs/common'
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql'
import { PubSub } from 'graphql-subscriptions'
import { CreateProductInput } from './products.dto'
import { Product } from './products.model'
import { ProductsService } from './products.service'

import { PublicAccess, Session, VerifySession } from 'supertokens-nestjs'

import { GqlExecutionContext } from '@nestjs/graphql'

const pubSub = new PubSub()

@Resolver((of) => Product)
export class ProductsResolver {
  constructor(private readonly productService: ProductsService) {}

  // This route will be protected by default
  // given that the SuperTokensVerifySessionGuard was applied globally
  @Query((returns) => Product)
  async product(@Args('id') id: string): Promise<Product> {
    const recipe = await this.productService.findOneById(id)
    if (!recipe) {
      throw new NotFoundException(id)
    }
    return recipe
  }

  @PublicAccess()
  @Query((returns) => [Product])
  recipes(): Promise<Product[]> {
    return this.productService.findAll()
  }

  @VerifySession({
    roles: ['admin'],
  })
  @Mutation((returns) => Product)
  async addProduct(
    @Args('createProductPayload') createProductInput: CreateProductInput,
  ): Promise<Product> {
    const product = await this.productService.create(createProductInput)
    pubSub.publish('productCreated', { product })
    return product
  }

  @VerifySession({
    roles: ['admin'],
    permissions: ['product.update'],
  })
  @Mutation((returns) => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('updateProductPayload') updateProductInput: CreateProductInput,
  ) {
    return this.productService.update(id, updateProductInput)
  }

  @VerifySession({
    requireMFA: false,
  })
  @Mutation((returns) => Boolean)
  async removeProduct(@Args('id') id: string) {
    return this.productService.remove(id)
  }

  @Subscription((returns) => Product)
  productCreated() {
    return pubSub.asyncIterableIterator('productCreated')
  }
}
