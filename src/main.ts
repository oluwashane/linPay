import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  await app.listen(port, () =>
    console.log(`Server is currently run on in port ${port}`),
  );
}
bootstrap();
