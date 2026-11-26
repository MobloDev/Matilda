import { PrismaClient } from "@prisma/client";

// Next.js reloads modules on every edit in development. Without this,
// each reload would open a new database connection. Reusing one instance
// via globalThis avoids that.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
