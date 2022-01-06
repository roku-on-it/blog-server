import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as redis from 'redis';
import * as connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const configService: ConfigService = app.get(ConfigService);

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: configService.get('STORE_HOST'),
    port: configService.get('STORE_PORT'),
    db: configService.get('STORE_SESSION_DB'),
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: 'qid',
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: configService.get('MODE') === 'prod',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );

  await app.listen(
    configService.get('SERVER_PORT'),
    configService.get('SERVER_HOST'),
  );
}

bootstrap();
