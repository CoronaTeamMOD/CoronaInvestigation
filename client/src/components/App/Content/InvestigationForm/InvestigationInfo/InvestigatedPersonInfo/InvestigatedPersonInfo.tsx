import axios from 'axios';
import * as yup from 'yup';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import React, { ChangeEvent, useEffect, useMemo, useContext } from 'react';
import { Collapse, Grid, Typography, Paper, TextField, Select, MenuItem, InputLabel, FormControl, Tooltip, Button } from '@material-ui/core';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import InvestigationInfo from 'models/InvestigationInfo';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

import useStyles from './InvestigatedPersonInfoStyles';
import PatientInfoItem from './PatientInfoItem/PatientInfoItem';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import CommentInput from './InvestigationMenu/CommentDialog/CommentInput';
import { commentContext } from '../Context/CommentContext';

const leaveInvestigationMessage = 'צא מחקירה';
const displayDateFormat = 'dd/MM/yyyy';
const maxComplexityAge = 14;
const yes = 'כן';
const no = 'לא';
const noInfo = 'אין מידע';
const statusLabel = 'סטטוס';
const subStatusLabel = 'סיבה';
const statusReasonLabel = 'פירוט'
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';
const errorMessage = 'השדה יכול להכניס רק תווים חוקיים';
const requiredMessage = 'שדה זה הינו שדה חובה';
const commentLabel = 'הערה'
const SAVE_BUTTON_TEXT = 'שמור הערה';
export const inProcess = 'בטיפול';

