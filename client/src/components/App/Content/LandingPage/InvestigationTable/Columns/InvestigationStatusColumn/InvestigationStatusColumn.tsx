import React from 'react';
import { Info} from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';

import InvestigationMainStatus from 'models/InvestigationMainStatus';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

import useStyles from './InvestigationStatusColumnStyles';

const InvestigationStatusColumn = (props: Props) => {

    const { investigationStatus, investigationSubStatus, statusReason } = props;

    const shouldMarginNonIcon = React.useMemo(() =>
        !((InvestigationMainStatusCodes.CANT_COMPLETE && investigationSubStatus) ||
            (investigationStatus.id === InvestigationMainStatusCodes.IN_PROCESS && statusReason))
        , [investigationStatus])

    const classes = useStyles();

    return (
        <div className={shouldMarginNonIcon ? classes.marginStatusWithoutIcon : classes.columnWrapper}>
            {
                investigationStatus.id === InvestigationMainStatusCodes.CANT_COMPLETE && investigationSubStatus &&
                <Tooltip title={investigationSubStatus} placement='top' arrow>
                    <Info className={classes.investigatonIcon} fontSize='small' color='error' />
                </Tooltip>
            }
            {
                (investigationStatus.id === InvestigationMainStatusCodes.IN_PROCESS && statusReason) &&
                <Tooltip title={statusReason} placement='top' arrow>
                    <Info className={classes.investigatonIcon} fontSize='small' color='primary' />
                </Tooltip>
            }
            {
                (investigationStatus.id === InvestigationMainStatusCodes.IN_PROCESS && investigationSubStatus) &&
                `${investigationSubStatus}/`
            }
            {investigationStatus.displayName}
        </div>
    )
}

interface Props {
    investigationStatus: InvestigationMainStatus;
    investigationSubStatus: string;
    statusReason: string;
};

export default InvestigationStatusColumn;
