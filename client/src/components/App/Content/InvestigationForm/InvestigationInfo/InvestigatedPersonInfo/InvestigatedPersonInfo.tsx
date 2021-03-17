import axios from 'axios';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Edit } from '@material-ui/icons';
import { yupResolver } from '@hookform/resolvers';
import React, { useEffect, useState, useContext } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Grid, Typography, Paper, TextField, Select, MenuItem, Button } from '@material-ui/core';

import logger from 'logger/logger';
import { Severity } from 'models/Logger';
import StoreStateType from 'redux/storeStateType';
import formatDate from 'Utils/DateUtils/formatDate';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import StaticFields from 'models/enums/StaticFields';
import UserTypeCodes from 'models/enums/UserTypeCodes';
import InvestigationInfo from 'models/InvestigationInfo';
import { InvestigationStatus } from 'models/InvestigationStatus';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InvestigationMainStatusCodes from 'models/enums/InvestigationMainStatusCodes';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
import InvestigationComplexityByStatus from 'models/enums/InvestigationComplexityByStatus';

import useStyles from './InvestigatedPersonInfoStyles';
import { commentContext } from '../Context/CommentContext';
import StaticFieldsSchema from './Schema/StaticFieldsSchema';
import PatientInfoItem from './PatientInfoItem/PatientInfoItem';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import ValidationStatusSchema from './Schema/ValidationStatusSchema';
import CommentInput from './InvestigationMenu/CommentDialog/CommentInput';
import InvestigationStatusInfo from './InvestigationStatusInfo/InvestigationStatusInfo';

const leaveInvestigationMessage = 'צא מחקירה';
const saveStaticDetailsMessage = 'שמירת שינויים';
const displayDateFormat = 'dd/MM/yyyy';
const maxComplexityAge = 14;
const yes = 'כן';
const no = 'לא';
const noInfo = 'אין מידע';
const commentLabel = 'הערה'
const SAVE_BUTTON_TEXT = 'שמור הערה';
export const inProcess = 'בטיפול';

