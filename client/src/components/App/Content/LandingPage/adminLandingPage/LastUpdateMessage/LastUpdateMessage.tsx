import React ,{ useState , useEffect} from 'react'
import { Grid, Typography } from '@material-ui/core';

import RefreshIcon from 'commons/Icons/RefreshIcon';
import getTimeSinceMessage from 'Utils/DateUtils/timeSince';

import useStyles from './lastUpdateMessageStyles';

interface Props {
    lastUpdated : Date;
    fetchInvestigationStatistics: () => void;
}

const refreshRateInMs = 60000;

const LastUpdateMessage = (props: Props) => {
    const classes = useStyles();
    const { lastUpdated , fetchInvestigationStatistics} = props;
    
    const [lastUpdatedMsg , setLastUpdatedMsg] = useState<string>(getTimeSinceMessage(lastUpdated , false))

    const updateTimeSince = () => {
        setLastUpdatedMsg(getTimeSinceMessage(lastUpdated , false));
    }

    useEffect(() => {
        const handle = setInterval(updateTimeSince , refreshRateInMs);
        return () => {
            clearInterval(handle)
        }
    }, [lastUpdated]);
    
    return (
        <Grid container spacing={2} justify='flex-end'>
            <Grid item>
                <Typography color='textPrimary' align='right'> 
                    <b>עודכן לאחרונה</b> לפני {lastUpdatedMsg}
                </Typography>
            </Grid>
            <Grid item>
                <RefreshIcon className={classes.refreshIcon} onClick={fetchInvestigationStatistics}/>
            </Grid>
        </Grid>
    )
}

export default LastUpdateMessage;
