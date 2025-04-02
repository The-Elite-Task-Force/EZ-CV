import { PrismaClient } from "@prisma/client";
import { Role } from "../../libs/dto/src/company/types/types"; // adjust as needed

const prisma = new PrismaClient();

export async function seedDatabase(): Promise<void> {
  const roles = Role.all();
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: { id: role.id, name: role.name },
    });
  }
}

if (require.main === module) {
  // Only run if executed directly (for seeding outside of the server)
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
