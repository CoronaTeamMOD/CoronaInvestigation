import React ,{ useState , useEffect} from 'react'
import { Typography } from '@material-ui/core';

import getTimeSinceMessage from 'Utils/DateUtils/timeSince';

interface Props {
    lastUpdated : Date;
    fetchInvestigationStatistics: () => void;
}

const refreshRateInMs = 1000;

const LastUpdateMessage = (props: Props) => {
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
        <Typography color='textPrimary'>
            <b>עודכן לאחרונה</b> {lastUpdatedMsg}
        </Typography>
    )
}

export default LastUpdateMessage;
