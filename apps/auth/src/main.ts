import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('AUTH_HOST'),
      port: configService.get('AUTH_TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  app.listen(configService.get('AUTH_HTTP_PORT'));
}
bootstrap();
