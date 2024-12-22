import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { RolesGuard } from '../auth/roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles.enum';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The name of the product' },
        description: {
          type: 'string',
          description: 'A short description of the product',
        },
        price: { type: 'number', description: 'The price of the product' },
      },
      required: ['name', 'description', 'price'],
    },
  })
  async createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    const product = await this.productsService.createProduct(
      name,
      description,
      price,
    );
    return {
      message: 'Product created successfully',
      product,
    };
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description:
      'Optional search term to filter products by name or description',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products per page (default: 10)',
  })
  async getProducts(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const result = await this.productsService.getProducts(search, page, limit);
    return {
      message: 'Products fetched successfully',
      data: result.data,
      total: result.total,
      page,
      limit,
    };
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    const product = await this.productsService.getProductById(id);
    return {
      message: 'Product fetched successfully',
      product,
    };
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    type: Number,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The new name of the product (optional)',
        },
        description: {
          type: 'string',
          description: 'The new description of the product (optional)',
        },
        price: {
          type: 'number',
          description: 'The new price of the product (optional)',
        },
      },
    },
  })
  async updateProduct(
    @Param('id') id: number,
    @Body()
    updateData: Partial<{ name: string; description: string; price: number }>,
  ) {
    const product = await this.productsService.updateProduct(id, updateData);
    return {
      message: 'Product updated successfully',
      product,
    };
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteProduct(@Param('id') id: number) {
    await this.productsService.deleteProduct(id);
    return {
      message: `Product with ID ${id} deleted successfully`,
    };
  }
}
