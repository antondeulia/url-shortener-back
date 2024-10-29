import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Res,
	UseGuards
} from "@nestjs/common"
import { ShortenedUrlsService } from "./shortened-urls.service"
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard"
import { CurrentUser } from "src/utils/decorators/current-user"
import { CreateShortenedUrlDto } from "./dtos/create-shortened-url.dto"
import { UpdateShortenedUrlDto } from "./dtos/update-shortened-url.dto"
import { GetShortenedUrlsQueryDto } from "./dtos/get-shortened-urls.dto"
import { Response } from "express"

@Controller()
export class ShortenedUrlsController {
	constructor(private readonly shortenedUrlsService: ShortenedUrlsService) {}

	@UseGuards(JwtAccessGuard)
	@Get()
	async get(
		@CurrentUser("id") userId: number,
		@Query() queryDto: GetShortenedUrlsQueryDto
	) {
		return await this.shortenedUrlsService.get(userId, queryDto)
	}

	@UseGuards(JwtAccessGuard)
	@Post()
	async createOne(
		@CurrentUser("id") userId: number,
		@Body() dto: CreateShortenedUrlDto
	) {
		return await this.shortenedUrlsService.createOne(dto, userId)
	}

	@Get(":code")
	async redirect(
		@Param("code") code: string,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.shortenedUrlsService.redirect(code, res)
	}

	@UseGuards(JwtAccessGuard)
	@Patch(":id")
	async updateOne(
		@CurrentUser("id") userId: number,
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateShortenedUrlDto
	) {
		return await this.shortenedUrlsService.updateOne(id, dto, userId)
	}

	@UseGuards(JwtAccessGuard)
	@Delete(":id")
	async deleteOne(
		@CurrentUser("id") userId: number,
		@Param("id", ParseIntPipe) id: number
	) {
		return await this.shortenedUrlsService.deleteOne(id, userId)
	}
}
