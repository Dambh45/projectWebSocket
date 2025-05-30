import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/decorators/getUser';
import { Public } from 'src/decorators/public';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @Public()
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }
  
  @Get('me')
  userInfo(@GetUser() user: User) {
    return user;
  }

  @Post('me')
  async userEdit(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const { password, ...rest } = await this.usersService.update(user.id, updateUserDto);
    return rest;
  }
}
