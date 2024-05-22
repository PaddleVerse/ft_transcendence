import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AchievementService, UserModule],
  imports: [UserModule],
})
export class AchievementModule {}
