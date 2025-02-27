import { Controller, Get, InternalServerErrorException, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import type { SearchResultDto } from "@reactive-resume/dto";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchUsers(@Query("query") searchQuery: string, @Query("k") k: number) {
    try {
      const users = await this.searchService.searchUsers(searchQuery, k);
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get("/hello")
  async hello() {
    return "Hello, world!";
  }
}
