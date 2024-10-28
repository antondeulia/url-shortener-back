import { Module } from '@nestjs/common';
import { ShortenedUrlsService } from './shortened-urls.service';
import { ShortenedUrlsController } from './shortened-urls.controller';

@Module({
  controllers: [ShortenedUrlsController],
  providers: [ShortenedUrlsService],
})
export class ShortenedUrlsModule {}
