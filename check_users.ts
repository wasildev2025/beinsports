import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); prisma.user.findMany().then(users => { console.log(JSON.stringify(users)); process.exit(0); });
