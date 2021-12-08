import React from 'react';
import { format } from 'date-fns';
import { Paper } from '@material-ui/core';

import InvestigationMetaData from 'models/InvestigationMetadata';

import InfoItem from '../InfoItem';
import useStyles from './InvestigationMetadataStyles';

const noStartDate = 'אין תאריך';

const InvestigationMetadata = (props: Props) => {

    const classes = useStyles();
    const { investigationMetaData } = props;

    return (
        <Paper className={classes.metadata}>
            <InfoItem testId='investigationStartDate' name='תחילת החקירה'
                value={investigationMetaData.startTime ? format(new Date(investigationMetaData.startTime), 'dd/MM/yyyy') : noStartDate}
            />
            <InfoItem testId='investigationLastUpdatedDate' name='עדכון אחרון'
                value={investigationMetaData.lastUpdateTime ? format(new Date(investigationMetaData.lastUpdateTime), 'dd/MM/yyyy') : noStartDate}
            />
            <InfoItem testId='updatingUser' name='משתמש מעדכן' value={
                investigationMetaData.userByLastUpdatorUser? investigationMetaData.userByLastUpdatorUser.userName : ''
            }
            />
            <InfoItem testId='investigatorPhoneNumber' name='טלפון המבצע' value={investigationMetaData.userByLastUpdator.phoneNumber} />
        </Paper>
    );
};

interface Props {
    investigationMetaData: InvestigationMetaData;
}

export default InvestigationMetadata;
