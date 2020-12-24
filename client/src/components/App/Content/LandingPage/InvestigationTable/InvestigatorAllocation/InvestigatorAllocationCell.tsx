import React, { useState } from 'react';
import { Tooltip } from '@material-ui/core';
import { Warning, Edit } from '@material-ui/icons';

import useStyles from './InvestigatorAllocationCellStyles';

const InvestigatorAllocationCell: React.FC<Props> = (props: Props) => {

    const { investigatorName ,isInvestigatorActive} = props;

    const [isCellHovered, setIsCellHovered] = useState<boolean>(false);

    const classes = useStyles();
    const isUnassigned = investigatorName === 'לא משויך';

    const UnassignedWarning = () => (
        <Tooltip arrow placement='top' title='לא הוקצה חוקר לחקירה'>
            <Warning className={classes.warningIcon} />
        </Tooltip>
    )

    return (
        <div 
            className={`${classes.selectedInvestigator} ${ !isInvestigatorActive && !isUnassigned ? classes.inActiveInvestigator : ''}`}
            onMouseOver={() => setIsCellHovered(true)}
            onMouseLeave={() => setIsCellHovered(false)}
        >
            {isUnassigned && isCellHovered && <UnassignedWarning />}
            {investigatorName}
            {isCellHovered && <Edit fontSize='small' className={classes.editIcon} />}
            
        </div>
    )
};

interface Props {
    investigatorName: string;
    isInvestigatorActive: Boolean;
}

export default InvestigatorAllocationCell;
