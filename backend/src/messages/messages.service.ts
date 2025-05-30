import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        content: createMessageDto.content,
        user: { connect: { id: createMessageDto.userId } },
        channel: { connect: { id: createMessageDto.channelId } }
      }
    });
  }

  findAll() {
    return this.prisma.message.findMany({
      include: {
        user: true,
        channel: true
      }
    });
  }
}
