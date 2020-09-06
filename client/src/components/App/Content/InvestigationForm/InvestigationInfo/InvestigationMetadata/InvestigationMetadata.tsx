import React from 'react';
import {Paper} from '@material-ui/core';
import { format } from 'date-fns';

import { getPersonFullName } from 'Utils/displayUtils';
import { InvestigationMetaData } from 'models/InvestigationInfo';

import InfoItem from '../InfoItem';
import useStyles from './InvestigationMetadataStyles';

const InvestigationMetadata = (props: Props) => {

    const classes = useStyles();
    const { investigationMetaData } = props;

    return (
        <Paper className={classes.metadata}>
            <InfoItem name='תאריך תחילת החקירה' value={
                    format(new Date(investigationMetaData.startTime), 'dd/MM/yyyy')
                }
            />
            <InfoItem name='תאריך עדכון אחרון' value={
                    format(new Date(investigationMetaData.lastUpdateTime), 'dd/MM/yyyy')
                }
            />
            <InfoItem name='נפח/מחוז' value={investigationMetaData.investigatingUnit} />
            <InfoItem name='מבצע החקירה' value={
                    getPersonFullName(investigationMetaData.userByCreator.personByPersonId)
                }
            />
            <InfoItem name='משתמש מעדכן' value={
                    getPersonFullName(investigationMetaData.userByLastUpdator.personByPersonId)
                }
            />
            <InfoItem name='טלפון המבצע' value={investigationMetaData.userByCreator.personByPersonId.phoneNumber} />
        </Paper>
    );
};

interface Props {
    investigationMetaData: InvestigationMetaData
}

export default InvestigationMetadata;