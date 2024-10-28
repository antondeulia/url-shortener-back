import { Module } from "@nestjs/common"
import { ShortenedUrlsModule } from './shortened-urls/shortened-urls.module';

@Module({
	imports: [ShortenedUrlsModule]
})
export class AppModule {}
