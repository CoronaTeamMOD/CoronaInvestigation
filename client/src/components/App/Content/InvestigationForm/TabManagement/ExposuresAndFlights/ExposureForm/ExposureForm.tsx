import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, MenuItem, TextField, Typography } from '@material-ui/core';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import CovidPatient from 'models/CovidPatient';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import CovidPatientFields from 'models/CovidPatientFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './ExposureFormStyles';

const INSERT_EXPOSURE_SOURCE_SEARCH = 'הזן שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';

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

const invalidCharRegex = /[^א-ת\da-zA-Z0-9]/;
const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;

const ExposureForm = (props: any) => {
  const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField, coronaTestDate, } = props;

  const classes = useStyles();
  const formClasses = useFormStyles();

  const [exposureSourceSearch, setExposureSourceSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [optionalCovidPatients, setOptionalCovidPatients] = useState<CovidPatient[]>([]);

  const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
  const userId = useSelector<StoreStateType, string>(state => state.user.id);

  const selectedExposureSourceDisplay = (exposureSource: CovidPatient): string => {
    const fields: string[] = [];
    exposureSource.fullName && fields.push(displayPatientFields.fullName + ': ' + exposureSource.fullName);
    (exposureSource.age && exposureSource.age !== -1) && fields.push(displayPatientFields.age + ': ' + exposureSource.age);
    exposureSource.address && fields.push(displayPatientFields.address + ': ' + exposureSource.address);
    return fields.join(', ');
  }

  const exposureSourceSearchRegex = React.useMemo(() => {
    try {
      return new RegExp(exposureSourceSearch.trimEnd().replace(new RegExp(invalidCharRegex, 'g'), '[ -]+[^0-9A-Za-z]*') + '*');
    } catch {
      return null;
    }
  }, [exposureSourceSearch]);

  const minSourceSearchLengthToSearch: number = React.useMemo(
    () => phoneAndIdentityNumberRegex.test(exposureSourceSearch) ? minNumbersLengthToSearch : minFullNameLengthToSearch,
    [exposureSourceSearch]);

  const createExposureSourceOption = (exposureSource: CovidPatient) => {
    const { address, age, epidemiologyNumber, fullName, identityNumber, primaryPhone } = exposureSource;
    if (!exposureSourceSearchRegex) return <></>
    return <>
      {fullName && <Typography className={[classes.optionField, exposureSourceSearchRegex.test(fullName) && classes.searchedField].join(' ')}>{allCovidPatientFields.fullName + ': ' + fullName}</Typography>}
      {epidemiologyNumber && <Typography className={classes.optionField}>{allCovidPatientFields.epidemiologyNumber + ': ' + epidemiologyNumber}</Typography>}
      {identityNumber && <Typography className={[classes.optionField, identityNumber.includes(exposureSourceSearch) && classes.searchedField].join(' ')}>{allCovidPatientFields.identityNumber + ': ' + identityNumber}</Typography>}
      {primaryPhone && <Typography className={[classes.optionField, primaryPhone.includes(exposureSourceSearch) && classes.searchedField].join(' ')}>{allCovidPatientFields.primaryPhone + ': ' + primaryPhone}</Typography>}
      {age && <Typography className={classes.optionField}>{allCovidPatientFields.age + ': ' + age}</Typography>}
      {address && <Typography className={classes.optionField}>{allCovidPatientFields.address + ': ' + address}</Typography>}
    </>
  }

  useEffect(() => {
    if (exposureAndFlightsData.exposureSource || exposureSourceSearch.length < minSourceSearchLengthToSearch) setOptionalCovidPatients([]);
    else {
      setIsLoading(true);
      logger.info({
        service: Service.CLIENT,
        severity: Severity.LOW,
        workflow: 'Fetching list of confirmed exposures',
        step: `launching request with parameters ${exposureSourceSearch} and ${coronaTestDate}`,
        user: userId,
        investigation: epidemiologyNumber
      });
      axios.get(`/exposure/optionalExposureSources/${exposureSourceSearch}/${coronaTestDate}`)
        .then(result => {
          if (result?.data) {
            logger.info({
              service: Service.CLIENT,
              severity: Severity.LOW,
              workflow: 'Fetching list of confirmed exposures',
              step: 'got results back from the server',
              user: userId,
              investigation: epidemiologyNumber
            });
            setOptionalCovidPatients(result.data);
          } else {
            logger.warn({
              service: Service.CLIENT,
              severity: Severity.HIGH,
              workflow: 'Fetching list of confirmed exposures',
              step: 'got status 200 but wrong data'
            });
          }
        })
        .catch((error) => {
          logger.error({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Fetching list of confirmed exposures',
            step: `got error from server: ${error}`,
            investigation: epidemiologyNumber,
            user: userId
          });
          Swal.fire({
            title: 'לא ניתן היה לטעון את החולים האפשריים',
            icon: 'error',
          })
        })
        .finally(() => setIsLoading(false));
    }
  }, [exposureSourceSearch]);

  useEffect(() => {
    exposureAndFlightsData.exposureSource &&
      setExposureSourceSearch(selectedExposureSourceDisplay(exposureAndFlightsData.exposureSource));
  }, [exposureAndFlightsData.exposureSource]);

  return (
    <Grid className={formClasses.form} container justify='flex-start'>
      <FormRowWithInput fieldName='פרטי החולה:'>
        <>
          <TextField
            className={classes.exposureSourceTextFied}
            onChange={(event) => {
              setExposureSourceSearch(event.target.value);
              (!event.target.value || !event.target.value.includes(':')) && handleChangeExposureDataAndFlightsField(fieldsNames.exposureSource, null);
            }}
            value={exposureSourceSearch}
            test-id='exposureSource'
            id={fieldsNames.exposureSource}
            placeholder={INSERT_EXPOSURE_SOURCE_SEARCH}
          />
          <div className={classes.optionalExposureSources}>
            {
              isLoading ? <CircularProgress className={classes.loadingSpinner} size='5vh' /> :
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
        </>
      </FormRowWithInput>

      <FormRowWithInput fieldName='תאריך החשיפה:'>
        <DatePick
          maxDate={new Date()}
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

      <PlacesTypesAndSubTypes
        placeTypeName={fieldsNames.placeType}
        placeSubTypeName={fieldsNames.placeSubType}
        placeType={exposureAndFlightsData[fieldsNames.placeType]}
        placeSubType={exposureAndFlightsData[fieldsNames.placeSubType]}
        onPlaceTypeChange={(value) =>
          handleChangeExposureDataAndFlightsField(fieldsNames.placeType, value)
        }
        onPlaceSubTypeChange={(placeSubType: PlaceSubType) =>
          handleChangeExposureDataAndFlightsField(fieldsNames.placeSubType, placeSubType.id)
        }
      />
    </Grid>
  );
};

export default ExposureForm;
