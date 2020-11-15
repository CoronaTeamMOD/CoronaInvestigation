import React from 'react';
import { Typography } from '@material-ui/core';
import { faReplyAll } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useStyles from './InvestigationStatusNumberStyles';

const InvestigationNumberColumn = (props: Props) => {

    const { wasInvestigationTransferred, epidemiologyNumber } = props;

    const classes = useStyles();

    return (
        <div className={classes.columnWrapper}>
            <Typography>{epidemiologyNumber}</Typography>
            {
                wasInvestigationTransferred &&
                <FontAwesomeIcon icon={faReplyAll} className={classes.transferredIcon} />
            }
        </div>
    )
}

interface Props {
    wasInvestigationTransferred: boolean;
    epidemiologyNumber: number;
};

export default InvestigationNumberColumn;
