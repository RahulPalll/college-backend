import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createProduct(
    name: string,
    description: string,
    price: number,
  ): Promise<Product> {
    if (!name || !description || price <= 0) {
      throw new BadRequestException(
        'Invalid input: name, description, and price must be valid.',
      );
    }

    try {
      const product = this.productRepository.create({
        name,
        description,
        price,
      });
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create product: ${error.message}`,
      );
    }
  }

  async getProducts(
    search: string,
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    try {
      const query = this.productRepository.createQueryBuilder('product');

      // Add search filter
      if (search) {
        query.where(
          'product.name LIKE :search OR product.description LIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }

      // Pagination logic
      const [data, total] = await query
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return { data, total };
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve products: ${error.message}`,
      );
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
      }
      return product;
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve product: ${error.message}`,
      );
    }
  }

  async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    if (data.price && data.price <= 0) {
      throw new BadRequestException('Price must be greater than zero.');
    }

    try {
      const product = await this.getProductById(id); // Validate existence
      Object.assign(product, data); // Update fields
      return await this.productRepository.save(product);
    } catch (error) {
      throw new BadRequestException(
        `Failed to update product: ${error.message}`,
      );
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      const product = await this.getProductById(id); // Validate existence
      await this.productRepository.remove(product);
    } catch (error) {
      throw new BadRequestException(
        `Failed to delete product: ${error.message}`,
      );
    }
  }
}
