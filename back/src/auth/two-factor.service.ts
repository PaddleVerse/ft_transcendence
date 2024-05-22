import { Injectable } from '@nestjs/common';
import {authenticator} from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorService {

  async generateSecret(nickname: string) : Promise<any>
  {
    const secret = authenticator.generateSecret(64);

    const url = authenticator.keyuri(nickname, 'tchipa', secret);

    return {
      secret: secret,
      url: url,
    };
  }

  async generateQRCode(url: string) : Promise<string>
  {
    return qrcode.toDataURL(url);
  }

  async verifyToken(secret: string, token: string) : Promise<boolean>
  {
    return authenticator.verify({token, secret});
  }
}
