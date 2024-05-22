import {
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { Prisma, PrismaClient, channel } from "@prisma/client";

export class DuplicateError extends HttpException {
  constructor(name: string) {
    super(`the channel with name '${name}' already exists`, HttpStatus.BAD_REQUEST);
  }
}
