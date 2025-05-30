import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { translateSummarySection } from "../../../ai/translator";
import { mockResponse, mockSummary } from "../../mocks/resumeMocks";

// Mock `getChatClient` before importing `translator`
vi.mock("../../../ai/chat-client-factory", () => ({
  getChatClient: () => ({
    chatCompletion: vi.fn(),
  }),
}));

describe("translateSummarySection", async () => {
  let mockChatClient: { chatCompletion: ReturnType<typeof vi.fn> };
  const { getChatClient } = await import("../../../ai/chat-client-factory");
  beforeEach(() => {
    mockChatClient = vi.mocked(getChatClient());
    mockChatClient.chatCompletion.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("skips empty summary", async () => {
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
  });
});
