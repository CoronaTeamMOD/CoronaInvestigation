import axios from "axios";
import logger from "logger/logger";
import KeyValuePair from "models/KeyValuePair";
import { Severity } from "models/Logger";

export const getTransferReasons = async ():  Promise<KeyValuePair[] | null> => {
    const 
    TransferReasonLogger = logger.setup('Getting transfer reasons');
    try {
      const result = await axios.get(`landingPage/transferReasons`)
      if (result && result.data) {
        TransferReasonLogger.info('transfer reasons request was successful', Severity.LOW);
        return result.data as KeyValuePair[];
      }
      else if (result &&  ('isAxiosError' in result)) {
        throw result;
     }
      else {
        TransferReasonLogger.info('no transfer reason data was return from db ', Severity.LOW);
        return null;
      }
    }
    catch (error) {
        TransferReasonLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
      return null;
    }
}