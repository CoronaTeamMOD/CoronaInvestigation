import React from 'react';
import { ReplyAll } from '@material-ui/icons';
import { Tooltip, Typography } from '@material-ui/core';

import useStyles from './InvestigationStatusNumberStyles';

const InvestigationNumberColumn = (props: Props) => {

    const { wasInvestigationTransferred, epidemiologyNumber, transferReason } = props;

    const classes = useStyles();

    return (
        <div className={classes.columnWrapper}>
            {
                wasInvestigationTransferred &&
                <Tooltip title={transferReason === null ? '' : transferReason} placement='top' arrow>
                    <ReplyAll color='primary' className={classes.transferredIcon} />
                </Tooltip>
            }
            <span className={wasInvestigationTransferred ? '' : classes.marginNonTransffered}>{epidemiologyNumber}</span>
        </div>
    )
}

interface Props {
    wasInvestigationTransferred: boolean;
    epidemiologyNumber: number;
    transferReason: string;
};

export default InvestigationNumberColumn;
