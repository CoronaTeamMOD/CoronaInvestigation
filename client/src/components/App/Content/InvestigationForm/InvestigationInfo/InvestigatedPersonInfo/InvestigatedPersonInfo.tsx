import * as yup from 'yup';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Edit, CakeOutlined, EventOutlined, Help, CalendarToday } from '@material-ui/icons';
import { Typography, Paper, TextField, Select, MenuItem, Tooltip } from '@material-ui/core';

import UserTypeCodes from 'models/enums/UserTypeCodes';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import StaticFields from 'models/enums/StaticFields';
import InvestigationInfo from 'models/InvestigationInfo';
import { InvestigationStatus } from 'models/InvestigationStatus';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import MutationIcon from 'commons/Icons/customIcons/MutationIcon';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import ReturnSickIcon from 'commons/Icons/customIcons/ReturnSickIcon';
import VaccinationIcon from 'commons/Icons/customIcons/VaccinationIcon';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX } from 'commons/Regex/Regex';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';
import { transferredSubStatus } from 'components/App/Content/LandingPage/InvestigationTable/useInvestigationTable';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import InvestigationMenu from './InvestigationMenu/InvestigationMenu';
import InvestigationStatusInfo from './InvestigationStatusInfo/InvestigationStatusInfo';

const leaveInvestigationMessage = 'צא מחקירה';
const saveStaticDetailsMessage = 'שמירת שינויים';
const displayDateFormat = 'dd/MM/yyyy';
const maxComplexityAge = 14;
const yes = 'כן';
const no = 'לא';
const noInfo = 'אין מידע';
const maxLengthErrorMessage = 'השדה יכול להכיל 50 תוים בלבד';
const errorMessage = 'השדה יכול להכניס רק תווים חוקיים';
const requiredMessage = 'שדה זה הינו שדה חובה';
export const inProcess = 'בטיפול';

