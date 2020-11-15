import * as yup from 'yup';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import React, { ChangeEvent, useEffect } from 'react';
import { Collapse, Grid, Typography, Paper, TextField } from '@material-ui/core';
import { CakeOutlined, EventOutlined, Help, CalendarToday } from '@material-ui/icons';

import UserType from 'models/enums/UserType';
import StoreStateType from 'redux/storeStateType';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import { InvestigationStatus } from 'models/InvestigationStatus';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import InvestigatedPatientStaticInfo from 'models/InvestigatedPatientStaticInfo';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import InvestigationMenu from './InvestigationMenu/InvestigationMenu';

const leaveInvestigationMessage = 'צא מחקירה';
const displayDateFormat = 'dd/MM/yyyy';
const maxComplexityAge = 14;
const yes = 'כן';
const no = 'לא';
const statusLabel = 'סטטוס';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';
const errorMessage = 'השדה יכול להכניס רק תווים חוקיים';
const requiredMessage = 'שדה זה הינו שדה חובה';
const transferInvestigation = 'נדרשת העברה';
const excludeSpecialCharsRegex = /^[a-zA-Z\u0590-\u05fe\s0-9-+*!?'"():_,.\/\\]*$/

const InvestigatedPersonInfo = (props: Props) => {
    const { currentTab, investigatedPatientStaticInfo, epedemioligyNumber } = props;

    const classes = useStyles();

    const [statusReasonError, setStatusReasonError] = React.useState<string[] | null>(null);
    const { identityType, gender, isDeceased, patientInfo, isCurrentlyHospitalized, isInClosedInstitution } = investigatedPatientStaticInfo;
    const { age, identityNumber, fullName, primaryPhone, birthDate } = patientInfo;
    const Divider = () => <span className={classes.divider}> | </span>;
    const wasInvestigationReopend = useSelector<StoreStateType, Date | null>(state => state.investigation.endTime) !== null;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const statuses = useSelector<StoreStateType, string[]>(state => state.statuses);
    const subStatuses = useSelector<StoreStateType, string[]>(state => state.subStatuses);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const userType = useSelector<StoreStateType, number>(state => state.user.userType);

    const validationSchema = investigationStatus.subStatus === transferredSubStatus ? 
    yup.string().required(requiredMessage).matches(excludeSpecialCharsRegex, errorMessage).max(50, maxLengthErrorMessage).nullable() :
    yup.string().matches(excludeSpecialCharsRegex, errorMessage).max(50, maxLengthErrorMessage).nullable();

    const { confirmExitUnfinishedInvestigation, shouldUpdateInvestigationStatus } = useInvestigatedPersonInfo();

    useEffect(()=> {
        if (investigationStatus.subStatus !== transferredSubStatus) {
            validateStatusReason(investigationStatus.statusReason)
        }
    },[investigationStatus.subStatus])
    const permittedStatuses = statuses.filter((status: string) => {
        if ((userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN)
            && status === InvestigationMainStatus.NEW && !wasInvestigationReopend) {
            return true;
        }
        return (status !== InvestigationMainStatus.DONE && status !== InvestigationMainStatus.NEW)
    })
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

    const validateStatusReason = async (newStatusReason : string | null) => {
        try {
            await validationSchema.validateSync(newStatusReason);
            setStatusReasonError(null)
        } catch (err) {
            setStatusReasonError(err.errors)
        }
    }
    const isMandatoryInfoMissing: boolean = !birthDate && !fullName && !isLoading;

    return (
        <Paper className={classes.paper}>
            <div className={classes.headerTopPart}>
                <div className={classes.investigationHeaderInfo}>
                    <InvestigationMenu />
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
                        validateStatusReason(investigationStatus.statusReason)}}
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
                                <Autocomplete
                                    className={classes.statusSelect}
                                    test-id='currentStatus'
                                    options={permittedStatuses}
                                    getOptionLabel={(option) => option}
                                    inputValue={investigationStatus.mainStatus as string | undefined}
                                    onChange={(event, newStatus) => {
                                        if (newStatus) {
                                            setInvestigationStatus({
                                                mainStatus: newStatus,
                                                subStatus: '',
                                                statusReason: ''
                                            });
                                        }
                                    }}
                                    onInputChange={(event, newStatusInput) => {
                                        if (event?.type !== 'blur') {
                                            setInvestigationStatus({
                                                mainStatus: newStatusInput,
                                                subStatus: '',
                                                statusReason: ''
                                            });
                                        }
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            placeholder='סטטוס'
                                        />
                                    }
                                />
                            </Grid>
                            <Collapse in={investigationStatus.mainStatus === InvestigationMainStatus.CANT_COMPLETE ||
                                investigationStatus.mainStatus === InvestigationMainStatus.IN_PROCESS}>
                                <Grid item className={classes.statusSelectGrid}>
                                    <Autocomplete
                                        className={classes.subStatusSelect}
                                        test-id='currentSubStatus'
                                        options={subStatuses}
                                        getOptionLabel={(option) => option}
                                        inputValue={investigationStatus.subStatus as string | undefined}
                                        onChange={(event, newSubStatus) => {
                                            setInvestigationStatus({
                                                mainStatus: investigationStatus.mainStatus,
                                                subStatus: newSubStatus ? String(newSubStatus) : null,
                                                statusReason: ''
                                            });
                                        }}
                                        onInputChange={(event, newSubStatusInput) => {
                                            if (event?.type !== 'blur') {
                                                setInvestigationStatus({
                                                    mainStatus: investigationStatus.mainStatus,
                                                    subStatus: newSubStatusInput,
                                                    statusReason: ''
                                                });
                                            }
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                placeholder='סיבה'
                                            />
                                        }
                                    />
                                </Grid>
                            </Collapse>
                            <Collapse in={investigationStatus.mainStatus === InvestigationMainStatus.IN_PROCESS && investigationStatus.subStatus !== ''}>
                                <Grid item className={classes.statusSelectGrid}>
                                    <TextField
                                        className={classes.subStatusSelect}
                                        value={investigationStatus.statusReason}
                                        required={investigationStatus.subStatus === transferredSubStatus}
                                        placeholder='פירוט'
                                        error={statusReasonError ? true : false}
                                        label={statusReasonError ? statusReasonError[0] : ''}
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
                    {
                        age !== null &&
                        <>
                            <InfoItemWithIcon testId='age' name='גיל' value={+age < 1 ? 'פחות משנה' : age} icon={CakeOutlined} />
                            {
                                +age <= maxComplexityAge && <ComplexityIcon tooltipText='המאומת מתחת לגיל 15' />
                            }
                            <Divider />
                        </>
                    }
                    <InfoItemWithIcon testId='birthdate' name='תאריך לידה' value={
                        birthDate ? format(new Date(birthDate), displayDateFormat) : 'אין תאריך'
                    }
                        icon={CalendarToday}
                    />
                    {
                        isMandatoryInfoMissing && <ComplexityIcon tooltipText='אימות מרשם נכשל' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='examinationDate' name='תאריך תחילת מחלה' value=
                        {
                            format(new Date(props.coronaTestDate), displayDateFormat)
                        }
                        icon={EventOutlined}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='gender' name='מין' value={gender}
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='idType' name='סוג תעודה מזהה' value={identityType}
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='idNumber' name='מספר תעודה מזהה' value={identityNumber}
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='isDeceased' name='האם נפטר' value={indication((isDeceased || investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED))}
                        icon={Help}
                    />
                    {
                        (isDeceased ||
                            (investigationStatus.mainStatus === InvestigationMainStatus.CANT_COMPLETE &&
                                investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED)) &&
                        <ComplexityIcon tooltipText='המאומת נפטר' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='isCurrentlyHospitalized' name='האם מאושפז' value={indication((isCurrentlyHospitalized || investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED))}
                        icon={Help}
                    />
                    {
                        (isCurrentlyHospitalized ||
                            (investigationStatus.mainStatus === InvestigationMainStatus.CANT_COMPLETE &&
                                investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED)) &&
                        <ComplexityIcon tooltipText='המאומת מאושפז' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='isInInstitution' name='שוהה במוסד' value={indication(isInClosedInstitution)}
                        icon={Help}
                    />
                    {
                        isInClosedInstitution && <ComplexityIcon tooltipText='המאומת שוהה במוסד' />
                    }
                </div>
                <div className={classes.managementControllers}>
                    <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                        <Grid item xs={12} className={classes.fieldLabel}>
                            <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                                <Collapse in={investigationStatus.mainStatus === InvestigationMainStatus.CANT_COMPLETE}>
                                    <Grid item xs={5} className={classes.fieldLabel}>
                                        <Autocomplete
                                            className={classes.subStatusSelect}
                                            test-id='currentSubStatus'
                                            options={subStatuses}
                                            getOptionLabel={(option) => option}
                                            inputValue={investigationStatus.subStatus || ''}
                                            onChange={(event, newSubStatus) => {
                                                setInvestigationStatus({
                                                    mainStatus: investigationStatus.mainStatus,
                                                    subStatus: newSubStatus ? String(newSubStatus) : '',
                                                    statusReason: ''
                                                });
                                            }}
                                            onInputChange={(event, newSubStatusInput) => {
                                                if (event?.type !== 'blur' && shouldUpdateInvestigationStatus()) {
                                                    setInvestigationStatus({
                                                        mainStatus: investigationStatus.mainStatus,
                                                        subStatus: newSubStatusInput,
                                                        statusReason: ''
                                                    });
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    placeholder='סיבה'
                                                />
                                            }
                                        />
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Paper>
    );
};

interface Props {
    investigatedPatientStaticInfo: InvestigatedPatientStaticInfo;
    epedemioligyNumber: number;
    coronaTestDate: Date;
    currentTab: number;
};

export default InvestigatedPersonInfo
