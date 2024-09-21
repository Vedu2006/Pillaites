import { PrismaClient } from "@prisma/client";

// Singleton function for creating the Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Attach Prisma Client to the global object in development to prevent multiple instances
declare global {
  // Global variable type definition for Prisma Client
  var prismaGlobal: PrismaClient | undefined;
}

// Initialize Prisma Client (reusing the global instance if available, otherwise creating a new one)
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// In development, store the Prisma Client instance in the global object to avoid creating multiple instances
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
