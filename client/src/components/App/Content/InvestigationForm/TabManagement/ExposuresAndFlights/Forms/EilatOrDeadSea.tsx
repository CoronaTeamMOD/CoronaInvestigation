import React from 'react'

import Toggle from 'commons/Toggle/Toggle';
import FormTitle from 'commons/FormTitle/FormTitle';
import { fieldsNames } from 'commons/Contexts/ExposuresAndFlights';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';

import useStyles from '../ExposuresAndFlightsStyles';

interface Props {
    wasInEilat: boolean;
    wasInDeadSea: boolean;
    onExposuresStatusChange: (fieldName: any, value: any) => void;
}

export const EilatOrDeadSea = (props: Props) => {
    const { wasInEilat , wasInDeadSea , onExposuresStatusChange } = props;
    const classes = useStyles();

    return (
        <div className={classes.subForm}>
            <FormTitle title='חזרה מאילת או מים המלח' />
             <FormRowWithInput fieldName='חזר מאילת'>
              <Toggle
                value={wasInEilat}
                onChange={(event, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wasInEilat, value);
                  }
                }}
              />
            </FormRowWithInput>
            <FormRowWithInput fieldName='חזר מים המלח'>
              <Toggle
                value={wasInDeadSea}
                onChange={(event, value) => {
                  if (value !== null) {
                    onExposuresStatusChange(fieldsNames.wasInDeadSea, value);
                  }
                }}
              />
            </FormRowWithInput>
          </div>
    )
}
