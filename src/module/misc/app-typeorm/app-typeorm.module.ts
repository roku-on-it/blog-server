import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<PostgresConnectionOptions> => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: ['dist/**/model/*.{ts,js}'],
        dropSchema: /true/i.test(configService.get('DB_DROP_SCHEMA')),
        synchronize: /true/i.test(configService.get('DB_SYNCHRONIZE')),
        logging: /true/i.test(configService.get('DB_LOGGING')),
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeormModule {}
