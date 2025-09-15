import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
