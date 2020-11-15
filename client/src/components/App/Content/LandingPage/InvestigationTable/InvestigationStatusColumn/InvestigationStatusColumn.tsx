import React from 'react';
import logger from 'logger/logger';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { Tooltip, Typography } from '@material-ui/core';
import { InfoOutlined, LockOpen } from '@material-ui/icons';

import axios from 'Utils/axios';
import { Service, Severity } from 'models/Logger';
import useCustomSwal from 'commons/CustomSwal/useCustomSwal';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';

import useStyles from './InvestigationStatusColumnStyles';
import { transferedSubStatus } from '../useInvestigationTable';

const InvestigationStatusColumn = (props: Props) => {

    const { investigationStatus, investigationSubStatus, epidemiologyNumber, moveToTheInvestigationForm, statusReason, wasInvestigationTransfered } = props;
    
    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const { alertError } = useCustomSwal();

    const classes = useStyles();

    const onIconClicked = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation();
        axios.post('/investigationInfo/updateInvestigationStatus', {
            investigationMainStatus: InvestigationMainStatus.IN_PROCESS,
            investigationSubStatus: null,
            statusReason: null,
            epidemiologyNumber
        }).then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Ending Investigation',
                step: `update investigation status request was successful`,
                user: userId,
                investigation: epidemiologyNumber
            });
            moveToTheInvestigationForm(epidemiologyNumber);
        })
            .catch((error) => {
                logger.error({
                    service: Service.CLIENT,
                    severity: Severity.HIGH,
                    workflow: 'Ending Investigation',
                    step: `got errors in server result: ${error}`,
                    user: userId,
                    investigation: epidemiologyNumber
                });
                alertError('לא ניתן לפתוח את החקירה מחדש');
            })
    }

    return (
        <div className={classes.columnWrapper}>
            {
                investigationStatus === InvestigationMainStatus.IN_PROCESS && investigationSubStatus &&
                <Typography>{investigationSubStatus + '/'}</Typography>
            }
            {
                investigationStatus === InvestigationMainStatus.IN_PROCESS && wasInvestigationTransfered &&
                <Typography>{transferedSubStatus + '/'}</Typography>
            }
            <Typography>{investigationStatus}</Typography>
            {
                investigationStatus === InvestigationMainStatus.DONE &&
                <Tooltip title='פתיחת חקירה' placement='top' arrow>
                    <LockOpen className={classes.investigatonIcon} onClick={onIconClicked} color='primary' />
                </Tooltip>
            }
            {
                investigationStatus === InvestigationMainStatus.CANT_COMPLETE &&
                <Tooltip title={investigationSubStatus}>
                    <InfoOutlined className={classes.investigatonIcon} fontSize='small' color='error' />
                </Tooltip>
            }
            {
                investigationStatus === InvestigationMainStatus.IN_PROCESS && statusReason &&
                <Tooltip title={statusReason}>
                    <InfoOutlined className={classes.investigatonIcon} fontSize='small' color='primary' />
                </Tooltip>
            }
        </div>
    )
}

interface Props {
    investigationStatus: string | null;
    investigationSubStatus: string;
    statusReason: string;
    wasInvestigationTransfered: boolean;
    epidemiologyNumber: number;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
};

export default InvestigationStatusColumn;
