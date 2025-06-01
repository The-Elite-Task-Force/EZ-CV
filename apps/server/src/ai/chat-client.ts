export type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionTool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
};

export type ChatCompletionParams = {
  model: string;
  messages: ChatCompletionMessage[];
  temperature?: number;
  stream?: boolean;
  tools?: ChatCompletionTool[];
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
