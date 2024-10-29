import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import { PrismaService } from "prisma/prisma.service"
import { CreateShortenedUrlDto } from "./dtos/create-shortened-url.dto"
import { UpdateShortenedUrlDto } from "./dtos/update-shortened-url.dto"
import * as nanoid from "nanoid"
import { ConfigService } from "@nestjs/config"
import { GetShortenedUrlsQueryDto } from "./dtos/get-shortened-urls.dto"
import { generateRandomCode } from "src/utils"
import { GetShortenedUrlDto } from "./dtos/get-shortened-url.dto"
import { Response } from "express"
import { ShortenedUrl } from "@prisma/client"

@Injectable()
export class ShortenedUrlsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	async get(userId: number, queryDto: GetShortenedUrlsQueryDto) {
		const { page = 1, limit = 15, byCreatedAt = "asc", query = "" } = queryDto

		const skip = (page - 1) * limit

		return await this.prisma.shortenedUrl.findMany({
			where: {
				userId
			},
			skip,
			take: limit,
			orderBy: {
				createdAt: byCreatedAt
			}
		})
	}

	async redirect(code: string, res: Response) {
		const shortenedUrl = await this.getOneOrThrow({ code })

		await this.prisma.shortenedUrl.update({
			where: { id: shortenedUrl.id },
			data: {
				clicks: ++shortenedUrl.clicks
			}
		})

		res.redirect(shortenedUrl.origin)
	}

	async createOne(dto: CreateShortenedUrlDto, userId: number) {
		const code = generateRandomCode(6)

		const url = this.configService.getOrThrow("NODE_HOST") + "/" + code

		try {
			return await this.prisma.shortenedUrl.create({
				data: {
					...dto,
					userId,
					url,
					code
				}
			})
		} catch (error) {
			console.log(error)
			throw new InternalServerErrorException(error)
		}
	}

	async updateOne(id: number, dto: UpdateShortenedUrlDto, userId: number) {
		console.log(id)

		await this.getOneOrThrow({ id })

		try {
			return await this.prisma.shortenedUrl.update({
				where: {
					id,
					userId
				},
				data: {
					...dto
				}
			})
		} catch (error) {
			console.log(error)
			throw new InternalServerErrorException(error)
		}
	}

	async deleteOne(id: number, userId: number) {
		await this.getOneOrThrow({ id })

		try {
			return await this.prisma.shortenedUrl.delete({
				where: {
					id,
					userId
				}
			})
		} catch (error) {
			console.log(error)
			throw new InternalServerErrorException(error)
		}
	}

	// Helers
	async getOneOrThrow(dto: GetShortenedUrlDto): Promise<ShortenedUrl> {
		const { id, code } = dto

		console.log(id, code)

		if (!id && !code) {
			throw new BadRequestException("No id or code were provided")
		}

		const shortenedUrl = await this.prisma.shortenedUrl.findFirst({
			where: {
				OR: [{ id }, { code }]
			}
		})

		if (!shortenedUrl) {
			throw new NotFoundException("Shortened url with given ID was not found")
		}

		return shortenedUrl
	}
}
