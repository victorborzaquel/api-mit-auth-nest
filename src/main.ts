import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.enableCors();

  const configService = app.get(ConfigService);

  const port = configService.get<number>('http.port');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('MIT')
    .setDescription('API for authentication and authorization')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
