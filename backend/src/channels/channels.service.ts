import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { PrismaService } from 'src/prisma.service';
import { Role, User } from '@prisma/client';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  create(createChannelDto: CreateChannelDto) {
    return this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        usersAuthaurized: {
          connect: createChannelDto.authorizedUserIds?.map((id) => ({ id })) || []
        }
      }
    });
  }

  findAll(user: User) {
    if (Role.ADMIN != user.role) {
      return this.prisma.channel.findMany({
        where: {
          usersAuthaurized: {
            some: {
              id: user.id
            }
          }
        }
      });
    }
    return this.prisma.channel.findMany()
  }

  async findById(id: number, user: User) {
    const channel = await this.prisma.channel.findUnique({
      where: { id },
      include: {
        usersAuthaurized: true,
        channelMessages: true
      }
    });
    if (Role.ADMIN == user.role || channel?.usersAuthaurized.some((userAuthorized) => userAuthorized.id === user.id)) {
      return channel;
    }
    throw new UnauthorizedException();
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return this.prisma.channel.update({
      where: { id },
      data: {
        name: updateChannelDto.name,
        usersAuthaurized: updateChannelDto.authorizedUserIds
          ? {
              set: updateChannelDto.authorizedUserIds.map((id) => ({ id }))
            }
          : undefined
      }
    });
  }

  async remove(id: number) {
    await this.prisma.message.deleteMany({
      where: {
        channelId: id,
      },
    });
  
    await this.prisma.channel.update({
      where: { id },
      data: {
        usersAuthaurized: {
          set: []
        }
      }
    });
  
    return this.prisma.channel.delete({ where: { id } });
  }
  

  async addUserToChannel(channelId: number, userId: number) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: {
        usersAuthaurized: {
          connect: { id: userId }
        }
      },
      include: { usersAuthaurized: true }
    });
  }
  
  async removeUserFromChannel(channelId: number, userId: number) {
    return this.prisma.channel.update({
      where: { id: channelId },
      data: {
        usersAuthaurized: {
          disconnect: { id: userId }
        }
      },
      include: { usersAuthaurized: true }
    });
  }
}
