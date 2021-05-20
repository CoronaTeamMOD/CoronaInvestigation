import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';

import RefreshIcon from 'commons/Icons/RefreshIcon';
import getTimeSinceMessage from 'Utils/DateUtils/timeSince';

import useStyles from './lastUpdateMessageStyles';
import {defaultOrderBy} from '../adminInvestigationsTable/adminInvestigationsTable';

const refreshRateInMs = 1000;

const LastUpdateMessage = (props: Props) => {
    const classes = useStyles();
    const { lastUpdated, fetchInvestigationStatistics, fetchAdminInvestigations } = props;

    const [lastUpdatedMsg, setLastUpdatedMsg] = useState<string>(getTimeSinceMessage(lastUpdated, false));

    const updateTimeSince = () => {
        setLastUpdatedMsg(getTimeSinceMessage(lastUpdated, false));
    };

    useEffect(() => {
        const handle = setInterval(updateTimeSince, refreshRateInMs);
        return () => {
            clearInterval(handle);
        }
    }, [lastUpdated]);

    const fetchAll = () =>{
        fetchInvestigationStatistics();
        fetchAdminInvestigations(defaultOrderBy);
    }
    return (
        <Grid container spacing={2}>
            <Grid item>
                <Typography color='textPrimary' align='right' id='time-since-message'>
                    <b>עודכן לאחרונה</b> לפני {lastUpdatedMsg}
                </Typography>
            </Grid>
            <Grid item>
                <RefreshIcon className={classes.refreshIcon} onClick={fetchAll} />
            </Grid>
        </Grid>
    )
}

export default LastUpdateMessage;

interface Props {
    lastUpdated: Date;
    fetchInvestigationStatistics: () => void;
    fetchAdminInvestigations: (orderBy: string) => void;
};
