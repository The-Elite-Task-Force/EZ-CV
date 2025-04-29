/* eslint-disable unicorn/filename-case */
import { OpenAI } from "openai";

import type { ChatClient, ChatCompletionParams, ChatCompletionResponse } from "./chat-client";

export class OpenAIClient implements ChatClient {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    // Call OpenAI's chat completions API.
    const response = await this.client.chat.completions.create({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature,
      stream: params.stream,
    });
    if ("choices" in response) {
      return response as ChatCompletionResponse;
    }
    throw new Error("Unexpected response type: missing 'choices' property.");
  }
}
