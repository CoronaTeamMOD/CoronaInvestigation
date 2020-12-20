import React from 'react';
import {ReplyAll} from '@material-ui/icons';
import {Tooltip,} from '@material-ui/core';

import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import useStyles from './InvestigationIndicatorsColumnStyles';

const complexInvestigationMessage = 'חקירה מורכבת';
const InvestigationIndicatorsColumn = (props: Props) => {
    const {isComplex, wasInvestigationTransferred, transferReason} = props;

    const classes = useStyles();

    return (
        <div className={classes.columnContainer}>
            {isComplex && <ComplexityIcon tooltipText={complexInvestigationMessage}/>}
            {
                wasInvestigationTransferred &&
                <Tooltip title={transferReason === null ? '' : transferReason} placement='top' arrow>
                    <ReplyAll color='primary'/>
                </Tooltip>
            }
        </div>
    )
}

interface Props {
    wasInvestigationTransferred: boolean;
    isComplex: boolean;
    transferReason: string;
};

export default InvestigationIndicatorsColumn;
