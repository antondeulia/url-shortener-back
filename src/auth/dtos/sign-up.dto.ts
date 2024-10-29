import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class SignUpDto {
	@IsEmail()
	@IsDefined()
	@IsNotEmpty()
	email: string

	@IsString()
	@MinLength(6)
	@IsDefined()
	@IsNotEmpty()
	password: string
}
