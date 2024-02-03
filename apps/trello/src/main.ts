import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { TrelloModule } from './trello.module';

async function bootstrap() {
  const app = await NestFactory.create(TrelloModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('TRELLO_HOST'),
      port: configService.get('TRELLO_TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('TRELLO_HTTP_PORT'));
}
bootstrap();
