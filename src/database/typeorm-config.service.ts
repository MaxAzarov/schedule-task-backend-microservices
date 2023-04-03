import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('DATABASE_TYPE'),
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      username: this.configService.get('DATABASE_USERNAME'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
      // synchronize: this.configService.get('DATABASE_SYNCHRONIZE'),
      synchronize: true,
      dropSchema: false,
      keepConnectionAlive: true,
      logging: this.configService.get('NODE_ENV') !== 'production',
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      // entities: [__dirname + '\\..\\**\\*.entity{.ts,.js}'],
      entities: [
        'C:\\Users\\volod\\OneDrive\\Desktop\\diploma\\schedule-task-backend\\src\\**\\*.entity{.ts,.js}',
      ],
      // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
      factories: [__dirname + '/factories/**/*{.ts,.js}'],
      extra: {
        // based on https://node-postgres.com/api/pool
        // max connection pool size
        max: 10,
        ssl: undefined,
      },
      cli: {
        migrationsDir: 'migration',
      },
    } as TypeOrmModuleOptions;
  }
}
