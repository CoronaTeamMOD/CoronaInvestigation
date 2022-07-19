import axios from "axios";
import logger from "logger/logger";
import BorderCheckpoint from "models/BorderCheckpoint";
import { ExposureData } from "models/ExposureData";
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

export const fetchExposureData = async () :Promise<ExposureData | null>=> {
  const fetchExposureLogger = logger.setup('Fetching Exposure Data');
  fetchExposureLogger.info('launching exposures and flights request', Severity.LOW);
  try {
    const result = await axios.get(`/exposure/exposures/`);
    if (result && result.data ){
      fetchExposureLogger.info('got results back from the server', Severity.LOW);
      return result.data as ExposureData;

    }
    else if (result && ('isAxiosError' in result)) {
      throw result;
    }
    else {
      fetchExposureLogger.info('no exposure data was return from db', Severity.LOW);
      return null;
    }
  }
  catch (error) {
    fetchExposureLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
    throw error;
  }
     
};

export const fetchFlightsByAirlineID = async (airlineId : string) => {
  const fetchFlightsByAirlineIDLogger = logger.setup('fetch flights by airline id');

  fetchFlightsByAirlineIDLogger.info('launching db request' , Severity.LOW);
  const flights = await axios.get<string[]>(`/airlines/flights/${airlineId}`)
      .then(result => {
          fetchFlightsByAirlineIDLogger.info('request was successfull' , Severity.LOW);
          return result.data;
      })
      .catch(err => {
          fetchFlightsByAirlineIDLogger.error(`recived error during request, err: ${err}` , Severity.HIGH);
          return [];
      });

  return flights;
}

export const saveExposureData = async (exposureData : ExposureData) => {
  const saveExposureLogger = logger.setup('Saving Exposures And Flights tab');
  saveExposureLogger.info('launching the server request', Severity.LOW);
  try {
    const res = await axios.post('/exposure/updateExposures', exposureData);
    if (res && ('isAxiosError' in res)) {
      throw res;
    }
    saveExposureLogger.info('saved confirmed exposures, flights and resorts data successfully', Severity.LOW);
    return res;
  }
  catch (err){
   saveExposureLogger.error(`got error from server: ${err}`, Severity.HIGH);
    throw err;
  } 

}

// export const findExposureSources = async (validationDate: Date, fullname: string| null, phone: string | null, epidemiologyNumber: number) => {
//   const findExposureSourcesLogger = logger.setup('Find Exposure Sources');
//   findExposureSourcesLogger.info('launching the server request', Severity.LOW);
//   try {
//     const res = await axios.get('/exposure/findExposures',{params:{
//       validationDate,
//       fullname,
//       phone,
//       epidemiologyNumber
//     }})
//     if (res && ('isAxiosError' in res)) {
//       throw res;
//     }
//     return res;

//   }
//   catch (err) {
//     findExposureSourcesLogger.error(`got error from server: ${err}`, Severity.HIGH);
//     throw err;
//   }
// }