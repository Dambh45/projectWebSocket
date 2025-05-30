import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

interface CreateUser {
  firstname: string,
  lastname: string,
  email: string,
  password: string
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUser) {
    return this.prisma.user.create({data});
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findById(id: number) {
    return this.prisma.user.findUnique({where: { id }});
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({where: { email }});
  }

  update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data : {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        color: data.color
      }
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({where: { id }});
  }
}
