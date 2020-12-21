import React from 'react'
import { AddCircle } from '@material-ui/icons';
import { Collapse, Divider, Typography, IconButton} from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import { Exposure, fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from '../ExposuresAndFlightsStyles';
import ExposureForm from './ExposureForm/ExposureForm';

interface Props {
    wereConfirmedExposures: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
    exposures: Exposure[];
    handleChangeExposureDataAndFlightsField: (index: number, fieldName: string, value: any) => void;
    disableConfirmedExposureAddition: boolean;
    onExposureAdded: (wasConfirmedExposure: boolean, wasAbroad: boolean) => void
}

const addConfirmedExposureButton: string = 'הוסף חשיפה';

const PossibleExposure = (props: Props) => {
    const {
        wereConfirmedExposures,
        onExposuresStatusChange, 
        exposures, 
        handleChangeExposureDataAndFlightsField, 
        onExposureAdded, 
        disableConfirmedExposureAddition
    } = props;

    const classes = useStyles();

    return (
        <div className={classes.subForm}>
            <FormTitle title='חשיפה אפשרית' />
            <FormRowWithInput testId='wasConfirmedExposure' fieldName='האם היה מגע ידוע עם חולה מאומת?'>
              <Toggle
                value={wereConfirmedExposures}
                onChange={(e, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wereConfirmedExposures, value)
                  }
                }}
              />
            </FormRowWithInput>
            <Collapse
              in={wereConfirmedExposures}
              className={classes.additionalInformationForm}
            >
              <div>
                {
                  exposures.map((exposure, index) =>
                    exposure.wasConfirmedExposure &&
                    <>
                      <ExposureForm
                        key={(exposure.id || '') + index.toString()}
                        fieldsNames={fieldsNames}
                        exposureAndFlightsData={exposure}
                        handleChangeExposureDataAndFlightsField={
                          (fieldName: string, value: any) => handleChangeExposureDataAndFlightsField(index, fieldName, value)
                        }
                      />
                      <Divider />
                    </>
                  )
                }
                <IconButton
                  test-id='addConfirmedExposure'
                  onClick={() => onExposureAdded(true, false)}
                  disabled={disableConfirmedExposureAddition}
                >
                  <AddCircle color={disableConfirmedExposureAddition ? 'disabled' : 'primary'} />
                </IconButton>
                <Typography
                  variant='caption'
                >
                  {addConfirmedExposureButton}
                </Typography>
              </div>
            </Collapse>
          </div>
    )
}

export default PossibleExposure;
