import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { UsersService } from "src/users/users.service"
import { JwtAccessPayload } from "src/utils/types/JwtAccessPayload"

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "jwt-access") {
	constructor(
		private readonly config: ConfigService,
		private readonly usersService: UsersService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: "access-secret"
		})
	}

	async validate(payload: JwtAccessPayload) {
		const user = await this.usersService.getOne({ id: payload.userId })

		if (!user) {
			throw new UnauthorizedException()
		}
		return user
	}
}
