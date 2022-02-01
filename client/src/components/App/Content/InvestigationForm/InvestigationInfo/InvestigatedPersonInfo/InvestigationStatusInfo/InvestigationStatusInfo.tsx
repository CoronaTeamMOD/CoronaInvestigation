import { useSelector, useDispatch } from 'react-redux';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, FormControl, Grid, InputLabel, Menu, MenuItem, Select, TextField, Tooltip, Typography } from '@material-ui/core';

import SubStatus from 'models/SubStatus';
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
import KeyValuePair from 'models/KeyValuePair';
import { BotInvestigationInfo } from 'models/InvestigationInfo';
import { setInvestigatorReferenceStatus } from 'redux/BotInvestigationInfo/botInvestigationInfoActionCreator';
import { getMutationInfo } from 'redux/MutationInfo/mutationInfoActionCreator';
import { setIsLoading } from 'redux/IsLoading/isLoadingActionCreators';
import InvestigationChatStatusCode from 'models/enums/InvestigationChatStatusCodes';


const statusLabel = 'סטטוס';
const subStatusLabel = 'סיבה';
const statusReasonLabel = 'פירוט';
const investigatorReferenceStatusLabel ='סטטוס טיפול בחקירת בוט';
const changeStatusText = 'לתשומת ליבך, לאחר עדכון סטטוס  החקירה תינעל לעריכה.';
const changeStatusReasonText = 'אנא בחר סיבה : '
const changeStatusNavigationText ='באישור, דף החקירה ייסגר ותתבצע הפניה לדף החקירות.';

