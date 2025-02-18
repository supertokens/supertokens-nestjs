import { Injectable } from '@nestjs/common'
import { CreateProductInput } from './products.dto'
import { Product } from './products.model'

@Injectable()
export class ProductsService {
  async create(data: CreateProductInput): Promise<Product> {
    return {} as any
  }

  async update(id: string, data: CreateProductInput): Promise<Product> {
    return {} as any
  }

  async findOneById(id: string): Promise<Product> {
    return {} as any
  }

  async findAll(): Promise<Product[]> {
    return [] as Product[]
  }

  async remove(id: string): Promise<boolean> {
    return true
  }
}
