import axios from "axios";
import logger from "logger/logger";
import BorderCheckpoint from "models/BorderCheckpoint";
import KeyValuePair from "models/KeyValuePair";
import { Severity } from "models/Logger";

export const fetchAllBorderCheckpointTypes = async (): Promise<KeyValuePair[] | null> => {
  const botrderCheckpointTypesLogger = logger.setup('Fetching all border checkpoint types');
  try {
    const result = await axios.get('exposure/borderCheckpointTypes')
    if (result && result.data) {
      botrderCheckpointTypesLogger.info('all border checkpoint types request was successful', Severity.LOW);
      return result.data as KeyValuePair[];
    }
    else if (result && ('isAxiosError' in result)) {
      throw result;
    }
    else {
      botrderCheckpointTypesLogger.info('no border checkpoint types data was return from db ', Severity.LOW);
      return null;
    }
  }
  catch (error) {
    botrderCheckpointTypesLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    throw error;
  }
}

export const fetchAllBorderCheckpoints = async (): Promise<BorderCheckpoint[] | null> => {
  const botrderCheckpointsLogger = logger.setup('Fetching all border checkpoints');
  try {
    const result = await axios.get('exposure/borderCheckpoints')
    if (result && result.data) {
      botrderCheckpointsLogger.info('all border checkpoints request was successful', Severity.LOW);
      return result.data as BorderCheckpoint[];
    }
    else if (result && ('isAxiosError' in result)) {
      throw result;
    }
    else {
      botrderCheckpointsLogger.info('no border checkpoint data was return from db ', Severity.LOW);
      return null;
    }
  }
  catch (error) {
    botrderCheckpointsLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    throw error;
  }
}