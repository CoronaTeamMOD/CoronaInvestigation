import React from 'react';
import { ReplyAll } from '@material-ui/icons';
import { Tooltip, Typography } from '@material-ui/core';

import useStyles from './InvestigationStatusNumberStyles';

const InvestigationNumberColumn = (props: Props) => {

    const { wasInvestigationTransferred, epidemiologyNumber, transferReason } = props;

    const classes = useStyles();

    return (
        <div className={classes.columnWrapper}>
            <Typography>{epidemiologyNumber}</Typography>
            {
                wasInvestigationTransferred &&
                <Tooltip title={transferReason}>
                    <ReplyAll color='primary' className={classes.transferredIcon}/>
                </Tooltip>
            }
        </div>
    )
}

interface Props {
    wasInvestigationTransferred: boolean;
    epidemiologyNumber: number;
    transferReason: string;
};

export default InvestigationNumberColumn;
