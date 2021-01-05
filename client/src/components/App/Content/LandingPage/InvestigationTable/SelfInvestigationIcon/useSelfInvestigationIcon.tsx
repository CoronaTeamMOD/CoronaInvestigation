import React from 'react'
import { AssignmentInd, AssignmentTurnedIn, AssignmentReturned , AssignmentLate} from '@material-ui/icons';

import SelfInvestigaionStatuses , {statusNames} from 'models/enums/selfInvestigationStatuses';

import useStyles from './selfInvestigationIconStyles';
interface Props {
    status : number;
}

const useSelfInvestigationIcon = (props: Props) => {
    const { status } = props;
    const classes = useStyles();
    
    const getIconByStatus = () : React.ReactElement  => {
		switch (status) {
			case SelfInvestigaionStatuses.UNOPENED:
				return <AssignmentInd />;
			case SelfInvestigaionStatuses.IN_PROGRESS:
				return <AssignmentReturned />;
			case SelfInvestigaionStatuses.COMPLETED:
				return <AssignmentTurnedIn className={classes.completed} />;
			default:
				return <AssignmentLate />;
		}
    };

    return {
        getIconByStatus
    }
}

export default useSelfInvestigationIcon
