import { applyDecorators, UseGuards } from '@nestjs/common';
import { GqlThrottlerGuard } from 'src/module/auth/guard/gql-throttler.guard';
import { Throttle } from '@nestjs/throttler';

const DEFAULT_THROTTLE_LIMIT = Number(process.env.DEFAULT_THROTTLE_LIMIT);
const DEFAULT_THROTTLE_TTL = Number(process.env.DEFAULT_THROTTLE_TTL);

export const RateLimit = (limit?: number, ttl?: number) =>
  applyDecorators(
    UseGuards(GqlThrottlerGuard),
    Throttle(limit ?? DEFAULT_THROTTLE_LIMIT, ttl ?? DEFAULT_THROTTLE_TTL),
  );
