/* eslint-disable unicorn/filename-case */
// Depending on the package you use for Azure OpenAI, import its client.
// For example purposes, we assume a generic azure client API.
import { Logger } from "@nestjs/common";
import { OpenAI } from "openai";

import type { ChatClient, ChatCompletionParams, ChatCompletionResponse } from "./chat-client";

export class AzureOpenAIClient implements ChatClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, endpoint: string, model: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: endpoint,
      defaultHeaders: {
        "api-key": apiKey,
      },
    });
    this.model = model;
  }

  async chatCompletion(
    params: Omit<ChatCompletionParams, "model">,
  ): Promise<ChatCompletionResponse> {
    const response = await (params.tools
      ? this.client.chat.completions.create({
          model: this.model,
          messages: params.messages,
          temperature: params.temperature,
          stream: params.stream,
          functions: params.tools.map((tool) => ({
            name: tool.function.name,
            description: tool.function.description,
            parameters: tool.function.parameters,
          })),
        })
      : this.client.chat.completions.create({
          model: this.model,
          messages: params.messages,
          temperature: params.temperature,
          stream: params.stream,
        }));

    if ("choices" in response) {
      return response as ChatCompletionResponse;
    }
    Logger.error(response);
    throw new Error("Unexpected response type: missing 'choices' property.");
  }
}
