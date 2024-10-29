import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Patch,
	UseGuards
} from "@nestjs/common"
import { UsersService } from "./users.service"
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard"
import { CurrentUser } from "src/utils/decorators/current-user"
import { User } from "@prisma/client"
import { UpdateUserDto } from "./dtos/update-user.dto"

@Controller("users")
@UseGuards(JwtAccessGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getOne(@CurrentUser() user: User) {
		delete user.hashedPassword
		return user
	}

	@Patch()
	@HttpCode(HttpStatus.OK)
	async updateOne(@CurrentUser("id") id: number, @Body() dto: UpdateUserDto) {
		return await this.usersService.updateOne(id, dto)
	}

	@Delete()
	@HttpCode(HttpStatus.OK)
	async deleteOne(@CurrentUser("id") id: number) {
		return await this.usersService.deleteOne(id)
	}
}
