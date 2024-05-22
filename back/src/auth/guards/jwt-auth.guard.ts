import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaClient } from "@prisma/client";


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly prisma: PrismaClient;
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isTokenValid = await super.canActivate(context) as boolean;
      if (!isTokenValid)
        throw new UnauthorizedException();
      
      const request = context.switchToHttp().getRequest();
      const token = this.extractJwtFromRequest(request);

      // Check if the token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted)
        throw new UnauthorizedException();

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    return await this.prisma.blacklistedTokens.findUnique({
      where: {
        token: token
      }
    }) !== null;
  }
  private extractJwtFromRequest(request: any): string {
    return request.headers.authorization.split(' ')[1];
  }
}
