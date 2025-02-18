import { Directive, Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ description: 'product' })
export class Product {
  @Field((type) => ID)
  id: string

  @Field()
  name: string

  @Field()
  category: string

  @Field()
  price: number

  @Field((tags) => [String])
  tags: string[]
}
