import { Process, Processor } from '@nestjs/bull';
import { QueueType } from 'src/module/misc/app-queue/type/queue-type.enum';
import { Job } from 'bull';
import { JobType } from 'src/module/misc/app-queue/type/job-type.num';
import { plainToClass } from 'class-transformer';
import { User } from 'src/module/user/model/user';
import { CreateUser } from 'src/module/user/input/create-user';

@Processor(QueueType.REGISTER)
export class RegisterConsumer {
  @Process(JobType.REGISTER)
  async handleRegisterJob(job: Job<CreateUser>) {
    return plainToClass(User, job.data).save();
  }
}
