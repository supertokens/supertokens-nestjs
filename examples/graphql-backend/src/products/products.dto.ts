import { Field, InputType } from '@nestjs/graphql'
import { Length, MaxLength } from 'class-validator'

@InputType()
export class CreateProductInput {
  @Field()
  @MaxLength(30)
  name: string

  @Field()
  @Length(30)
  category: string

  @Field()
  price: number

  @Field((type) => [String])
  tags: string[]
}
