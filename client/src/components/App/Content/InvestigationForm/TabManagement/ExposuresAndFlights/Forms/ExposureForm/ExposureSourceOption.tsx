import React from 'react';
import { Typography } from '@material-ui/core';

import CovidPatient from 'models/CovidPatient';
import CovidPatientFields from 'models/CovidPatientFields';

import useStyles from './ExposureFormStyles';
import { displayPatientFields } from './useExposureForm';

const invalidAge = -1;
const phoneAndIdentityNumberRegex = /^([\da-zA-Z]+)$/;

const allCovidPatientFields: CovidPatientFields = {
    ...displayPatientFields,
    epidemiologyNumber: 'מספר אפידמיולוגי',
    identityNumber: 'מספר זיהוי',
    primaryPhone: 'מספר טלפון',
};

const ExposureSourceOption = (props: Props) => {
    const { exposureSource, exposureSourceSearchString } = props;
    const {
        address,
        age,
        epidemiologyNumber,
        fullName,
        identityNumber,
        primaryPhone,
    } = exposureSource;

    const classes = useStyles();

    return (
        <>
            {Boolean(fullName) && (
                <Typography
                    className={[
                        classes.optionField,
                        !phoneAndIdentityNumberRegex.test(exposureSourceSearchString) && classes.searchedField,
                    ].join(' ')}
                >
                    {allCovidPatientFields.fullName + ': ' + fullName}
                </Typography>
            )}
            {Boolean(epidemiologyNumber) && (
                <Typography className={classes.optionField}>
                    {allCovidPatientFields.epidemiologyNumber + ': ' + epidemiologyNumber}
                </Typography>
            )}
            {Boolean(identityNumber) && (
                <Typography
                    className={[classes.optionField, identityNumber.includes(exposureSourceSearchString) && classes.searchedField].join(
                        ' '
                    )}
                >
                    {allCovidPatientFields.identityNumber + ': ' + identityNumber}
                </Typography>
            )}
            {Boolean(primaryPhone) && (
                <Typography
                    className={[classes.optionField, primaryPhone.includes(exposureSourceSearchString) && classes.searchedField].join(' ')}
                >
                    {allCovidPatientFields.primaryPhone + ': ' + primaryPhone}
                </Typography>
            )}
            {Boolean(age) && age !== invalidAge && (
                <Typography className={classes.optionField}>{allCovidPatientFields.age + ': ' + age}</Typography>
            )}
            {Boolean(address) && <Typography className={classes.optionField}>{allCovidPatientFields.address + ': ' + address}</Typography>}
        </>
    );
};

export default ExposureSourceOption;

interface Props {
    exposureSource: CovidPatient;
    exposureSourceSearchString: string;
};
