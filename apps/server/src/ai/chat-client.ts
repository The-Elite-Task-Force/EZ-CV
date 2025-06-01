export type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionParams = {
  model: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  stream?: boolean;
  tools?: {
    function: {
      name: string;
      description: string;
      parameters: Record<string, unknown>;
    };
  };
};

export type ChatCompletionChoice = {
  message: ChatCompletionMessage;
};

export type ChatCompletionResponse = {
  choices: ChatCompletionChoice[];
};

export type ChatClient = {
  chatCompletion(params: ChatCompletionParams): Promise<ChatCompletionResponse>;
};
