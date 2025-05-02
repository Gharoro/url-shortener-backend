import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setDescription('The URL shortener API documentation')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const logger = new Logger();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application running on port: ${port}`);
}

bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
