import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { LogsService } from './logs.service';
import { GetUser } from 'src/decorators/getUser';
import { Role } from '@prisma/client';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll(@GetUser() user) {
    if(Role.ADMIN == user.role) { return this.logsService.findAll(); }
    throw new UnauthorizedException();
  }
}
