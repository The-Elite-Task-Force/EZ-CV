import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { translateSummarySection } from "../../ai/translator";
import { mockResponse, mockSummary } from "../mocks/resumeMocks";

// Mock `getChatClient` before importing `translator`
vi.mock("../../ai/chat-client-factory", () => ({
  getChatClient: () => ({
    chatCompletion: vi.fn(),
  }),
}));

describe("translateSummarySection", () => {
  let mockChatClient: { chatCompletion: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const { getChatClient } = await import("../../ai/chat-client-factory");
    mockChatClient = vi.mocked(getChatClient());
    mockChatClient.chatCompletion.mockResolvedValue(mockResponse); // Mock the response
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should translate the original summary", async () => {
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

    expect(mockChatClient.chatCompletion).toHaveBeenCalledTimes(0);
  });
});
