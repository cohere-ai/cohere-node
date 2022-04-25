export interface cohereResponse<T> {
  statusCode: number | undefined;
  body: T;
}

/*-- function parameters --*/
export interface generate {
  /** Represents the prompt or text to be completed. */
  prompt: string;
  /** Denotes the number of tokens to predict per generation. */
  max_tokens: number;
  /** Denotes the maximum number of generations that will be returned. Defaults to 1, max value of 5. */
  num_generations?: number;
  /** A non-negative float that tunes the degree of randomness in generation. */
  temperature: number;
  /** If set to a positive integer, it ensures only the top k most likely tokens are considered for generation at each step. */
  k?: number;
  /** If set to a probability 0.0 < p < 1.0, it ensures that only the most likely tokens,
   * with total probability mass of p, are considered for generation at each step. If both k and
   * p are enabled, p acts after k. Max value of 1.0.
   */
  p?: number;
  /** Can be used to reduce repetitiveness of generated tokens. Similar to frequency_penalty,
   * except that this penalty is applied equally to all tokens that have already appeared, regardless
   * of their exact frequencies. Max value of 1.0.
   */
  presence_penalty?: number;
  /** Can be used to reduce repetitiveness of generated tokens. The higher the value,
   * the stronger a penalty is applied to previously present tokens, proportional to how many
   * times they have already appeared in the prompt or prior generation. Max value of 1.0.
   */
  frequency_penalty?: number;
  /** A stop sequence will cut off your generation at the end of the sequence. Providing multiple
   * stop sequences in the array will cut the generation at the first stop sequence in the generation,
   * if applicable.
   */
  stop_sequences?: string[];
  /** One of GENERATION|ALL|NONE to specify how and if the token likelihoods are returned with
   * the response. If GENERATION is selected, the token likelihoods will only be provided for generated
   * text. If ALL is selected, the token likelihoods will be provided both for the prompt and the generated
   * text.
   */
  return_likelihoods?: 'GENERATION' | 'ALL' | 'NONE';
}

export interface embed {
  /** An array of strings for the model to embed. */
  texts: string[];
  /** Specifies how the API will handle inputs longer than the maximum token length. */
  truncate?: 'NONE' | 'LEFT' | 'RIGHT';
}

export interface chooseBest {
  /** Used to query the options. */
  query: string;
  /** Each string concatenates to the query. */
  options: string[];
  /** One of PREPEND_OPTION|APPEND_OPTION to specify where the option string will be placed and
   * how to compute the log-likelihood.
   */
  mode: 'PREPEND_OPTION' | 'APPEND_OPTION';
}

export interface classify {
  /** An array of strings that you would like to classify. */
  inputs: string[];
  /** An array of examples representing examples and the corresponding label. */
  examples: { text: string; label: string }[];
  /** An optional string to append onto every example and text prior to the label. */
  outputIndicator?: string;
  /** An optional string representing what you'd like the model to do. */
  taskDescription?: string;
}

export type cohereParameters =
  | generate
  | embed
  | chooseBest
  | classify
  | extract;

/* -- responses -- */
export interface text {
  /** Contains the generated text. */
  text: string;
  /** The sum of the log-likehoods of each token in the string. */
  likelihood: number;
  /** Only returned if `return_likelihoods` is not set to NONE. The likelihood. */
  token_likelihoods?: {
    /** The token. */
    token: string;
    /** Refers to the log-likelihood of the token. The first token of a context will not
     * have a likelihood.
     * */
    likelihood?: number;
  };
  [key: string]: any;
}

export interface embeddings {
  /** An array of embeddings, where each embedding is an array of floats. The length of the embeddings
   * array will be the same as the length of the original texts array.
   */
  embeddings: number[][];
  [key: string]: any;
}

export interface scores {
  /** An array of floats corresponding to a score for each of the options, where a higher score
   * represents a more likely query-option pair.
   */
  scores: number[];
  /** An array of tokens corresponding to the tokens for each of the options. */
  tokens: string[][];
  /** An array of log likelihoods corresponding to the tokens of each of the options. */
  token_log_likelihoods: number[][];
  [key: string]: any;
}

export interface token_likelihoods {
  /** The sum of the log-likehoods of each token in the string. */
  likelihood: number;
  token_likelihoods: {
    /** The token. */
    token: string;
    /** Refers to the log-likelihood of the token. The first token of a context will not
     * have a likelihood.
     * */
    likelihood?: number;
  };
  [key: string]: any;
}

export interface classifications {
  classifications: {
    /** The input that is being classified. */
    input: string;
    /** The predicted label for the input. */
    prediction: string;
    /** The confidence score for each option. */
    confidences: { label: string; value: number }[];
  }[];
}

export interface extraction {
  id: string;
  text: string;
  entities: extractEntity[];
}

export interface extractEntity {
  type: string;
  value: string;
}
export interface extractExample {
  text: string;
  entities: extractEntity[];
}
export interface extract {
  examples: extractExample[];
  texts: string[];
}

export interface error {
  /** Text explaining what went wrong. */
  message?: string;
  [key: string]: any;
}

export type responseBody =
  | text
  | embeddings
  | scores
  | token_likelihoods
  | classifications
  | error;
