import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ShopController],
  providers: [ShopService],
  imports: [UserModule],
})
export class ShopModule {}
