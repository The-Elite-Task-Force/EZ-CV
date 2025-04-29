import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { translateSummarySection } from "../../ai/translator";

// Mock `getChatClient` before importing `translator`
vi.mock("../../ai/chat-client-factory", () => ({
  getChatClient: () => ({
    chatCompletion: vi.fn(),
  }),
}));

describe("translateSummarySection", () => {
  let mockChatClient: { chatCompletion: ReturnType<typeof vi.fn> };

  const mockSummary = {
    id: "summary",
    items: [
      {
        id: "1",
        content: "Original Summary",
        name: "Summary Item",
        userId: "userId123",
        updatedAt: new Date(),
        description: "Description of the summary item",
      },
    ],
  };

  const mockResponse = {
    choices: [
      {
        message: {
          content: JSON.stringify(mockSummary.items), // Return the same structure as input
        },
      },
    ],
  };

  beforeEach(async () => {
    const { getChatClient } = await import("../../ai/chat-client-factory");
    mockChatClient = vi.mocked(getChatClient());
    mockChatClient.chatCompletion.mockResolvedValue(mockResponse); // Mock the response
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should translate the summary section", async () => {
    const result = await translateSummarySection(mockSummary, "es");

    expect(mockChatClient.chatCompletion).toHaveBeenCalledWith({
      model: expect.any(String),
      messages: expect.arrayContaining([
        { role: "system", content: expect.any(String) },
        { role: "user", content: JSON.stringify(mockSummary.items) },
      ]),
      temperature: 0.3,
    });

    expect(result).toEqual({
      ...mockSummary,
      items: mockSummary.items, // Expect the same structure as input
    });
  });

  it("should return the original summary if items are empty", async () => {
    const emptySummary = { id: "summary", items: [] };
    const result = await translateSummarySection(emptySummary, "es");

    expect(result).toEqual(emptySummary);
    expect(mockChatClient.chatCompletion).not.toHaveBeenCalled();
  });

  it("should throw an error if translation fails after multiple attempts", async () => {
    mockChatClient.chatCompletion.mockRejectedValue(new Error("API Error"));

    await expect(translateSummarySection(mockSummary, "es")).rejects.toThrow(
      "Failed to translate summary section after multiple attempts.",
    );

    expect(mockChatClient.chatCompletion).toHaveBeenCalledTimes(2); // Default maxAttempts = 2
  });
});
