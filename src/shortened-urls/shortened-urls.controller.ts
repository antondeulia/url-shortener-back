import { Controller, Get } from "@nestjs/common"
import { ShortenedUrlsService } from "./shortened-urls.service"

@Controller("shortened-urls")
export class ShortenedUrlsController {
	constructor(private readonly shortenedUrlsService: ShortenedUrlsService) {}

	@Get("test")
	test() {
		return "Hello"
	}
}
