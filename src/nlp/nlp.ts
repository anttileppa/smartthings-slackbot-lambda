import { dockStart } from "@nlpjs/basic";
import * as model from "./nlp.json";

/**
 * NLP detected intent
 */
export type Intent = "None" | "lights.status" | "lights.off" | "scenes.list";

/**
 * Natural language processing capabilities
 */
export default class NLP {

  /**
   * Process natural language processing on given text
   * 
   * @param text text
   * @returns NLP result
   */
  public process = async (text: string): Promise<{ intent: Intent, locale: string }> => {
    const dock = await dockStart({ use: ['Basic', 'LangFi']});
    const nlp = dock.get('nlp');
    nlp.import(model);
    const response = await nlp.process(text);

    return {
      intent: response.intent,
      locale: response.locale
    };
  }

}