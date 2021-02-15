import * as yup from 'yup';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { CakeOutlined, EventOutlined, Help, CalendarToday } from '@material-ui/icons';
import { Collapse, Grid, Typography, Paper, TextField, Select, MenuItem, InputLabel, FormControl, Tooltip } from '@material-ui/core';

import UserType from 'models/enums/UserType';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import InvestigationInfo from 'models/InvestigationInfo';
import useStatusUtils from 'Utils/StatusUtils/useStatusUtils';
import { InvestigationStatus } from 'models/InvestigationStatus';
import MutationIcon from 'commons/Icons/customIcons/MutationIcon';
import InvestigationMainStatus from 'models/InvestigationMainStatus';
import ReturnSickIcon from 'commons/Icons/customIcons/ReturnSickIcon';
import VaccinationIcon from 'commons/Icons/customIcons/VaccinationIcon';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import InvestigatedPatientStaticInfo from 'models/InvestigatedPatientStaticInfo';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
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
const noInfo = 'אין מידע';
const statusLabel = 'סטטוס';
const subStatusLabel = 'סיבה';
const statusReasonLabel = 'פירוט'
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';
const errorMessage = 'השדה יכול להכניס רק תווים חוקיים';
const requiredMessage = 'שדה זה הינו שדה חובה';
export const inProcess = 'בטיפול';

const InvestigatedPersonInfo = (props: Props) => {
    const { currentTab, investigationStaticInfo, epedemioligyNumber } = props;

    const classes = useStyles();

    const [statusReasonError, setStatusReasonError] = React.useState<string[] | null>(null);
    const { identityType, gender, isDeceased, isCurrentlyHospitalized, isInClosedInstitution, age, identityNumber, 
        fullName, primaryPhone, birthDate, validationDate, isReturnSick, previousDiseaseStartDate, 
        isVaccinated, vaccinationEffectiveFrom, isSuspicionOfMutation, mutationName } = investigationStaticInfo;
    const Divider = () => <span className={classes.divider}> | </span>;
    const { wasInvestigationReopend } = useStatusUtils();

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const statuses = useSelector<StoreStateType, InvestigationMainStatus[]>(state => state.statuses);
    const subStatuses = useSelector<StoreStateType, string[]>(state => state.subStatuses);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

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
        if (userType === UserType.ADMIN || userType === UserType.SUPER_ADMIN) {
            return status === InvestigationMainStatusCodes.NEW && wasInvestigationReopend
        }
        return status === InvestigationMainStatusCodes.NEW;
    };

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
                            format(validationDate, displayDateFormat)
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
                            (investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE &&
                                investigationStatus.subStatus === InvestigationComplexityByStatus.IS_DECEASED)) &&
                        <ComplexityIcon tooltipText='המאומת נפטר' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='isCurrentlyHospitalized' name='האם מאושפז' value={indication((isCurrentlyHospitalized || investigationStatus.subStatus === InvestigationComplexityByStatus.IS_CURRENTLY_HOSPITIALIZED))}
                        icon={Help}
                    />
                    {
                        (isCurrentlyHospitalized ||
                            (investigationStatus.mainStatus === InvestigationMainStatusCodes.CANT_COMPLETE &&
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
                    <Divider />
                    <Tooltip title={vaccinationEffectiveFrom ? formatDate(vaccinationEffectiveFrom) : noInfo}>
                        <div>
                            <InfoItemWithIcon testId='isVaccinated' name='האם מחוסן' value={isVaccinated ? yes : noInfo}
                                icon={VaccinationIcon}
                            />  
                        </div>
                        
                    </Tooltip>
                    {
                        isVaccinated && <ComplexityIcon tooltipText={formatDate(vaccinationEffectiveFrom)} />
                    }
                    <Divider />
                    <Tooltip title={mutationName ? mutationName : noInfo}>
                        <div>
                            <InfoItemWithIcon testId='isSuspicionOfMutation' name='חשד למוטציה' value={isSuspicionOfMutation ? yes : noInfo}
                                icon={MutationIcon}
                            />    
                        </div>
                         
                    </Tooltip>
                    {
                        isSuspicionOfMutation && <ComplexityIcon tooltipText={mutationName ? mutationName : noInfo} />
                    }
                    <Divider />
                    <Tooltip title={previousDiseaseStartDate ? formatDate(previousDiseaseStartDate) : noInfo}>
                        <div>
                            <InfoItemWithIcon testId='isReturnSick' name='חולה חוזר' value={isReturnSick ? yes : noInfo}
                                icon={ReturnSickIcon}
                            />   
                        </div>
                    </Tooltip>
                    {
                        isReturnSick && <ComplexityIcon tooltipText={formatDate(previousDiseaseStartDate)} />
                    }
                </div>
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
