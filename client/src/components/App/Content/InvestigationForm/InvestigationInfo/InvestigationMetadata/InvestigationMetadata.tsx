import React from 'react';
import { format } from 'date-fns';
import { Paper } from '@material-ui/core';

import { InvestigationMetaData } from 'models/InvestigationMetadata';

import InfoItem from '../InfoItem';
import useStyles from './InvestigationMetadataStyles';

const InvestigationMetadata = (props: Props) => {

    const classes = useStyles();
    const { investigationMetaData } = props;

    return (
        <Paper className={classes.metadata}>
            <InfoItem testId='investigationStartDate' name='תאריך תחילת החקירה' value={
                format(new Date(investigationMetaData.startTime), 'dd/MM/yyyy')
            }
            />
            <InfoItem testId='investigationLastUpdatedDate' name='תאריך עדכון אחרון' value={
                format(new Date(investigationMetaData.lastUpdateTime), 'dd/MM/yyyy')
            }
            />
            <InfoItem testId='district' name='נפה/מחוז' value={investigationMetaData.investigatingUnit} />
            <InfoItem testId='investigatorName' name='מבצע החקירה' value={
                investigationMetaData.userByCreator.userName
            }
            />
            <InfoItem testId='updatingUser' name='משתמש מעדכן' value={
                investigationMetaData.userByLastUpdator.userName
            }
            />
            <InfoItem testId='investigatorPhoneNumber' name='טלפון המבצע' value={investigationMetaData.userByCreator.phoneNumber} />
        </Paper>
    );
};

interface Props {
    investigationMetaData: InvestigationMetaData
}

export default InvestigationMetadata;