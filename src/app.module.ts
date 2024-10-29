import { Module } from "@nestjs/common"
import { ShortenedUrlsModule } from "./shortened-urls/shortened-urls.module"
import { PrismaModule } from "prisma/prisma.module"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		ShortenedUrlsModule,
		PrismaModule,
		AuthModule,
		UsersModule
	]
})
export class AppModule {}
