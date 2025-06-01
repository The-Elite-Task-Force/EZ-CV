import { PrismaService } from "nestjs-prisma";

export class TestPrismaService extends PrismaService {
  constructor(databaseUrl: string) {
    process.env.DATABASE_URL = databaseUrl;
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
