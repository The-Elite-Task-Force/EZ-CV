import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { User as UserEntity } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import OpenAI from "openai";
import { SearchResultDto } from "@reactive-resume/dto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to get the embedding for a given text
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    if (response.data && response.data[0].embedding.length > 0) {
      return response.data[0].embedding;
    } else {
      throw new Error("No embedding returned from OpenAI");
    }
  } catch (error) {
    console.error("Error getting embedding from OpenAI:", error);
    throw error;
  }
}

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUsers(searchQuery: string, k: number) {
    try {
      // Get the embedding for the search query
      const searchQueryEmbedding = await getEmbedding(searchQuery);

      const searchResults: { userId: string }[] = await this.prisma.$queryRaw`
      SELECT "userId"
      FROM searchIndex
      WHERE embedding <-> ${searchQueryEmbedding}::vector < 1
      ORDER BY embedding <-> ${searchQueryEmbedding}::vector
      LIMIT ${Number(k)};
    `;

      console.log("Search results:", searchResults);
      // Extract user IDs from the search results
      const userIds = searchResults.map((result: { userId: string }) => result.userId);

      console.log("User IDs:", userIds);
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
      console.error("Error searching users:", error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateSearchIndex(user: UserEntity) {
    console.log("Updating search index for user:", user.id);
    // Check if the user has a profile resume
    if (!user.profileResumeId) {
      throw new InternalServerErrorException("User does not have a profile resume");
    }
    const documentId = user.profileResumeId;
    const { data } = await this.prisma.resume.findUniqueOrThrow({ where: { id: documentId } });
    if (!data) {
      throw new InternalServerErrorException("Resume not found");
    }
    const document = data.toString();
    // Get the embedding for the document
    // Then search in database

    getEmbedding(document)
      .then((embedding) => {
        return this.prisma.$queryRaw`
      INSERT INTO searchindex (document, "userId", embedding)
      VALUES (${document}, ${user.id}, ${embedding})
      ON CONFLICT ("userId") DO UPDATE
      SET document = EXCLUDED.document, embedding = EXCLUDED.embedding;
    `;
      })
      .then(() => {
        console.log("Search index updated successfully");
      })
      .catch((error: unknown) => {
        console.error("Error updating search index:", error);
      });
  }
}
