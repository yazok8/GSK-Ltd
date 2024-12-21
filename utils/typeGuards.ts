import { Prisma } from "@prisma/client";

/**
 * Type guard to check if an error is a PrismaClientKnownRequestError
 * @param error The error to check
 * @returns boolean indicating whether the error is a PrismaClientKnownRequestError
 */
export function isPrismaClientKnownRequestError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError;
}
