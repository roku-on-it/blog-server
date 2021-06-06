import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueOptions } from 'bull';
import { QueueType } from 'src/module/misc/app-queue/type/queue-type.enum';
import { RegisterProducerService } from 'src/module/auth/service/register.producer.service';
import { RegisterConsumer } from 'src/module/auth/service/consumer/register.consumer';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<QueueOptions> => ({
        redis: {
          host: configService.get('STORE_HOST'),
          port: configService.get('STORE_PORT'),
        },
        defaultJobOptions: {
          timeout: 30000,
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
        },
      }),
    }),
    BullModule.registerQueue({
      name: QueueType.REGISTER,
    }),
  ],
  exports: [BullModule, RegisterProducerService],
  providers: [RegisterProducerService, RegisterConsumer],
})
export class AppQueueModule {}
