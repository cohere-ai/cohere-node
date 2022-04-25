import * as models from './models';
import API from './services/api_service';

enum ENDPOINT {
  GENERATE = '/generate',
  EMBED = '/embed',
  CHOOSE_BEST = '/choose-best',
  CLASSIFY = '/classify',
  EXTRACT = '/extract',
}

const COHERE_EMBED_BATCH_SIZE = 5;

interface CohereService {
  init(key: string, version?: string): void;
  generate(
    model: string,
    config: models.generate
  ): Promise<models.cohereResponse<models.text>>;
  embed(
    model: string,
    config: models.embed
  ): Promise<models.cohereResponse<models.embeddings>>;
  chooseBest(
    model: string,
    config: models.chooseBest
  ): Promise<models.cohereResponse<models.scores>>;
  extract(
    model: string,
    config: models.extract
  ): Promise<models.cohereResponse<models.extraction[]>>;
}

class Cohere implements CohereService {
  public init(key: string, version?: string): void {
    API.init(key, version);
  }

  private makeRequest(
    model: string,
    endpoint: string,
    data: models.cohereParameters
  ): Promise<models.cohereResponse<models.responseBody>> {
    return API.post(`/${model}${endpoint}`, data);
  }

  /** Generates realistic text conditioned on a given input.
   * See: https://docs.cohere.ai/generate-reference
   */
  public generate(
    model: string,
    config: models.generate
  ): Promise<models.cohereResponse<models.text>> {
    return this.makeRequest(model, ENDPOINT.GENERATE, config) as Promise<
      models.cohereResponse<models.text>
    >;
  }

  /** Returns text embeddings. An embedding is a list of floating point numbers that captures semantic
   * information about the text that it represents.
   * See: https://docs.cohere.ai/embed-reference
   */
  public embed(
    model: string,
    config: models.embed
  ): Promise<models.cohereResponse<models.embeddings>> {
    const createBatches = (array: string[]) => {
      const result = [];
      for (const value of array) {
        const lastArray = result[result.length - 1];
        if (!lastArray || lastArray.length === COHERE_EMBED_BATCH_SIZE) {
          result.push([value]);
        } else {
          lastArray.push(value);
        }
      }
      return result;
    };

    return Promise.all(
      createBatches(config.texts).map(
        (texts) =>
          this.makeRequest(model, ENDPOINT.EMBED, {
            ...config,
            texts,
          }) as Promise<models.cohereResponse<models.embeddings>>
      )
    ).then((results) => {
      let embeddings: number[][] = [];
      results.forEach((result) => {
        embeddings = embeddings.concat(result.body.embeddings);
      });

      const response: models.cohereResponse<models.embeddings> = {
        statusCode: results[0].statusCode,
        body: { embeddings },
      };

      return response;
    });
  }

  /**  Uses likelihood to perform classification. Given a query text that you'd like to classify between
   * a number of options, Choose Best will return a score between the query and each option.
   * See: https://docs.cohere.ai/choose-best-reference
   */
  /**
   * @deprecated Will be deleted in favor of 'classify'.
   */
  public chooseBest(
    model: string,
    config: models.chooseBest
  ): Promise<models.cohereResponse<models.scores>> {
    return this.makeRequest(model, ENDPOINT.CHOOSE_BEST, config) as Promise<
      models.cohereResponse<models.scores>
    >;
  }

  /**
   * Classifies text as one of the given labels. Returns a confidence score for each label.\
   * See: https://docs.cohere.ai/classify-reference
   */
  public classify(
    model: string,
    config: models.classify
  ): Promise<models.cohereResponse<models.classifications>> {
    return this.makeRequest(model, ENDPOINT.CLASSIFY, config) as Promise<
      models.cohereResponse<models.classifications>
    >;
  }

  /**
   * Extract text from texts, with examples
   */
  public extract(
    model: string,
    config: models.extract
  ): Promise<models.cohereResponse<models.extraction[]>> {
    return this.makeRequest(model, ENDPOINT.EXTRACT, config) as Promise<
      models.cohereResponse<models.extraction[]>
    >;
  }
}
const cohere = new Cohere();
export = cohere;