const InvestigatedPersonInfo = (props: Props) => {

    const { currentTab, investigationStaticInfo, epedemioligyNumber } = props;

    const classes = useStyles();

    const [statusReasonError, setStatusReasonError] = useState<string[] | null>(null);
    const [staticFieldsChange, setStaticFieldsChange] = useState<boolean>(false);
    
    const { identityType, gender, isDeceased, isCurrentlyHospitalized, isInClosedInstitution, age, identityNumber, 
        fullName, primaryPhone, birthDate, validationDate, isReturnSick, previousDiseaseStartDate, 
        isVaccinated, vaccinationEffectiveFrom, isSuspicionOfMutation, mutationName } = investigationStaticInfo;

    const Divider = () => <span className={classes.divider}> | </span>;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);

    const validationStatusSchema = investigationStatus.subStatus === transferredSubStatus ?
        yup.string().required(requiredMessage).matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage).max(50, maxLengthErrorMessage).nullable() :
        yup.string().matches(ALPHANUMERIC_SPECIAL_CHARS_TEXT_REGEX, errorMessage).max(50, maxLengthErrorMessage).nullable();

    const { confirmExitUnfinishedInvestigation } = useInvestigatedPersonInfo();

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
            validationStatusSchema.validateSync(newStatusReason);
            setStatusReasonError(null)
        } catch (err) {
            setStatusReasonError(err.errors)
        }
    }

    const isMandatoryInfoMissing: boolean = !birthDate && !fullName && !isLoading;

    const methods = useForm({
        mode: 'all',
        //resolver: yupResolver(mode === FormMode.CREATE ? SignUpSchema : EditSchema)
    });

    const onSubmit = () => {
        const data = methods.getValues();
        console.log(data);
    };
    
    return (
        <FormProvider {...methods}>
            <form id='staticFields' onSubmit={methods.handleSubmit(onSubmit)}>
                <Paper className={classes.paper}>
                    <div className={classes.headerTopPart}>
                        <div className={classes.investigationHeaderInfo}>
                            <InvestigationMenu />
                            {userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN ? 
                                <>
                                    <Edit />
                                    <Typography variant='h6' className={classes.investigationTitle}>
                                        {'שם:'}
                                    </Typography>
                                    <Controller 
                                        name={StaticFields.FULL_NAME}
                                        control={methods.control}
                                        render={(props) => (
                                            <TextField
                                                test-id={props.name}
                                                value={props.value || fullName}
                                                onChange={(event) => {
                                                    props.onChange(event.target.value)
                                                    setStaticFieldsChange(true)
                                                }}                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || ''}
                                            />
                                        )}
                                    />
                                </>
                                :
                                <Typography variant='h6' className={classes.investigationTitle}>
                                    {`שם: ${fullName}`}
                                </Typography>
                            }
                            {isMandatoryInfoMissing && <ComplexityIcon tooltipText='אימות מרשם נכשל' />}
                            <PhoneDial
                                phoneNumber={primaryPhone}
                            />
                            <Typography variant='h6' className={classes.investigationTitle}>
                                {`מספר אפדימיולוגי: ${epedemioligyNumber}`}
                            </Typography>
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
                    <InvestigationStatusInfo 
                        statusReasonError={statusReasonError}
                        validateStatusReason={validateStatusReason}
                        validationStatusSchema={validationStatusSchema}
                    />
                    <div className={classes.informationBar}>
                        <div className={classes.additionalInfo}>
                            {
                                age !== null &&
                                <>
                                    <InfoItemWithIcon testId='age' name='גיל' value={+age < 1 ? 'פחות משנה' : age} icon={CakeOutlined} />
                                    {
                                        +age <= maxComplexityAge && <ComplexityIcon tooltipText='המאומת מתחת לגיל 14' />
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
                            {userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN ?
                                <>
                                    <InfoItemWithIcon testId='idType' name='סוג תעודה מזהה' value=''
                                        icon={Edit}
                                    />
                                    <Controller
                                        control={methods.control}
                                        name={StaticFields.IDENTIFICATION_TYPE}
                                        render={(props) => (
                                            <Select
                                                {...props}
                                                disabled
                                                value={identityType}
                                                className={classes.smallSizeText}
                                                onChange={(event) => {
                                                    props.onChange(event.target.value)
                                                    setStaticFieldsChange(true)
                                                }}
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
                                            >
                                                {Object.values(IdentificationTypes).map((identificationType: string) => (
                                                    <MenuItem
                                                        className={classes.smallSizeText}
                                                        key={identificationType}
                                                        value={identificationType}>
                                                        {identificationType}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </>
                                :
                                <InfoItemWithIcon testId='idType' name='סוג תעודה מזהה' value={identityType}
                                    icon={Help}
                                />
                            }
                            <Divider />
                            {userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN ?
                                <>
                                    <InfoItemWithIcon testId='idNumber' name='מספר תעודה מזהה' value=''
                                        icon={Edit}
                                    />
                                    <Controller 
                                        name={StaticFields.ID}
                                        control={methods.control}
                                        render={(props) => (
                                            <TextField
                                                disabled
                                                className={classes.smallSizeText}
                                                InputProps={{className: classes.smallSizeText}}
                                                test-id={props.name}
                                                value={props.value || identityNumber}
                                                onChange={(event) => {
                                                    props.onChange(event.target.value as string)
                                                    setStaticFieldsChange(true)
                                                }}
                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || ''}
                                            />
                                        )}
                                    />
                                </>
                                :
                                <InfoItemWithIcon testId='idNumber' name='מספר תעודה מזהה' value={identityNumber}
                                    icon={Help}
                                />
                            }
                            
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
                            <Tooltip title={isVaccinated ? vaccinationEffectiveFrom ? formatDate(vaccinationEffectiveFrom) : noInfo : ''}>
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
                            <Tooltip title={isSuspicionOfMutation ? mutationName ? mutationName : noInfo : ''}>
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
                            <Tooltip title={isReturnSick ? previousDiseaseStartDate ? formatDate(previousDiseaseStartDate) : noInfo : ''}>
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
                    {staticFieldsChange &&
                        <div className={classes.saveButton}>
                            <PrimaryButton
                                test-id='staticFields'
                                form='staticFields'
                                type='submit'
                            >
                                {saveStaticDetailsMessage}
                            </PrimaryButton>
                        </div>
                
                    }                  
                </Paper>
            </form>
        </FormProvider>
    );
};

interface Props {
    investigationStaticInfo: InvestigationInfo;
    epedemioligyNumber: number;
    currentTab: number;
};

export default InvestigatedPersonInfo;