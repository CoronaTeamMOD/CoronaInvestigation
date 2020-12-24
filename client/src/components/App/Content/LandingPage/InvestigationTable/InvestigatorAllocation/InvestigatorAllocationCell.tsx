import React from 'react';
import { Tooltip } from '@material-ui/core';
import { Warning, Edit } from '@material-ui/icons';

import { defaultEpidemiologyNumber } from 'Utils/consts';

import useStyles from './InvestigatorAllocationCellStyles';

const InvestigatorAllocationCell: React.FC<Props> = (props: Props) => {

    const { investigatorName, epidemiologyNumber, epiNumOnInvestigatorNameHover, setEpiNumOnInvestigatorNameHover, } = props;

    const classes = useStyles();

    const isUnassigned = investigatorName === 'לא משויך';

    const UnassignedWarning = () => (
        <Tooltip arrow placement='top' title='לא הוקצה חוקר לחקירה'>
            <Warning className={classes.warningIcon} />
        </Tooltip>
    )

    return (
        <div 
            className={classes.selectedInvestigator}
            onMouseOver={() => setEpiNumOnInvestigatorNameHover(epidemiologyNumber)}
            onMouseLeave={() => setEpiNumOnInvestigatorNameHover(defaultEpidemiologyNumber)}
        >
            {isUnassigned && epiNumOnInvestigatorNameHover !== epidemiologyNumber && <UnassignedWarning />}
            {investigatorName}
            {epiNumOnInvestigatorNameHover === epidemiologyNumber && <Edit fontSize='small' className={classes.editIcon} />}
            
        </div>
    )
};

interface Props {
    investigatorName: string;
    epidemiologyNumber: number;
    epiNumOnInvestigatorNameHover: number;
    setEpiNumOnInvestigatorNameHover: React.Dispatch<React.SetStateAction<number>>;
}

export default InvestigatorAllocationCell;
