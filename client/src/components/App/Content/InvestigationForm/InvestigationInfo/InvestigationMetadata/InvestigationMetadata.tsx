import React from 'react';
import {Paper} from '@material-ui/core';
import InfoItem from '../InfoItem';
import useStyles from './InvestigationMetadataStyles';

const InvestigationMetadata = () => {
    const classes = useStyles();
    const investigationStartDate = '26/08/2020';
    const lastUpdateTime = '26/08/2020';
    const district = 'דרום';
    const investigator = 'אברהם כהן';
    const updatingInvestigator = 'פלוני זהבי';
    const investigatorPhoneNumber = '054-1234567';

    return (
        <Paper className={classes.metadata}>
            <InfoItem name='תאריך תחילת החקירה' value={investigationStartDate} />
            <InfoItem name='תאריך עדכון אחרון' value={lastUpdateTime} />
            <InfoItem name='נפח/מחוז' value={district} />
            <InfoItem name='מבצע החקירה' value={investigator} />
            <InfoItem name='משתמש מעדכן' value={updatingInvestigator} />
            <InfoItem name='טלפון המבצע' value={investigatorPhoneNumber} />
        </Paper>
    );
};

export default InvestigationMetadata;