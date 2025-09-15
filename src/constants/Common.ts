import { CronExpression } from '@nestjs/schedule';

export const MAXIMUM_RETRIES = 3;
export const DEFAULT_PAGE_LIMIT = 10;
export const MAXIMUM_TIMEOUT_IN_MS = 5000;
export const CACHE_TTL_IN_MS = 1000 * 60 * 60; // 1 hour in milliseconds

export const ExtendedCronExpression = {
  ...CronExpression, // spread existing enum as object
  EVERY_15_MINUTES: '*/15 * * * *',
} as const;
