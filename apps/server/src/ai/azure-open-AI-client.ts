/* eslint-disable unicorn/filename-case */
// Depending on the package you use for Azure OpenAI, import its client.
// For example purposes, we assume a generic azure client API.
import { Logger } from "@nestjs/common";
import { OpenAI } from "openai";

import type { ChatClient, ChatCompletionParams, ChatCompletionResponse } from "./chat-client";

export class AzureOpenAIClient implements ChatClient {
  private client: OpenAI;

  constructor(apiKey: string, endpoint: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: endpoint,
      defaultHeaders: {
        "api-key": apiKey,
      },
    });
  }

  async chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse> {
    const response = await this.client.chat.completions.create({
      model: params.model, // For Azure, `model` is your Deployment Name
      messages: params.messages,
      temperature: params.temperature,
      stream: params.stream,
    });
    if ("choices" in response) {
      return response as ChatCompletionResponse;
    }
    Logger.error(response);
    throw new Error("Unexpected response type: missing 'choices' property.");
  }
}
