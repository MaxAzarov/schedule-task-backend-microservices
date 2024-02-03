import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JiraModule } from './jira.module';

async function bootstrap() {
  const app = await NestFactory.create(JiraModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: configService.get('JIRA_HOST'),
      port: configService.get('JIRA_TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('JIRA_HTTP_PORT'));
}
bootstrap();
