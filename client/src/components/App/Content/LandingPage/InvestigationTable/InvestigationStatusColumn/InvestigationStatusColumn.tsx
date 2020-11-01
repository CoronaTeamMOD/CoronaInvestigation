import React from 'react';
import { LockOpen } from '@material-ui/icons';
import { Tooltip, Typography } from '@material-ui/core';

import axios from 'Utils/axios';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';

import useStyles from './InvestigationStatusColumnStyles';
import { Service, Severity } from 'models/Logger';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import logger from 'logger/logger';
import Swal from 'sweetalert2';

const InvestigationStatusColumn = (props: Props) => {

    const userId = useSelector<StoreStateType, string>(state => state.user.id);

    const { investigationStatus, epidemiologyNumber, moveToTheInvestigationForm } = props;

    const classes = useStyles();

    const onIconClicked = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        event.stopPropagation();
        axios.post('/investigationInfo/updateInvestigationStatus', {
            investigationMainStatus: InvestigationMainStatus.IN_PROCESS,
            investigationSubStatus: null,
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
            Swal.fire({
                title: 'לא ניתן לפתוח את החקירה מחדש',
                icon: 'error',
                customClass: {
                    title: classes.swalTitle
                }
            })
        })
    }

    return (
        <div className={classes.columnWrapper}>
            <Typography>{investigationStatus}</Typography>
            {
                investigationStatus === InvestigationMainStatus.DONE &&
                <Tooltip title='פתיחת חקירה' placement='top' arrow>
                    <LockOpen className={classes.openInvestigatonIcon} onClick={onIconClicked} color='primary' />
                </Tooltip>
            }
        </div>
    )
}

interface Props {
    investigationStatus: string | null;
    epidemiologyNumber: number;
    moveToTheInvestigationForm: (epidemiologyNumber: number) => void;
}

export default InvestigationStatusColumn;