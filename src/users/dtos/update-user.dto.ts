import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class UpdateUserDto {
	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	password: string
}
