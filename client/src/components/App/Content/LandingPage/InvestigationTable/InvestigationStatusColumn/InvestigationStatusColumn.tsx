import React from 'react';
import logger from 'logger/logger';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Tooltip } from '@material-ui/core';
import { Info, LockOpen } from '@material-ui/icons';

import axios from 'Utils/axios';
import { Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';

import useStyles from './InvestigationStatusColumnStyles';

const InvestigationStatusColumn = (props: Props) => {

    const { investigationStatus, investigationSubStatus, epidemiologyNumber, moveToTheInvestigationForm, statusReason } = props;

    const shouldMarginNonIcon = React.useMemo(() =>
        !((investigationStatus.id === InvestigationMainStatusCodes.DONE) ||
            (InvestigationMainStatusCodes.CANT_COMPLETE && investigationSubStatus) ||
            (investigationStatus.id === InvestigationMainStatusCodes.IN_PROCESS && statusReason))
        , [investigationStatus])
    const userId = useSelector<StoreStateType, string>(state => state.user.data.id);

    const { alertError } = useCustomSwal();

    const classes = useStyles();

    const onIconClicked = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation();
        const iconLogger = logger.setup({
            workflow: 'Ending Investigation',
            user: userId,
            investigation: epidemiologyNumber
        });
        axios.post('/investigationInfo/updateInvestigationStatus', {
            investigationMainStatus: InvestigationMainStatusCodes.IN_PROCESS,
            investigationSubStatus: null,
            statusReason: null,
            epidemiologyNumber
        }).then(() => {
            iconLogger.info('update investigation status request was successful', Severity.LOW);
            moveToTheInvestigationForm(epidemiologyNumber);
        })
            .catch((error) => {
                iconLogger.error(`got errors in server result: ${error}`, Severity.HIGH);
                alertError('לא ניתן לפתוח את החקירה מחדש');
            })
    }

    return (
        <div className={shouldMarginNonIcon ? classes.marginStatusWithoutIcon : classes.columnWrapper}>
            {
                investigationStatus.id === InvestigationMainStatusCodes.DONE &&
                <Tooltip title='פתיחת חקירה' placement='top' arrow>
                    <LockOpen className={classes.investigatonIcon} onClick={onIconClicked} color='primary' />
                </Tooltip>
            }
            {
                investigationStatus.id === InvestigationMainStatusCodes.CANT_COMPLETE && investigationSubStatus &&
                <Tooltip title={investigationSubStatus} arrow>
                    <Info className={classes.investigatonIcon} fontSize='small' color='error' />
                </Tooltip>
            }
            {
                (investigationStatus.id === InvestigationMainStatusCodes.IN_PROCESS && statusReason) &&
                <Tooltip title={statusReason} arrow>
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
    epidemiologyNumber: number;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
};

export default InvestigationStatusColumn;
