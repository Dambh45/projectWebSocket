import { Role } from '@prisma/client';
import { Controller, Get, Param, UnauthorizedException } from '@nestjs/common';
import { GetUser } from 'src/decorators/getUser';
import { PrismaService } from 'src/prisma.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':channelId')
  async getMessages(@Param('channelId') channelId: string, @GetUser() user) {
    const channel = await this.prisma.channel.findFirst({
      where: { id : Number(channelId) }, 
      include: { usersAuthaurized: true }
    });
    if (Role.ADMIN === user.role || channel?.usersAuthaurized.some((userAuthorized) => userAuthorized.id === user.id)) {
      return this.prisma.message.findMany({
        where: {channelId: Number(channelId)},
        include: {
          user: {
            select: {
              firstname: true,
              lastname: true,
              color: true
            }
          }
        },
        orderBy: {SentDate: 'asc'}
      });
    }
    throw new UnauthorizedException();
  }
}
