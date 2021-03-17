import { useSelector } from 'react-redux';
import React, {ChangeEvent, useEffect, useMemo} from 'react';
import {Collapse, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography} from '@material-ui/core';

import StoreStateType from 'redux/storeStateType';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

import { inProcess } from '../InvestigatedPersonInfo';
import useStyles from './InvestigationStatusInfoStyles';

const statusLabel = 'סטטוס';
const subStatusLabel = 'סיבה';
const statusReasonLabel = 'פירוט';

const InvestigationStatusInfo = (props: any) => {

    const  { statusReasonError, validateStatusReason, ValidationStatusSchema } = props;
    const classes = useStyles();
    
    const { wasInvestigationReopend } = useStatusUtils();

    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const statuses = useSelector<StoreStateType, InvestigationMainStatus[]>(state => state.statuses);
    const subStatuses = useSelector<StoreStateType, string[]>(state => state.subStatuses);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    useEffect(() => {
        if (investigationStatus.subStatus !== transferredSubStatus) {
            validateStatusReason(investigationStatus.statusReason)
        }
    }, [investigationStatus.subStatus]);

    const updatedSubStatuses = useMemo(() =>
        investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS ? [inProcess , ...subStatuses] : subStatuses,
        [subStatuses, investigationStatus]);

    const permittedStatuses = statuses.filter(status => status.id !== InvestigationMainStatusCodes.DONE);

    const isStatusDisable = (status: number) => {
        if (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) {
            return status === InvestigationMainStatusCodes.NEW && wasInvestigationReopend
        }
        return status === InvestigationMainStatusCodes.NEW;
    };

    return (
        <>
            <Grid container direction='column' alignItems='center' className={classes.managementControllers}>
                <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                    <Grid item xs={12} className={classes.fieldLabel}>
                        <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                            <Typography className={classes.label}>
                                {statusLabel}:
                            </Typography>
                            <Grid item className={classes.statusSelectGrid}>
                                <FormControl variant='outlined' className={classes.statusSelect}>
                                    <InputLabel className={classes.statusSelect} id='status-label'>{statusLabel}</InputLabel>
                                    <Select
                                        MenuProps={{
                                            anchorOrigin: {
                                                vertical: 'bottom',
                                                horizontal: 'left'
                                            },
                                            transformOrigin: {
                                                vertical: 'top',
                                                horizontal: 'left'
                                            },
                                            getContentAnchorEl: null
                                        }}
                                        labelId='status-label'
                                        test-id='currentStatus'
                                        variant='outlined'
                                        label={statusLabel}
                                        value={investigationStatus.mainStatus}
                                        onChange={(event) => {
                                            const newStatus = event.target.value as string
                                            if (newStatus) {
                                                setInvestigationStatus({
                                                    mainStatus: +newStatus,
                                                    subStatus: '',
                                                    statusReason: ''
                                                });
                                            }
                                        }}
                                    >
                                        {
                                            permittedStatuses.map(status => (
                                                <MenuItem
                                                    key={status.id}
                                                    disabled={isStatusDisable(status.id)}
                                                    value={status.id}>
                                                    {status.displayName}
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Collapse in={investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE ||
                                investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS}>
                                <Grid item className={classes.statusSelectGrid}>
                                    <FormControl variant='outlined' className={classes.subStatusSelect}>
                                        <InputLabel id='sub-status-label'>{subStatusLabel}</InputLabel>
                                        <Select
                                            MenuProps={{
                                                anchorOrigin: {
                                                    vertical: 'bottom',
                                                    horizontal: 'left'
                                                },
                                                transformOrigin: {
                                                    vertical: 'top',
                                                    horizontal: 'left'
                                                },
                                                getContentAnchorEl: null
                                            }}
                                            labelId='sub-status-label'
                                            test-id='currentSubStatus'
                                            label={subStatusLabel}
                                            value={investigationStatus.subStatus as string | undefined}
                                            onChange={(event) => {
                                                const newSubStatus = event.target.value as string
                                                setInvestigationStatus({
                                                    mainStatus: investigationStatus.mainStatus,
                                                    subStatus: newSubStatus ? String(newSubStatus) : null,
                                                    statusReason: ''
                                                });
                                            }}
                                        >
                                            {
                                                updatedSubStatuses.map((subStatus: string) => (
                                                    <MenuItem
                                                        key={subStatus}
                                                        value={subStatus}>
                                                        {subStatus}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Collapse>
                            <Collapse in={investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS && investigationStatus.subStatus !== '' && investigationStatus.subStatus !== inProcess}>
                                <Grid item className={classes.statusSelectGrid}>
                                    <TextField
                                        className={classes.subStatusSelect}
                                        value={investigationStatus.statusReason}
                                        required={investigationStatus.subStatus === transferredSubStatus}
                                        placeholder={statusReasonLabel}
                                        error={Boolean(statusReasonError)}
                                        label={statusReasonError ? statusReasonError[0] : statusReasonLabel}
                                        onChange={async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                            const newStatusReason: string = event.target.value;
                                            const isValid = ValidationStatusSchema(investigationStatus.subStatus).isValidSync(newStatusReason);
                                            validateStatusReason(newStatusReason)
                                            if (isValid || newStatusReason === '') {
                                                setInvestigationStatus({
                                                    mainStatus: investigationStatus.mainStatus,
                                                    subStatus: investigationStatus.subStatus,
                                                    statusReason: newStatusReason
                                                });
                                            }
                                        }}
                                    />
                                </Grid>
                            </Collapse>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default InvestigationStatusInfo;