import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  // Log Environment Variables
  logger.log(`PORT: ${process.env.PORT || 3000}`);
  logger.log(`DATABASE_HOST: ${process.env.DATABASE_HOST}`);
  logger.log(`DATABASE_PORT: ${process.env.DATABASE_PORT}`);
  logger.log(`DATABASE_USER: ${process.env.DATABASE_USER}`);
  logger.log(`DATABASE_NAME: ${process.env.DATABASE_NAME}`);
  logger.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);

  // Enable CORS (Optional, if needed)
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('College API')
    .setDescription('API documentation for managing college data')
    .setVersion('1.0')
    .addTag('colleges')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
