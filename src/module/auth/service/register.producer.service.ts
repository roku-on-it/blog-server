import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { QueueType } from 'src/module/misc/app-queue/type/queue-type.enum';
import { JobType } from 'src/module/misc/app-queue/type/job-type.num';
import { CreateUser } from 'src/module/user/input/create-user';
import { RegisterResponse } from 'src/module/auth/model/register-response';

@Injectable()
export class RegisterProducerService {
  constructor(@InjectQueue(QueueType.REGISTER) private queue: Queue) {}

  async addToRegisterQueue(data: CreateUser): Promise<RegisterResponse> {
    const queue = await this.queue.add(JobType.REGISTER, data, {
      backoff: 1000,
    });

    return await queue // Catching the error right after job is completed.
      .finished()
      .then(() => {
        return { success: true };
      })
      .catch((e) => {
        return e;
      });
  }
}
