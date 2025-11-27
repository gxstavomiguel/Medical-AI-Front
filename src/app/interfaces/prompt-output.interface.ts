export interface PromptOutput {
  threadId: string;
  output: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_token_details: {
      cached_tokens: number;
    };
    completion_tokens_details: {
      reasoning_tokens: number;
    };
  };
}
