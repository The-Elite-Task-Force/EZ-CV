import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User as UserEntity } from "@prisma/client";
import { SearchResultDto } from "@reactive-resume/dto";
import { PrismaService } from "nestjs-prisma";
import OpenAI from "openai";

@Injectable()
export class SearchService {
  openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  // Function to get the embedding for a given text
  async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    if (response.data && response.data[0].embedding.length > 0) {
      return response.data[0].embedding;
    } else {
      throw new Error("No embedding returned from OpenAI");
    }
  }

  async searchUsers(searchQuery: string, totalResults: number) {
    try {
      // Get the embedding for the search query
      const searchQueryEmbedding = await this.getEmbedding(searchQuery);

      let searchResults: { userId: string }[];
      try {
        searchResults = await this.prisma.$queryRaw`
          SELECT "userId"
          FROM searchIndex
          WHERE embedding <-> ${searchQueryEmbedding}::vector < 1
          ORDER BY embedding <-> ${searchQueryEmbedding}::vector
          LIMIT ${Number(totalResults)};
        `;
      } catch (queryError) {
        throw new InternalServerErrorException(
          `Failed to execute search query: ${queryError.message}`,
        );
      }
      // Extract user IDs from the search results
      const userIds = searchResults.map((result: { userId: string }) => result.userId);

      // Retrieve users based on the search results
      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: userIds,
          },
        },
      });

      // Transform the retrieved users into instances of SearchResultDto
      return users.map((user) => new SearchResultDto(user));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateSearchIndex(user: UserEntity) {
    // Check if the user has a profile resume
    if (!user.profileResumeId) {
      return;
    }

    const documentId = user.profileResumeId;
    const { data } = await this.prisma.resume.findUniqueOrThrow({ where: { id: documentId } });
    if (!data) {
      throw new InternalServerErrorException("Resume not found");
    }
    const document = JSON.stringify(data);

    // Get the embedding for the document
    // Then search in database

    this.getEmbedding(document)
      .then((embedding) => {
        return this.prisma.$queryRaw`
          INSERT INTO searchindex (document, "userId", embedding)
          VALUES (${document}, ${user.id}, ${embedding}) ON CONFLICT ("userId") DO
          UPDATE
            SET document = EXCLUDED.document, embedding = EXCLUDED.embedding;
        `;
      })
      .catch((error: unknown) => {
        throw new InternalServerErrorException(error);
      });
  }
}
