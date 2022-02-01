import logger from 'logger/logger';
import axios from 'axios';
import { Severity } from 'models/Logger';
import { BotInvestigationInfo, FullMutationInfo, MutationInfo } from 'models/InvestigationInfo';
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

export const fetchMutationData = async (): Promise<FullMutationInfo | null> => {
  const mutationInfoLogger = logger.setup('Fetching Mutation Info');
  try {
    const result = await axios.get('/investigationInfo/mutationInfo')
    if (result && result.data) {
      mutationInfoLogger.info('Mutation info request was successful', Severity.LOW);
      return result.data as FullMutationInfo;
    }
    else {
      mutationInfoLogger.info('no Mutation info was return from db ', Severity.LOW);
      return null;
    }
  }
  catch (error) {
    mutationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
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

export const fetchAllChatStatuses = async (): Promise<KeyValuePair[] | null> => {
  const botInvestigationInfoLogger = logger.setup('Fetching all chatstatuses');
  try {
    const result = await axios.get('landingPage/chatStatuses')
    if (result && result.data) {
      botInvestigationInfoLogger.info('all chat statuses request was successful', Severity.LOW);
      return result.data as KeyValuePair[];
    }
    else {
      botInvestigationInfoLogger.info('no chat statuses data was return from db ', Severity.LOW);
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
    if (result) {
      botInvestigationInfoLogger.info('the investigator reference status updated successfully', Severity.LOW);
      setIsLoading(false);
      return result.data;
    }
    else return null;
  }
  catch (error) {
    botInvestigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    setIsLoading(false);
    return error;
  }
}

export const updateCovidPatientFullName = async (fullName: string): Promise<any> => {
  const investigationInfoLogger = logger.setup('update covid patient fullname');
  setIsLoading(true);
  try {
    const result = await axios.post('investigationInfo/updateFullName', { fullName });
    if (result) {
      investigationInfoLogger.info('the covid patient fullname updated successfully', Severity.LOW);
      return result.data;
    }
    else return null;
  }
  catch (error) {
    investigationInfoLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    return error;
  }
}

export const updateInvestigationStatusAndComment = async (mainStatus: number, subStatus: string | null, statusReason: string | null, startTime: Date | undefined, comment: string) => {
  const updateInvestigationStatusLogger = logger.setup('Update Investigation Status and Comment');
  let requestObj = {
    investigationMainStatus: mainStatus,
    investigationSubStatus: subStatus,
    statusReason,
    startTime,
    comment
  }
  try {
    const result = await axios.post('/investigationInfo/updateInvestigationStatusAndComment', requestObj);
    if (result) {
      updateInvestigationStatusLogger.info('the investigation status and comment updated successfully', Severity.LOW);
      return result.data;
    }
    else return null;
  }
  catch (error) {
    updateInvestigationStatusLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    return error;
  }
}