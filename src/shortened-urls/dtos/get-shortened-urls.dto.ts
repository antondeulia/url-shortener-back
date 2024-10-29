export class GetShortenedUrlsQueryDto {
	page: number

	limit: number

	query: string

	byCreatedAt: "asc" | "desc"
}
