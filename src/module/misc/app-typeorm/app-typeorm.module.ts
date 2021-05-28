import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        config: ConfigService,
      ): Promise<PostgresConnectionOptions> => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: config.get('POSTGRES_PORT'),
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DATABASE'),
        entities: ['dist/**/model/*.{ts,js}'],
        dropSchema: /true/i.test(config.get('DB_DROP_SCHEMA')),
        synchronize: /true/i.test(config.get('DB_SYNCHRONIZE')),
        logging: /true/i.test(config.get('DB_LOGGING')),
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class AppTypeormModule {}
