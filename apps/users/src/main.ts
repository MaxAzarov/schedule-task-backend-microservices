import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('USERS_HOST'),
      port: configService.get('USERS_TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('USERS_HTTP_PORT'));
}
bootstrap();
