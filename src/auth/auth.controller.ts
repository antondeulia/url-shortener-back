import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Res,
	UseGuards
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { SignUpDto } from "./dtos/sign-up.dto"
import { LocalGuard } from "./guards/local.guard"
import { Response } from "express"
import { CurrentUser } from "src/utils/decorators/current-user"
import { JwtTokensEnum } from "src/utils/enums"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("test")
	test() {
		return "hello"
	}

	@Post("sign-up")
	@HttpCode(HttpStatus.CREATED)
	async signUp(@Body() dto: SignUpDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.signUp(dto, res)
	}

	@Post("sign-in")
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalGuard)
	async signIn(
		@CurrentUser("id") userId: number,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.signIn(userId, res)
	}

	@Post("sign-out")
	@HttpCode(HttpStatus.OK)
	async signOut(@Res() res: Response) {
		res.cookie(JwtTokensEnum.refresh, "").json()
	}
}
