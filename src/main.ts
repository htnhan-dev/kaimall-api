import * as cors from 'cors';
import * as morgan from 'morgan';

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

  // global prefix
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || 80;

  await app.listen(PORT, () => {
    console.log(`Server running in PORT - ${PORT}`);
  });
}
bootstrap();
