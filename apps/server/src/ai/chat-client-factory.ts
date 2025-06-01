import { AzureOpenAIClient } from "./azure-open-AI-client";
import type { ChatClient } from "./chat-client";
import { OpenAIClient } from "./open-AI-client";

// Singleton instance of ChatClient
let chatClientInstance: ChatClient | null = null;

//factory function to create a chat client based on environment variables
// if USE_AZURE is true, create an AzureOpenAIClient, otherwise create an OpenAIClient
// this allows for easy switching between the two clients without changing the code

export function getChatClient(): ChatClient {
  if (chatClientInstance) {
    return chatClientInstance;
  }

  if (process.env.USE_AZURE === "true") {
    const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
    const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    if (!azureApiKey || !azureEndpoint) {
      throw new Error(
        "AZURE_API_KEY or AZURE_ENDPOINT is not defined in the environment variables.",
      );
    }
    chatClientInstance = new AzureOpenAIClient(azureApiKey, azureEndpoint);
    return chatClientInstance;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined in the environment variables.");
  }
  chatClientInstance = new OpenAIClient(apiKey);
  return chatClientInstance;
}