const InvestigationStatusInfo = (props: any) => {

    const { statusReasonError,
        validateStatusReason,
        ValidationStatusSchema,
        isViewMode,
        disabledByStatus,
        saveInvestigationInfo ,
        handleInvestigationFinish,
        setSaveChangesFlag,
        currentTab
    } = props;
    const classes = useStyles();

    const { wasInvestigationReopend } = useStatusUtils();
    const dispatch = useDispatch();

    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const statuses = useSelector<StoreStateType, InvestigationMainStatus[]>(state => state.statuses);
    const subStatuses = useSelector<StoreStateType, SubStatus[]>(state => state.subStatuses);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);
    const investigatorReferenceStatuses = useSelector<StoreStateType,KeyValuePair[]>(state=>state.investigatorReferenceStatuses);
    const botInvestigationInfo = useSelector<StoreStateType, BotInvestigationInfo |null>(state=>state.botInvestigationInfo.botInvestigationInfo);
   
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [previousStatus, setPreviousStatus] = useState<InvestigationStatus|null>(null);

    useEffect(() => {
        if (investigationStatus.subStatus !== transferredSubStatus) {
            validateStatusReason(investigationStatus.statusReason)
        }
    }, [investigationStatus.subStatus]);

    const updatedSubStatuses = useMemo(() =>
        investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS ? [{ displayName: inProcess, id: 0, parentStatus: 100000002 }, ...subStatuses] : subStatuses,
        [subStatuses, investigationStatus]);

    const permittedStatuses = investigationStatus.mainStatus !== InvestigationMainStatusCodes.DONE ? statuses.filter(status => status.id !== InvestigationMainStatusCodes.DONE) : statuses;

    const isStatusDisable = (status: number) => {
        if (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) {
            return status === InvestigationMainStatusCodes.NEW && wasInvestigationReopend
        }
        return status === InvestigationMainStatusCodes.NEW;
    };

    const approveStatusChange = () => {
        setIsLoading(true);
        saveInvestigationInfo().then(() => {
            setSaveChangesFlag(false);
            setPreviousStatus(null);
            setOpenDialog(false);
            handleInvestigationFinish();
            setIsLoading(false);
        })
            .error(() => {
                setOpenDialog(false);
            });
    } 

  const cancelStatusChange = () => {
    if (previousStatus) {
        setInvestigationStatus(previousStatus);
      }
      setPreviousStatus(null);
      setOpenDialog(false);
  }
    const onStatusChange = (statusId: number) => {
        if (statusId === InvestigationMainStatusCodes.NOT_INVESTIGATED ||
            statusId === InvestigationMainStatusCodes.CANT_COMPLETE) {
            setPreviousStatus(investigationStatus);
            setOpenDialog(true);
        }
        changeStatus(statusId);
    }

    const changeStatus = (statusId: number) => {
        dispatch(getMutationInfo());
        setIsLoading(false);
        if (statusId) {
            setInvestigationStatus({
                mainStatus: statusId,
                subStatus: '',
                statusReason: ''
            });
        }
    }

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
                                        disabled={isViewMode || disabledByStatus}  
                                        labelId='status-label'
                                        test-id='currentStatus'
                                        variant='outlined'
                                        label={statusLabel}
                                        value={investigationStatus.mainStatus}
                                        onChange={(event) => {
                                            dispatch(getMutationInfo());
                                            setIsLoading(false);
                                            const newStatus = event.target.value as string
                                            if (newStatus) {
                                                onStatusChange(+newStatus);
                                                setSaveChangesFlag(true); 
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
                            {
                                (investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE ||
                                    investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS ||
                                    investigationStatus.mainStatus === InvestigationMainStatusCodes.NOT_INVESTIGATED) &&
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
                                            disabled={isViewMode || disabledByStatus}
                                            value={investigationStatus.subStatus as string | undefined}
                                            onChange={(event: any) => {
                                                const newSubStatus = event.target.value as string
                                                setInvestigationStatus({
                                                    mainStatus: investigationStatus.mainStatus,
                                                    subStatus: newSubStatus ? String(newSubStatus) : null,
                                                    statusReason: ''
                                                });
                                                setSaveChangesFlag(true);  
                                            }}
                                        >
                                            {
                                                updatedSubStatuses.map((subStatus: SubStatus) => (
                                                    <MenuItem
                                                        key={subStatus.id}
                                                        value={subStatus.displayName}>
                                                        {subStatus.displayName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                            {/* </Collapse> */}
                            {
                                (investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS &&
                                    investigationStatus.subStatus !== '' &&
                                    investigationStatus.subStatus !== inProcess) &&
                                <Grid item className={classes.statusSelectGrid}>
                                    <TextField
                                        className={classes.subStatusSelect}
                                        value={investigationStatus.statusReason}
                                        required={investigationStatus.subStatus === transferredSubStatus}
                                        placeholder={statusReasonLabel}
                                        error={Boolean(statusReasonError)}
                                        label={statusReasonError ? statusReasonError[0] : statusReasonLabel}
                                        disabled={isViewMode || disabledByStatus}
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
                                                setSaveChangesFlag(true);  
                                            }
                                        }}
                                    />
                                </Grid>
                            }
                            {
                                (botInvestigationInfo?.investigationChatStatus.id === InvestigationChatStatusCode.PROPER ||
                                    botInvestigationInfo?.investigationChatStatus.id === InvestigationChatStatusCode.COMPLETED) &&
                                botInvestigationInfo?.investigatiorReferenceRequired &&
                                <Grid item className={classes.statusSelectGrid}>
                                    <FormControl variant='outlined' className={classes.subStatusSelect}>
                                        <InputLabel id='sub-status-label'>{investigatorReferenceStatusLabel}</InputLabel>
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
                                            label={investigatorReferenceStatusLabel}
                                            value={botInvestigationInfo.investigatorReferenceStatus.id}
                                            disabled={isViewMode}
                                            onChange={(event: any) => {
                                                const id = event.target.value as number;
                                                let investigatorReferenceStatus = investigatorReferenceStatuses.find(status => status.id == id)
                                                if (investigatorReferenceStatus) {
                                                    dispatch(setInvestigatorReferenceStatus(investigatorReferenceStatus));
                                                    setSaveChangesFlag(true);  
                                                }
                                            }}
                                        >
                                            {
                                                investigatorReferenceStatuses.map((status: KeyValuePair) => (
                                                    <MenuItem
                                                        key={status.id}
                                                        value={status.id}>
                                                        {status.displayName}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={cancelStatusChange}>
                <DialogTitle> שינוי סטטוס : {statuses.find(s => s.id === investigationStatus.mainStatus)?.displayName} </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <p>
                            {changeStatusText}
                        </p>
                        <p>
                            {changeStatusReasonText}
                        </p>
                    </DialogContentText>
                    <Collapse in={investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE ||
                        investigationStatus.mainStatus === InvestigationMainStatusCodes.NOT_INVESTIGATED}>
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
                                    onChange={(event: any) => {
                                        const newSubStatus = event.target.value as string
                                        setInvestigationStatus({
                                            mainStatus: investigationStatus.mainStatus,
                                            subStatus: newSubStatus ? String(newSubStatus) : null,
                                            statusReason: ''
                                        });
                                    }}
                                >
                                    {
                                        subStatuses.map((subStatus: SubStatus) => (
                                            <MenuItem
                                                key={subStatus.id}
                                                value={subStatus.displayName}>
                                                {subStatus.displayName}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Collapse>
                    <DialogContentText>
                        <p>
                            {changeStatusNavigationText}
                        </p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color='primary'
                        type='submit'
                        form={`form-${currentTab}`}
                        onClick={approveStatusChange}>אישור</Button>
                    <Button color='primary' onClick={cancelStatusChange}>ביטול</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default InvestigationStatusInfo;