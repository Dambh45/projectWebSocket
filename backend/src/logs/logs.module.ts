import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [LogsController],
  providers: [LogsService, PrismaService]
})
export class LogsModule {}
