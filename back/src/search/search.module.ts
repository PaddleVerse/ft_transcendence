import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [SearchService],
  controllers: [SearchController],
  imports: [UserModule]
})
export class SearchModule {}
