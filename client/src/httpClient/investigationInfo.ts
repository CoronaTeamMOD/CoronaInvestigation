import logger from 'logger/logger';
import axios from 'axios';
import { Severity } from 'models/Logger';
import { BotInvestigationInfo } from 'models/InvestigationInfo';
import KeyValuePair from 'models/KeyValuePair';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';

export const fetchBotInvestigationData = async (): Promise<BotInvestigationInfo | null> => {
  const botInvestigationInfoLogger = logger.setup('Fetching investigation Info');
  try {
    const result = await axios.get('/investigationInfo/botInvestigationInfo')
    if (result && result.data) {
      botInvestigationInfoLogger.info('bot investigation info request was successful', Severity.LOW);
      return result.data as BotInvestigationInfo;
    }
    else {
      botInvestigationInfoLogger.info('no bot investigation info was return from db ', Severity.LOW);
      return null;
    }
  }
  catch (error) {
    botInvestigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    return null;
  }
}

export const fetchAllInvestigatorReferenceStatuses = async (): Promise<KeyValuePair[] | null> => {
  const botInvestigationInfoLogger = logger.setup('Fetching all investigator reference statuses');
  try {
    const result = await axios.get('landingPage/investigatorReferenceStatuses')
    if (result && result.data) {
      botInvestigationInfoLogger.info('all investigator reference statuses request was successful', Severity.LOW);
      return result.data as KeyValuePair[];
    }
    else {
      botInvestigationInfoLogger.info('no investigator reference statuses data was return from db ', Severity.LOW);
      return null;
    }
  }
  catch (error) {
    botInvestigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    return null;
  }
}

export const updateInvestigatorReferenceStatus = async (investigatorReferenceStatusId: number): Promise<any> => {
  const botInvestigationInfoLogger = logger.setup('update investigator reference status of bot investigation');
  setIsLoading(true);
  try {
    const result = await axios.post('investigationInfo/updateInvestigatorReferenceStatus', { investigatorReferenceStatusId });
    console.log('res', result)
    if (result) {
      botInvestigationInfoLogger.info('the investigator reference status updated successfully', Severity.LOW);
      setIsLoading(false);
      return result.data as KeyValuePair[];
    }
    else return null;
  }
  catch (error) {
    botInvestigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    setIsLoading(false);
    console.log('err', error);
    return error;
  }
}