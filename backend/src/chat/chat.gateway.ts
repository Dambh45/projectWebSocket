import {
    WebSocketGateway,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    const { userId, channelId } = client.handshake.query;

    const channel = await this.prisma.channel.findFirst({
      where: {
        id: Number(channelId)
      }
    });

    if (userId && channelId) {
      await this.prisma.logs.create({
        data: {
          userId: Number(userId),
          event: `s'est connecté au channel ${channel ? channel.name : channelId}`
        }
      });

      client.join(`channel-${channelId}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const { userId, channelId } = client.handshake.query;

    const channel = await this.prisma.channel.findFirst({
      where: {
        id: Number(channelId)
      }
    });

    if (userId && channelId) {
      await this.prisma.logs.create({
        data: {
          userId: Number(userId),
          event: `s'est déconnecté du channel ${channel ? channel.name : channelId}`
        }
      });

      client.leave(`channel-${channelId}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { content: string; channelId: number; userId: number },
  ) {
    const { content, channelId, userId } = payload;

    const message = await this.prisma.message.create({
      data: {
        content,
        channelId,
        userId
      },
      include: { user: true }
    });

    this.server.to(`channel-${channelId}`).emit('receiveMessage', message);
  }
}