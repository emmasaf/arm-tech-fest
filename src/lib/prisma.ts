import { PrismaClient } from '@prisma/client';

const prisma = () => {
    return new PrismaClient({
        transactionOptions: {
            isolationLevel: "ReadCommitted",
            timeout: 10_000, // 10 sec
            maxWait: 15_000, // 15 sec
        },
    });
};

export default prisma();

