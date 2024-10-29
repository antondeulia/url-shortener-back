import {
	IsDefined,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength
} from "class-validator"

export class UpdateShortenedUrlDto {
	@IsOptional()
	@IsNotEmpty()
	@IsUrl()
	origin?: string

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(27)
	name?: string
}
