import { createId } from "@paralleldrive/cuid2";
import { resumeSchema } from "@reactive-resume/dto";
import { vi } from "vitest";

import { PrinterService } from "@/server/printer/printer.service";
import { StorageService } from "@/server/storage/storage.service";
import { setupIntegrationTestSuite } from "@/server/tests/setup-integration-suite";
import { VariantService } from "@/server/variant/variant.service";

import { mockConfigService, mockCreateUser, mockStorageAdapter } from "../../mocks/mocks";
import { mockCreateResume } from "../../mocks/resumeMocks";

const { getPrisma } = setupIntegrationTestSuite();

describe("VariantService Integration", () => {
  vi.mock("../../../ai/chat-client-factory", () => ({
    getChatClient: () => ({
      chatCompletion: vi.fn(),
    }),
  }));
  let variantService: VariantService;
  let storageService: StorageService;
  let printerService: PrinterService;

  beforeEach(() => {
    storageService = new StorageService(mockStorageAdapter);
    printerService = new PrinterService(mockConfigService, storageService);
    variantService = new VariantService(getPrisma(), storageService, printerService);
  });

  it("should create a resume variant", async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: mockCreateUser });

    const resume = await prisma.resume.create({
      data: {
        ...mockCreateResume,
        userId: user.id,
      },
    });

    const result = await variantService.createVariant({
      resumeId: resume.id,
      userId: user.id,
      creatorId: user.id,
      title: "Variant A",
      slug: "variant-a",
    });

    expect(result).toMatchObject({
      title: "Variant A",
      slug: "variant-a",
      userId: user.id,
      resumeId: resume.id,
      language: mockCreateResume.language,
    });

    const parsed = resumeSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    const variant = await variantService.saveVariant({
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      ...result,
      id: createId(),
      slug: "variant-b",
    });

    expect(variant).toMatchObject({
      title: "Variant A",
      slug: "variant-b",
      userId: user.id,
      resumeId: resume.id,
      language: "en-US",
    });

    const parsedVariant = resumeSchema.safeParse(variant);
    expect(parsedVariant.success).toBe(true);
  });

  it("should throw error if resume not found", async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: mockCreateUser });

    await expect(
      variantService.createVariant({
        resumeId: "non-existent-id",
        userId: user.id,
        creatorId: user.id,
        title: "Variant X",
        slug: "variant-x",
      }),
    ).rejects.toThrow("Error creating variant");
  });

  it("should find all resume variants for a user", async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: mockCreateUser });

    const resume = await prisma.resume.create({
      data: {
        ...mockCreateResume,
        userId: user.id,
      },
    });

    await variantService.createVariant({
      resumeId: resume.id,
      userId: user.id,
      creatorId: user.id,
      title: "Variant 1",
      slug: "variant-1",
    });

    const all = await variantService.findAll(user.id);
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].userId).toBe(user.id);
  });

  it("should find a resume variant by id and userId", async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: mockCreateUser });

    const resume = await prisma.resume.create({
      data: {
        ...mockCreateResume,
        userId: user.id,
      },
    });

    const variant = await variantService.createVariant({
      resumeId: resume.id,
      userId: user.id,
      creatorId: user.id,
      title: "Variant B",
      slug: "variant-b",
    });

    const found = await variantService.findOne(variant.id, user.id);
    expect(found.id).toBe(variant.id);
  });

  it("should update a resume variant", async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: mockCreateUser });

    const resume = await prisma.resume.create({
      data: {
        ...mockCreateResume,
        userId: user.id,
      },
    });

    const variant = await variantService.createVariant({
      resumeId: resume.id,
      userId: user.id,
      creatorId: user.id,
      title: "Variant to Edit",
      slug: "variant-edit",
    });

    const updated = await variantService.update(user.id, variant.id, {
      title: "Updated Variant",
      slug: "updated-variant",
    });

    expect(updated?.title).toBe("Updated Variant");
    expect(updated?.slug).toBe("updated-variant");
  });

  it("should delete a resume variant", async () => {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: mockCreateUser });

    const resume = await prisma.resume.create({
      data: {
        ...mockCreateResume,
        userId: user.id,
      },
    });

    const variant = await variantService.createVariant({
      resumeId: resume.id,
      userId: user.id,
      creatorId: user.id,
      title: "Variant to Delete",
      slug: "variant-delete",
    });

    const deleted = await variantService.remove(user.id, variant.id);
    expect(deleted.id).toBe(variant.id);

    const found = await prisma.resumeVariant.findMany();
    expect(found.length).toBe(0);
  });
});
