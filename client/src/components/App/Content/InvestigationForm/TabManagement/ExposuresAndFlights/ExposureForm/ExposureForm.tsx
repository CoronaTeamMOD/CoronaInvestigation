import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, MenuItem } from '@material-ui/core';

import Map from 'commons/Map/Map';
import useFormStyles from 'styles/formStyles';
import PlaceSubType from 'models/PlaceSubType';
import CovidPatient from 'models/CovidPatient';
import DatePick from 'commons/DatePick/DatePick';
import StoreStateType from 'redux/storeStateType';
import ExposureFields from 'models/enums/ExposureFields';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import ExposureSearchTextField from 'commons/AlphabetTextField/ExposureSearchTextField';
import PlacesTypesAndSubTypes from 'commons/Forms/PlacesTypesAndSubTypes/PlacesTypesAndSubTypes';

import useStyles from './ExposureFormStyles';
import useExposureForm from './useExposureForm';
import ExposureSourceOption from './ExposureSourceOption';

const INSERT_EXPOSURE_SOURCE_SEARCH = 'הזן שם פרטי, שם משפחה, מספר זיהוי או מספר טלפון';
const MAX_DATE_ERROR_MESSAGE =  'לא ניתן להזין תאריך מאוחר מתאריך תחילת המחלה';
const INVALID_DATE_ERROR_MESSAGE =  'תאריך לא חוקי';

export const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;

const ExposureForm = (props: any) => {
  const { exposureAndFlightsData, fieldsNames, handleChangeExposureDataAndFlightsField } = props;
 
  const classes = useStyles();
  const formClasses = useFormStyles();

  const validationDate = useSelector<StoreStateType, Date>(state => state.investigation.validationDate);

  const [exposureSourceSearchString, setExposureSourceSearchString] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [optionalCovidPatients, setOptionalCovidPatients] = useState<CovidPatient[]>([]);

  const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);

  const {
    fetchOptionalCovidPatients,
    selectedExposureSourceDisplay
  } = useExposureForm({
    exposureAndFlightsData,
    exposureSourceSearchString
  })

  useEffect(() => {
    const setOptionalCovidPatientsAsync = async () => {
      const optionalCovidPatients = await fetchOptionalCovidPatients({setIsLoading});
      setOptionalCovidPatients(optionalCovidPatients);
    }
    setOptionalCovidPatientsAsync();
  }, [exposureSourceSearchString]);

  useEffect(() => {
    if(Boolean(exposureAndFlightsData.exposureSource)) {
      setExposureSourceSearchString(
        selectedExposureSourceDisplay(
          exposureAndFlightsData.exposureSource
        ));
    }
  }, [exposureAndFlightsData.exposureSource]);

  return (
    <Grid className={formClasses.form} container justify='flex-start'>
      <FormRowWithInput fieldName='פרטי החולה:'>
          <ExposureSearchTextField
            name={ExposureFields.exposureSource}
            className={classes.exposureSourceTextFied}
            onChange={(event) => {
              setExposureSourceSearchString(event);
              (!event || !event.includes(':')) && handleChangeExposureDataAndFlightsField(fieldsNames.exposureSource, null);
            }}
            value={exposureSourceSearchString}
            test-id='exposureSource'
            placeholder={INSERT_EXPOSURE_SOURCE_SEARCH}
          />
      </FormRowWithInput>

      { (isLoading || optionalCovidPatients?.length > 0) &&
        <FormRowWithInput fieldName=''>
          <div className={classes.optionalExposureSources}>
            { isLoading ?
                  <div className={classes.loadingDiv}>
                    <CircularProgress className={classes.loadingSpinner} size='5vh' />
                  </div>
                  :
                  <div>
                    {
                      optionalCovidPatients
                        .filter((exposureSource) => exposureSource.epidemiologyNumber !== epidemiologyNumber)
                        .map(exposureSource => (
                          <MenuItem
                            className={classes.optionalExposureSource}
                            key={exposureSource.epidemiologyNumber}
                            value={exposureSource.epidemiologyNumber}
                            onClick={() => {
                              setOptionalCovidPatients([]);
                              handleChangeExposureDataAndFlightsField(fieldsNames.exposureSource, exposureSource);
                            }}>
                            <ExposureSourceOption 
                                exposureSource={exposureSource} 
                                exposureSourceSearchString={exposureSourceSearchString} 
                            />
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
