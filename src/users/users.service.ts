import {
	BadRequestException,
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import * as argon2 from "argon2"

import { PrismaService } from "prisma/prisma.service"
import { CreateUserDto } from "./dtos/create-user.dto"
import { GetUserDto } from "./dtos/get-user.dto"
import { UpdateUserDto } from "./dtos/update-user.dto"

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	async getOne(dto: GetUserDto) {
		const { id, email } = dto

		if (!id && !email) {
			throw new BadRequestException("Not id or email provided")
		}
		return await this.prisma.user.findFirst({
			where: {
				id,
				email
			}
		})
	}

	async getOneOrThrow(dto: GetUserDto) {
		const user = await this.getOne(dto)

		if (!user) {
			throw new NotFoundException("User was not found")
		}
		return user
	}

	async createOne(dto: CreateUserDto) {
		const { email, password } = dto

		const existingUser = await this.getOne({ email })

		if (existingUser) {
			throw new ConflictException("User with this email is already existing")
		}

		const hashedPassword = await argon2.hash(password)

		try {
			return await this.prisma.user.create({
				data: {
					email,
					hashedPassword
				}
			})
		} catch (error) {
			console.log(error)
			throw new InternalServerErrorException(error)
		}
	}

	async updateOne(id: number, dto: UpdateUserDto) {
		await this.getOneOrThrow({ id })

		try {
			return await this.prisma.user.update({
				where: { id },
				data: {
					...dto
				}
			})
		} catch (error) {
			console.log(error)
			throw new InternalServerErrorException(error)
		}
	}

	async deleteOne(id: number) {
		await this.getOneOrThrow({ id })

		try {
			return await this.prisma.user.delete({
				where: { id }
			})
		} catch (error) {
			console.log(error)
			throw new InternalServerErrorException(error)
		}
	}
}
