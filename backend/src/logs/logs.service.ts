import { Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LogsService {
  constructor(
    private readonly prisma: PrismaService) {}

  create(createLogDto: CreateLogDto) {
    return this.prisma.logs.create({
      data: {
        event: createLogDto.event,
        user: { connect: { id: createLogDto.userId } },
        eventDate: createLogDto.eventDate
      }
    });
  }

  findAll() {
    return this.prisma.logs.findMany({
      include: { user: true },
    });
  }

  findById(id: number) {
    return this.prisma.logs.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  findByUserId(id: number) {
    return this.prisma.logs.findMany({ where: { userId: id } });
  }
}
