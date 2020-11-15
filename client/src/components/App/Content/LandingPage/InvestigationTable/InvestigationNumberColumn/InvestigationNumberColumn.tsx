import React from 'react';
import { Typography } from '@material-ui/core';
import { faReplyAll } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useStyles from './InvestigationStatusNumberStyles';

const InvestigationNumberColumn = (props: Props) => {

    const { transfered, epidemiologyNumber } = props;

    const classes = useStyles();

    return (
        <div className={classes.columnWrapper}>
            <Typography>{epidemiologyNumber}</Typography>
            {
                transfered &&
                <FontAwesomeIcon icon={faReplyAll} className={classes.transferedIcon} />
            }
        </div>
    )
}

interface Props {
    transfered: boolean;
    epidemiologyNumber: number;
};

export default InvestigationNumberColumn;
