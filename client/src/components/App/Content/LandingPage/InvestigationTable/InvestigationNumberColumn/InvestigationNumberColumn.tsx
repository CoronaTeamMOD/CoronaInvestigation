import React from 'react';
import { ReplyAll } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import ConditionalTooltip from 'commons/ConditionalTooltip/ConditionalTooltip';

import useStyles from './InvestigationStatusNumberStyles';

const InvestigationNumberColumn = (props: Props) => {

    const { wasInvestigationTransferred, epidemiologyNumber, transferReason } = props;

    const classes = useStyles();

    return (
        <div className={classes.columnWrapper}>
            {
                wasInvestigationTransferred &&
                <ConditionalTooltip renderTooltip={!!transferReason}
                                    title={transferReason} arrow>
                    <ReplyAll color='primary' className={classes.transferredIcon}/>
                </ConditionalTooltip>
            }
            <Typography>{epidemiologyNumber}</Typography>
        </div>
    )
}

interface Props {
    wasInvestigationTransferred: boolean;
    epidemiologyNumber: number;
    transferReason: string;
};

export default InvestigationNumberColumn;
