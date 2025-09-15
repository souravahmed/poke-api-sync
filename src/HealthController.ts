import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('v1/health')
export class HealthController {
  @Get()
  getHealth(): HttpStatus {
    return HttpStatus.OK;
  }
}
