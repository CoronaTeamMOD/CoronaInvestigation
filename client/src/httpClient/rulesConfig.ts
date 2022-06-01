import axios from "axios";
import logger from "logger/logger";
import { Severity } from "models/Logger";
import RulesConfig from "models/RulesConfig";

export const getRulesConfigByKey = async (key: string):  Promise<RulesConfig | null> => {
  const ruleConfigLogger = logger.setup('Getting rules config by key');
  try {
    const result = await axios.get(`landingPage/getRulesConfigByKey/${key}`)
    if (result && result.data) {
      ruleConfigLogger.info('rules config by key request was successful', Severity.LOW);
      return result.data as RulesConfig;
    }
    else if (result &&  ('isAxiosError' in result)) {
      throw result;
   }
    else {
      ruleConfigLogger.info('no rules config data was return from db ', Severity.LOW);
      return null;
    }
  }
  catch (error) {
      ruleConfigLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    return null;
  }
}