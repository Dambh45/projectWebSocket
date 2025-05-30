import { Controller, Get, Post, Body, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { GetUser } from 'src/decorators/getUser';
import { Role, User } from '@prisma/client';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @GetUser() user: User) {
    if (Role.ADMIN == user.role) { return this.channelsService.create(createChannelDto); }
    throw new UnauthorizedException();
  }

  @Get()
  findAll(@GetUser() user) {
    return this.channelsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.channelsService.findById(Number(id), user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    if (user.role !== Role.ADMIN) { throw new UnauthorizedException(); }
    return this.channelsService.remove(Number(id));
  }


  @Post(':id/:userId') 
  async editUserAuthorisation(@Param('id') id: string, @Param('userId') userId: string, @GetUser() user: User) {
    if (Role.ADMIN == user.role) {
      const channel = await this.channelsService.findById(Number(id), user);
      if (channel) {
        const isAuthorized = channel.usersAuthaurized.some((userAuthorized) => userAuthorized.id === Number(userId));
        if (isAuthorized) {
          return this.channelsService.removeUserFromChannel(Number(id), Number(userId));
        } else {
          return this.channelsService.addUserToChannel(Number(id), Number(userId));
        }
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
