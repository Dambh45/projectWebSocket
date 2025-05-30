import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: await bcrypt.hash("admin1234", 10),
      firstname: 'admin',
      lastname: 'Admin',
      color: 'ff0000',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      email: 'user@test.com',
      password: await bcrypt.hash("user1234", 10),
      firstname: 'user',
      lastname: 'User',
      color: '00ff00',
      role: Role.USER,
    },
  });

  await prisma.channel.upsert({
    where: { name: 'Salle 1' },
    update: {},
    create: {
      name: 'Salle 1',
      usersAuthaurized: {
        connect: [],
      },
    },
  });

  await prisma.channel.upsert({
    where: { name: 'Salle 2' },
    update: {},
    create: {
      name: 'Salle 2',
      usersAuthaurized: {
        connect: [{ id: user.id }],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
