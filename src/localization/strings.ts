import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import * as en from "./en.json";
import * as fi from "./fi.json";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  slackbot: {
    common: {
      unkownMessage: string;
    },
    lightsOff: {
      turningOff: string;
      noSceneId: string;
      lightsAreOff: string;
    },
    lightStatus: {
      checking: string;
      lightsOn: string;
      lightsAllOn: string;
      lightsAllOff: string;
      error: string;
    },
    scenesList: {
      listing: string;
      scenes: string;
    }
  }

}

const strings: IStrings = new LocalizedStrings({
  en: en,
  fi: fi
});

export default strings;