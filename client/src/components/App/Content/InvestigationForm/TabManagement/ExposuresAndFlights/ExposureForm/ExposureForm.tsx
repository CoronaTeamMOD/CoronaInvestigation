import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, MenuItem, Typography } from '@material-ui/core';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import CovidPatient from 'models/CovidPatient';
import DatePick from 'commons/DatePick/DatePick';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import ExposureFields from 'models/enums/ExposureFields';
import CovidPatientFields from 'models/CovidPatientFields';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ExposureSearchTextField from 'components/App/Content/InvestigationForm/TabManagement/ExposuresAndFlights/ExposureForm/ExposureSearchTextField/ExposureSearchTextField';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './ExposureFormStyles';

const MAX_DATE_ERROR_MESSAGE =  'לא ניתן להזין תאריך מאוחר מתאריך תחילת המחלה';
const INVALID_DATE_ERROR_MESSAGE =  'תאריך לא חוקי';

const displayPatientFields: CovidPatientFields = {
  fullName: 'שם',
  age: 'גיל',
  address: 'כתובת',
}

const allCovidPatientFields: CovidPatientFields = {
  ...displayPatientFields,
  epidemiologyNumber: 'מספר אפידמיולוגי',
  identityNumber: 'מספר זיהוי',
  primaryPhone: 'מספר טלפון',
}

const minFullNameLengthToSearch = 2;
const minNumbersLengthToSearch = 4;
const invalidAge = -1;

export const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;

