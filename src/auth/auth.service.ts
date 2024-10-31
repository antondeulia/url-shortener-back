import { Injectable } from "@nestjs/common"
import argon2, { verify } from "argon2"

import { UsersService } from "src/users/users.service"
import { SignUpDto } from "./dtos/sign-up.dto"
import { Response } from "express"
import { JwtTokensEnum } from "src/utils/enums"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwt: JwtService,
		private readonly configService: ConfigService
	) {}

	async signUp(dto: SignUpDto, res: Response) {
		const user = await this.usersService.createOne(dto)

		const tokens = this.generateTokens(user.id)

		this.setCookies(res, tokens.refreshToken)
		return tokens.accessToken
	}

	async signIn(userId: number, res: Response) {
		const tokens = this.generateTokens(userId)

		this.setCookies(res, tokens.refreshToken)
		return {
			accessToken: tokens.accessToken
		}
	}

	async validate(email: string, password: string) {
		const user = await this.usersService.getOne({ email })

		if (!user) {
			return null
		}

		const isValidPass = await verify(user.hashedPassword, password)

		if (!isValidPass) {
			return null
		}

		return user
	}

	generateTokens(userId: number) {
		const accessToken = this.jwt.sign(
			{
				userId
			},
			{
				secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
				expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES")
			}
		)

		const refreshToken = this.jwt.sign(
			{
				userId
			},
			{
				secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
				expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES")
			}
		)

		return {
			accessToken,
			refreshToken
		}
	}

	// Private methods
	private setCookies(res: Response, refreshToken: string) {
		res.cookie(JwtTokensEnum.refresh, refreshToken, {
			httpOnly: true,
			secure: true
		})
	}
}
