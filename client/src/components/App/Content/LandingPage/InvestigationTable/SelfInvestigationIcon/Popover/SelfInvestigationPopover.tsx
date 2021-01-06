import React from 'react'
import { Grid } from '@material-ui/core';

import SelfInvestigaionStatuses , {statusNames} from 'models/enums/selfInvestigationStatuses';

interface Props {
    status : SelfInvestigaionStatuses;
    date : Date;
}

const statusTitle = 'סטטוס';
const lastUpdatedTime = 'זמן עדכון אחרון ע"י החולה';

const SelfInvestigationPopover = (props: Props) => {
    const { date , status } = props;

    return (
        <div>
            <div><b>{lastUpdatedTime} : </b>{date.toLocaleDateString()}</div>
            <Grid item container>
                <Grid item xs={6} style={{textAlign : 'right'}}><b>{statusTitle} : </b></Grid>
                <Grid item xs={6} style={{textAlign : 'left'}}>{Boolean(statusNames[status]) ? statusNames[status] : 'לא ידוע' }</Grid>
            </Grid>
        </div>
    )
}

export default SelfInvestigationPopover;