const ExposureForm = (props: any) => {
  const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField } = props;

  const classes = useStyles();
  const formClasses = useFormStyles();
  const { alertError } = useCustomSwal();

  const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

  const [exposureSourceSearch, setExposureSourceSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [optionalCovidPatients, setOptionalCovidPatients] = useState<CovidPatient[]>([]);

  const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

  const selectedExposureSourceDisplay = (exposureSource: CovidPatient): string => {
    const fields: string[] = [];
    exposureSource.fullName && fields.push(displayPatientFields.fullName + ': ' + exposureSource.fullName);
    (exposureSource.age && exposureSource.age !== -1) && fields.push(displayPatientFields.age + ': ' + exposureSource.age);
    exposureSource.address && fields.push(displayPatientFields.address + ': ' + exposureSource.address);
    return fields.join(', ');
  }

  const minSourceSearchLengthToSearch: number = React.useMemo(
    () => phoneAndIdentityNumberRegex.test(exposureSourceSearch) ? minNumbersLengthToSearch : minFullNameLengthToSearch,
    [exposureSourceSearch]);

  const createExposureSourceOption = (exposureSource: CovidPatient) => {
    const { address, age, epidemiologyNumber, fullName, identityNumber, primaryPhone } = exposureSource;
    return <>
      {fullName && <Typography className={[classes.optionField, !phoneAndIdentityNumberRegex.test(exposureSourceSearch) && classes.searchedField].join(' ')}>{allCovidPatientFields.fullName + ': ' + fullName}</Typography>}
      {epidemiologyNumber && <Typography className={classes.optionField}>{allCovidPatientFields.epidemiologyNumber + ': ' + epidemiologyNumber}</Typography>}
      {identityNumber && <Typography className={[classes.optionField, identityNumber.includes(exposureSourceSearch) && classes.searchedField].join(' ')}>{allCovidPatientFields.identityNumber + ': ' + identityNumber}</Typography>}
      {primaryPhone && <Typography className={[classes.optionField, primaryPhone.includes(exposureSourceSearch) && classes.searchedField].join(' ')}>{allCovidPatientFields.primaryPhone + ': ' + primaryPhone}</Typography>}
      {(age && age !== invalidAge) && <Typography className={classes.optionField}>{allCovidPatientFields.age + ': ' + age}</Typography>}
      {address && <Typography className={classes.optionField}>{allCovidPatientFields.address + ': ' + address}</Typography>}
    </>
  }

  const searchForExposures = () => {
    if (exposureAndFlightsData.exposureSource || exposureSourceSearch.length < minSourceSearchLengthToSearch) setOptionalCovidPatients([]);
    else {
      const confirmedExposuresLogger = logger.setup('Fetching list of confirmed exposures');
      setIsLoading(true);
      confirmedExposuresLogger.info(`launching request with parameters ${exposureSourceSearch} and ${validationDate}`, Severity.LOW);
      axios.get(`/exposure/optionalExposureSources/${exposureSourceSearch}/${validationDate}`)
        .then(result => {
          if (result?.data && result.headers['content-type'].includes('application/json')) {
            confirmedExposuresLogger.info('got results back from the server', Severity.LOW);
            setOptionalCovidPatients(result.data);
          } else {
            confirmedExposuresLogger.warn('got status 200 but wrong data', Severity.HIGH);
            alertError('לא הצלחנו לטעון את רשימת המאומתים', {
              text: 'שימו לב שהזנתם נתונים תקינים'
            });
          }
        })
        .catch((error) => {
          confirmedExposuresLogger.error(`got error from server: ${error}`, Severity.HIGH);
          alertError('לא הצלחנו לטעון את רשימת המאומתים', {
            text: 'שימו לב שהזנתם נתונים תקינים'
          });
        })
        .finally(() => setIsLoading(false));
    }
  }

  useEffect(() => {
    if (exposureAndFlightsData.exposureSource) {
      setExposureSourceSearch(selectedExposureSourceDisplay(exposureAndFlightsData.exposureSource));
    } else {
      setOptionalCovidPatients([]);
    }
  }, [exposureAndFlightsData.exposureSource]);

  return (
    <Grid className={formClasses.form} container justify='flex-start'>
      <FormRowWithInput fieldName='פרטי החולה:'>
        <>
          <ExposureSearchTextField
            name={ExposureFields.exposureSource}
            className={classes.exposureSourceTextFied}
            onChange={(event) => {
              setExposureSourceSearch(event);
              (!event || !event.includes(':')) && handleChangeExposureDataAndFlightsField(fieldsNames.exposureSource, null);
            }}
            value={exposureSourceSearch}
            onSearchClick={searchForExposures}
          />
        </>
      </FormRowWithInput>

      {
        (isLoading || optionalCovidPatients?.length > 0) &&
        <FormRowWithInput fieldName=''>
          <div className={classes.optionalExposureSources}>
            {
              isLoading ?
                  <div className={classes.loadingDiv}>
                    <CircularProgress className={classes.loadingSpinner} size='5vh' />
                  </div>
                  :
                  <div>
                    {
                      optionalCovidPatients.filter((exposureSource) => exposureSource.epidemiologyNumber !== epidemiologyNumber).map(exposureSource => (
                          <MenuItem
                              className={classes.optionalExposureSource}
                              key={exposureSource.epidemiologyNumber}
                              value={exposureSource.epidemiologyNumber}
                              onClick={() => {
                                  setOptionalCovidPatients([]);
                                  handleChangeExposureDataAndFlightsField(fieldsNames.exposureSource, exposureSource);
                              }}>
                              {createExposureSourceOption(exposureSource)}
                          </MenuItem>
                      ))
                    }
                  </div>
            }
          </div>
        </FormRowWithInput>
      }

      <FormRowWithInput fieldName='תאריך החשיפה:'>
        <DatePick
          maxDateMessage={MAX_DATE_ERROR_MESSAGE}
          invalidDateMessage={INVALID_DATE_ERROR_MESSAGE}
          FormHelperTextProps={{classes:{root: classes.errorLabel}}}
          maxDate={new Date(validationDate)}
          testId='exposureDate'
          labelText='תאריך'
          value={exposureAndFlightsData[fieldsNames.date]}
          onChange={(newDate: Date) =>
            handleChangeExposureDataAndFlightsField(fieldsNames.date, newDate)
          }
        />
      </FormRowWithInput>

      <FormRowWithInput testId='exposureAddress' fieldName='כתובת החשיפה:'>
        <Map
          name={fieldsNames.address}
          setSelectedAddress={(newAddress) => handleChangeExposureDataAndFlightsField(fieldsNames.address, newAddress)}
          selectedAddress={exposureAndFlightsData[fieldsNames.address]}
        />
      </FormRowWithInput>

      <PlacesTypesAndSubTypes size='Tab'
        placeTypeName={fieldsNames.placeType}
        placeSubTypeName={fieldsNames.placeSubType}
        placeType={exposureAndFlightsData[fieldsNames.placeType]}
        placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
        onPlaceTypeChange={(value) =>
          handleChangeExposureDataAndFlightsField(fieldsNames.placeType, value)
        }
        onPlaceSubTypeChange={(placeSubType: PlaceSubType | null) =>
          handleChangeExposureDataAndFlightsField(fieldsNames.placeSubType, placeSubType?.id || null)
        }
      />
    </Grid>
  );
};

export default ExposureForm;
