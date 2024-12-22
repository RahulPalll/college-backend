import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { City } from './entities/city.entity';
import { State } from './entities/state.entity';
import { College } from './entities/college.entity';
import { CollegePlacement } from './entities/college-placement.entity';
import { CollegeWiseCourse } from './entities/college-wise-course.entity';
import { CollegesModule } from './colleges/colleges.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    // ConfigModule to load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),

    // TypeOrmModule for PostgreSQL connection
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      College,
      City,
      State,
      CollegePlacement,
      CollegeWiseCourse,
      Product,
    ]),
    CollegesModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
