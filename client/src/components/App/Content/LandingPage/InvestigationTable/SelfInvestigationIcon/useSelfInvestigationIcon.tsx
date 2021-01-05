import React from 'react'
import { AssignmentInd, AssignmentTurnedIn, AssignmentReturned } from '@material-ui/icons';

import SelfInvestigaionStatuses , {getInvestigationStatusName} from 'models/enums/selfInvestigationStatuses';

import useStyles from './selfInvestigationIconStyles';

const contactTitle = 'תחקור עצמי';
const lastUpdatedTime = 'זמן עדכון אחרון ע"י החולה';
const statusTitle = 'סטטוס';

interface Props {
    status : number;
    date : Date;
}

const useSelfInvestigationIcon = (props: Props) => {
    const { status , date } = props;
    const classes = useStyles();
    
    const getIconByStatus = () : React.ReactElement  => {
		switch (status) {
			case SelfInvestigaionStatuses.UNOPENED:
				return <AssignmentInd className={classes.unopened} />;
			case SelfInvestigaionStatuses.IN_PROGRESS:
				return <AssignmentReturned className={classes.inProgress} />;
			case SelfInvestigaionStatuses.COMPLETED:
				return <AssignmentTurnedIn className={classes.completed} />;
			default:
				return <AssignmentInd />;
		}
    };
    
    const getTooltipText = () => {
        return (
            <div>
                <div><b>{lastUpdatedTime} : </b>{date.toLocaleDateString()}</div>
                <div><b>{statusTitle} : </b>{getInvestigationStatusName(status)}</div>
            </div>
        )
    }

    return {
        getIconByStatus,
        getTooltipText
    }
}

export default useSelfInvestigationIcon