const InvestigatedPersonInfo = (props: Props) => {
    const { currentTab, investigationStaticInfo, epedemioligyNumber } = props;

    const classes = useStyles();

    const [statusReasonError, setStatusReasonError] = React.useState<string[] | null>(null);
    const { identityType, gender, isDeceased, isCurrentlyHospitalized, isInClosedInstitution, age, identityNumber, 
        fullName, primaryPhone, birthDate, validationDate, isReturnSick, previousDiseaseStartDate, 
        isVaccinated, vaccinationEffectiveFrom, isSuspicionOfMutation, mutationName } = investigationStaticInfo;
    const { wasInvestigationReopend } = useStatusUtils();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const statuses = useSelector<StoreStateType, InvestigationMainStatus[]>(state => state.statuses);
    const subStatuses = useSelector<StoreStateType, string[]>(state => state.subStatuses);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);
    const [commentInput, setCommentInput] = React.useState<string>('');
    const { comment, setComment } = useContext(commentContext);

    const validationSchema = investigationStatus.subStatus === transferredSubStatus ?
        yup.string().required(requiredMessage).matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage).max(50, maxLengthErrorMessage).nullable() :
        yup.string().matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage).max(50, maxLengthErrorMessage).nullable();

    const { confirmExitUnfinishedInvestigation } = useInvestigatedPersonInfo();

    useEffect(() => {
        if (investigationStatus.subStatus !== transferredSubStatus) {
            validateStatusReason(investigationStatus.statusReason)
        }
    }, [investigationStatus.subStatus]);

    const updatedSubStatuses = useMemo(() =>
        investigationStatus.mainStatus === InvestigationMainStatusCodes.IN_PROCESS ? [inProcess , ...subStatuses] : subStatuses,
        [subStatuses, investigationStatus]);

    const permittedStatuses = statuses.filter(status => status.id !== InvestigationMainStatusCodes.DONE);

    const handleLeaveInvestigationClick = (event: React.ChangeEvent<{}>) => {
        if (isEventTrigeredByMouseClicking(event)) {
            confirmExitUnfinishedInvestigation(epidemiologyNumber);
        }
    };

    const isEventTrigeredByMouseClicking = (event: React.ChangeEvent<{}>) => {
        //@ts-ignore
        return !(event.clientX === 0 && event.clientY === 0);
    };

    const indication = (check: boolean) => {
        return check ? yes : no;
    };

    const validateStatusReason = (newStatusReason: string | null) => {
        try {
            validationSchema.validateSync(newStatusReason);
            setStatusReasonError(null)
        } catch (err) {
            setStatusReasonError(err.errors)
        }
    }

    const isMandatoryInfoMissing: boolean = !birthDate && !fullName && !isLoading;

    const isStatusDisable = (status: number) => {
        if (userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN) {
            return status === InvestigationMainStatusCodes.NEW && wasInvestigationReopend
        }
        return status === InvestigationMainStatusCodes.NEW;
    };

    const sendComment = (commentToSend: string | null) => {
        const sendCommentLogger = logger.setup(`POST request add comment to investigation ${epidemiologyNumber}`);
        axios.post('/investigationInfo/comment', { comment: commentToSend, epidemiologyNumber })
            .then(() => {
                setComment(commentToSend);
                sendCommentLogger.info('Successfully added comment to investigation', Severity.LOW);
            })
            .catch(() => {
                sendCommentLogger.error('Error occured in adding comment to investigation', Severity.HIGH);
            })
            .finally();
    };

    return (
        <Paper className={classes.paper}>
            <div className={classes.headerTopPart}>
                <div className={classes.investigationHeaderInfo}>
                    <Typography variant='h6' className={classes.investigationTitle}>
                        {`${fullName} ${epedemioligyNumber}`}
                    </Typography>
                    {isMandatoryInfoMissing && <ComplexityIcon tooltipText='אימות מרשם נכשל' />}
                    <PhoneDial
                        phoneNumber={primaryPhone}
                    />
                </div>
                <PrimaryButton
                    onClick={(event) => {
                        handleLeaveInvestigationClick(event);
                        validateStatusReason(investigationStatus.statusReason)
                    }}
                    type='submit'
                    form={`form-${currentTab}`}
                >
                    {leaveInvestigationMessage}
                </PrimaryButton>
            </div>
            <div className={classes.managementControllers}>
                <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                    <Grid item xs={12} className={classes.fieldLabel}>
                        <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                            <Typography>
                                <b><bdi>{statusLabel}</bdi>: </b>
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
                                        <InputLabel className={classes.subStatusLabel} id='sub-status-label'>{subStatusLabel}</InputLabel>
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
                                        error={statusReasonError ? true : false}
                                        label={statusReasonError ? statusReasonError[0] : statusReasonLabel}
                                        onChange={async (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
                                            const newStatusReason: string = event.target.value;
                                            const isValid = validationSchema.isValidSync(newStatusReason);
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
            </div>
            <div className={classes.informationBar}>
                <div className={classes.additionalInfo}>
                    <div className={classes.line}>
                    {
                        age !== null &&
                        <>
                            <PatientInfoItem testId='age' name='גיל' value={+age < 1 ? 'פחות משנה' : age} />
                            {
                                +age <= maxComplexityAge && <ComplexityIcon tooltipText='המאומת מתחת לגיל 14' />
                            }
                        </>
                    }
                    {
                        isMandatoryInfoMissing && <ComplexityIcon tooltipText='אימות מרשם נכשל' />
                    }
                    <PatientInfoItem testId='examinationDate' name='תחילת מחלה' value=
                        {
                            format(validationDate, displayDateFormat)
                        }
                    />
                    <PatientInfoItem testId='gender' name='מין' value={gender==='נקבה'?'נ':'ז'} />
                    <PatientInfoItem testId='idType' name='סוג תעודה מזהה' value={identityType}  />
                    <PatientInfoItem testId='idNumber' name='מספר תעודה מזהה' value={identityNumber} />
                    </div>
                    <div className={classes.line}>
                    <PatientInfoItem testId='isDeceased' name='נפטר' value={indication((isDeceased || investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED))} />
                    {
                        (isDeceased ||
                            (investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE &&
                                investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED)) &&
                        <ComplexityIcon tooltipText='המאומת נפטר' />
                    }
                    <PatientInfoItem testId='isCurrentlyHospitalized' name='מאושפז' value={indication((isCurrentlyHospitalized || investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED))} />
                    {
                        (isCurrentlyHospitalized ||
                            (investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE &&
                                investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED)) &&
                        <ComplexityIcon tooltipText='המאומת מאושפז' />
                    }
                    <PatientInfoItem testId='isInInstitution' name='שוהה במוסד' value={indication(isInClosedInstitution)} />
                    {
                        isInClosedInstitution && <ComplexityIcon tooltipText='המאומת שוהה במוסד' />
                    }
                    <Tooltip title={isVaccinated ? vaccinationEffectiveFrom ? formatDate(vaccinationEffectiveFrom) : noInfo : ''}>
                        <div>
                            <PatientInfoItem testId='isVaccinated' name='מחוסן' value={isVaccinated ? yes : noInfo} />  
                        </div>
                        
                    </Tooltip>
                    {
                        isVaccinated && <ComplexityIcon tooltipText={formatDate(vaccinationEffectiveFrom)} />
                    }
                    <Tooltip title={isSuspicionOfMutation ? mutationName ? mutationName : noInfo : ''}>
                        <div>
                            <PatientInfoItem testId='isSuspicionOfMutation' name='חשד למוטציה' value={isSuspicionOfMutation ? yes : noInfo} />    
                        </div>
                         
                    </Tooltip>
                    {
                        isSuspicionOfMutation && <ComplexityIcon tooltipText={mutationName ? mutationName : noInfo} />
                    }
                    <Tooltip title={isReturnSick ? previousDiseaseStartDate ? formatDate(previousDiseaseStartDate) : noInfo : ''} >
                        <div>
                            <PatientInfoItem testId='isReturnSick' name='חולה חוזר' value={isReturnSick ? yes : noInfo}/>   
                        </div>
                    </Tooltip>
                    {
                        isReturnSick && <ComplexityIcon tooltipText={formatDate(previousDiseaseStartDate)} />
                    }
                    </div>
                </div>
            </div>
            <div className={classes.commentControllers}>
                <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                    <div className={classes.commentLine}>
                        <Typography className={classes.commentTitle}>
                            <b><bdi>{commentLabel}</bdi>: </b>
                        </Typography>
                        <CommentInput commentInput={commentInput} handleInput={setCommentInput} />
                        <Button 
                            className={classes.button} 
                            onClick={()=>{sendComment(commentInput as string)}}
                            disabled={!(commentInput && commentInput !== comment)}>
                                {SAVE_BUTTON_TEXT}
                        </Button>
                    </div>
                </Grid>
            </div>
        </Paper>
    );
};

interface Props {
    investigationStaticInfo: InvestigationInfo;
    epedemioligyNumber: number;
    currentTab: number;
};

export default InvestigatedPersonInfo;