const InvestigatedPersonInfo = (props: Props) => {

    const { currentTab, investigationStaticInfo, epedemioligyNumber } = props;

    const classes = useStyles();

    const [statusReasonError, setStatusReasonError] = useState<string[] | null>(null);
    const [staticFieldsChange, setStaticFieldsChange] = useState<boolean>(false);
    
    const { identityType, gender, isDeceased, isCurrentlyHospitalized, isInClosedInstitution, age, identityNumber, 
        fullName, primaryPhone, birthDate, validationDate, isReturnSick, previousDiseaseStartDate, 
        isVaccinated, vaccinationEffectiveFrom, isSuspicionOfMutation, mutationName } = investigationStaticInfo;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);
    const userType = useSelector<StoreStateType, number>(state => state.user.data.userType);
    const { comment, setComment } = useContext(commentContext);
    const [commentInput, setCommentInput] = React.useState<string|null>('');

    const { confirmExitUnfinishedInvestigation, staticFieldsSubmit } = useInvestigatedPersonInfo({ setStaticFieldsChange });

    useEffect(() => {
        setCommentInput(comment);
    }, [comment])

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(StaticFieldsSchema)
    });
  
    const onSubmit = () => {
        const data = methods.getValues();
        staticFieldsSubmit(data);
    };

    useEffect(() => {
        methods.reset(StaticFields);
    }, [fullName, identityType, identityNumber])

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
            ValidationStatusSchema(investigationStatus.subStatus).validateSync(newStatusReason);
            setStatusReasonError(null)
        } catch (err) {
            setStatusReasonError(err.errors)
        }
    };

    const isMandatoryInfoMissing: boolean = !birthDate && !fullName && !isLoading;
    
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
        <FormProvider {...methods}>
            <form id='staticFields' onSubmit={methods.handleSubmit(onSubmit)}>
                <Paper className={classes.paper}>
                    <div className={classes.headerTopPart}>
                        <div className={classes.investigationHeaderInfo}>
                            {userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN ? 
                                <>
                                    <Edit />
                                    <Typography className={classes.investigationTitle}>
                                        {'שם:'}
                                    </Typography>
                                    <Controller 
                                        name={StaticFields.FULL_NAME}
                                        control={methods.control}
                                        defaultValue={fullName}
                                        render={(props) => (
                                            <TextField
                                                {...props}
                                                test-id={props.name}
                                                onChange={(event) => {
                                                    props.onChange(event.target.value)
                                                    setStaticFieldsChange(true)
                                                }}     
                                                error={methods.errors && methods.errors[StaticFields.FULL_NAME]}   
                                                label={(methods.errors && methods.errors[StaticFields.FULL_NAME]?.message) || ''}
                                            />
                                        )}
                                    />
                                </>
                                :
                                <Typography className={classes.investigationTitle}>
                                    {`שם: ${fullName}`}
                                </Typography>
                            }
                            {isMandatoryInfoMissing && <ComplexityIcon tooltipText='אימות מרשם נכשל' />}
                            <PhoneDial
                                phoneNumber={primaryPhone}
                            />
                            <Typography className={classes.investigationTitle}>
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
                        ValidationStatusSchema={ValidationStatusSchema}
                    />

                    <div className={classes.informationBar}>
                        <div className={classes.additionalInfo}>
                            <Grid container alignItems='center' className={classes.line}>
                                {age !== null &&
                                <>
                                    <PatientInfoItem testId='age' name='גיל' value={+age < 1 ? 'פחות משנה' : age} />
                                    {
                                        +age <= maxComplexityAge && <ComplexityIcon tooltipText='המאומת מתחת לגיל 14' />
                                    }
                                </>
                                }
                                {isMandatoryInfoMissing && 
                                    <ComplexityIcon tooltipText='אימות מרשם נכשל' />
                                }
                                <PatientInfoItem testId='examinationDate' name='תחילת מחלה' value=
                                    {
                                        format(validationDate, displayDateFormat)
                                    }
                                />
                                <PatientInfoItem testId='gender' name='מין' value={gender==='נקבה'?'נ':'ז'} />
                                {userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN ?
                                <>
                                    <PatientInfoItem testId='idType' name='סוג תעודה מזהה' value={''}  />
                                    <Controller
                                        control={methods.control}
                                        name={StaticFields.IDENTIFICATION_TYPE}
                                        defaultValue={identityType}
                                        render={(props) => (
                                            <Select
                                                {...props}
                                                disabled
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
                                <PatientInfoItem testId='idType' name='סוג תעודה מזהה' value={identityType}  />
                                }
                                {userType === UserTypeCodes.ADMIN || userType === UserTypeCodes.SUPER_ADMIN ?
                                <>
                                    <PatientInfoItem testId='idNumber' name='מספר תעודה מזהה' value={''} />
                                    <Controller 
                                        name={StaticFields.ID}
                                        control={methods.control}
                                        defaultValue={identityNumber}
                                        render={(props) => (
                                            <TextField
                                                {...props}
                                                disabled
                                                className={classes.smallSizeText}
                                                InputProps={{className: classes.smallSizeText}}
                                                test-id={props.name}
                                                onChange={(event) => {
                                                    props.onChange(event.target.value as string)
                                                    setStaticFieldsChange(true)
                                                }}
                                                error={methods.errors && methods.errors[StaticFields.ID]}   
                                                label={(methods.errors && methods.errors[StaticFields.ID]?.message) || ''}
                                            />
                                        )}
                                    />
                                </>
                                :
                                <PatientInfoItem testId='idNumber' name='מספר תעודה מזהה' value={identityNumber} />
                                }
                            </Grid>
                            <Grid container alignItems='center' className={classes.line}>
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
                                <PatientInfoItem testId='isVaccinated' name='מחוסן' value={isVaccinated ? yes : noInfo} />  
                                {
                                    isVaccinated && <ComplexityIcon tooltipText={formatDate(vaccinationEffectiveFrom)} />
                                }
                                <PatientInfoItem testId='isSuspicionOfMutation' name='חשד למוטציה' value={isSuspicionOfMutation ? yes : noInfo} />    
                                {
                                    isSuspicionOfMutation && <ComplexityIcon tooltipText={mutationName ? mutationName : noInfo} />
                                }
                                <PatientInfoItem testId='isReturnSick' name='חולה חוזר' value={isReturnSick ? yes : noInfo}/>   
                                {
                                    isReturnSick && <ComplexityIcon tooltipText={formatDate(previousDiseaseStartDate)} />
                                }
                            </Grid>
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
                    <div className={classes.commentControllers}>
                        <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                            <div className={classes.commentLine}>
                                <Typography className={classes.commentTitle}>
                                    {commentLabel}:
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