import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  transactionOptions: {
    isolationLevel: "ReadCommitted",
    timeout: 10_000, // 10 sec
    maxWait: 15_000, // 15 sec
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

