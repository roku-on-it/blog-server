import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlThrottlerGuard } from 'src/module/auth/guard/gql-throttler.guard';
import { Throttle } from '@nestjs/throttler';

export const RateLimit = (limit: number, ttl: number) =>
  applyDecorators(UseGuards(GqlThrottlerGuard), Throttle(limit, ttl));
