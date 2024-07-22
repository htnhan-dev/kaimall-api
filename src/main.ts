import * as cors from 'cors';
import * as morgan from 'morgan';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors
  app.use(cors());

  // enable morgan
  app.use(morgan('dev'));

  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const configDocument = new DocumentBuilder()
    .setTitle('API Document KaiZen Social')
    .setDescription('API Document KaiZen Social')
    .setVersion('1.0')
    .addServer('/api')
    .addBearerAuth(
      {
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your Access Token JWT token here'
      },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, configDocument);

  SwaggerModule.setup('api/document', app, document);

  // global prefix
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || 80;

  await app.listen(PORT, () => {
    console.log(`Server running in PORT - ${PORT}`);
  });
}
bootstrap();
