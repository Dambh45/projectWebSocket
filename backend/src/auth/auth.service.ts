import { Role } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from '../users/users.service';

interface Register {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface Payload {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  color: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !await bcrypt.compare(pass, user.password)) { throw new UnauthorizedException(); }

    const payload: Payload = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
      color: user.color
    };

    return { access_token: await this.jwtService.signAsync(payload) };
  }

  async register(registerBody: Register) {
    return this.prisma.user.create({
      data: {
        email: registerBody.email,
        password: await bcrypt.hash(registerBody.password, 10),
        firstname: registerBody.firstname,
        lastname: registerBody.lastname
      }
    });
  }
}
