import { format } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { Collapse, Grid, Typography, Paper, TextField } from '@material-ui/core';
import { CakeOutlined, EventOutlined, Help, CalendarToday } from '@material-ui/icons';

import StoreStateType from 'redux/storeStateType';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import { InvestigationStatus } from 'models/InvestigationStatus';
import ComplexityIcon from 'commons/ComplexityIcon/ComplexityIcon';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import InvestigatedPatientStaticInfo from 'models/InvestigatedPatientStaticInfo';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';

const leaveInvestigationMessage = 'צא מחקירה';
const displayDateFormat = 'dd/MM/yyyy';
const maxComplexityAge = 14;
const yes = 'כן';
const no = 'לא';

const InvestigatedPersonInfo = (props: Props) => {
    const { currentTab, investigatedPatientStaticInfo, epedemioligyNumber } = props;

    const classes = useStyles();
    
    const { identityType, gender, isDeceased, patientInfo, isCurrentlyHospitalized, isInClosedInstitution } = investigatedPatientStaticInfo;
    const { age, identityNumber, fullName, primaryPhone, birthDate } = patientInfo;
    const Divider = () => <span className={classes.divider}> | </span>;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);
    const subStatuses = useSelector<StoreStateType, string[]>(state => state.subStatuses);
    const isLoading = useSelector<StoreStateType, boolean>(state => state.isLoading);

    const { confirmExitUnfinishedInvestigation, handleCannotCompleteInvestigationCheck } = useInvestigatedPersonInfo();

    const [subStatusInput, setSubStatusInput] = useState<string>(investigationStatus.subStatus);

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

    const isMandatoryInfoMissing: boolean = birthDate === null && !fullName && !isLoading;

    React.useEffect(() => {
        setSubStatusInput(investigationStatus.subStatus)
    }, [investigationStatus]);

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
                    onClick={(event) => { handleLeaveInvestigationClick(event) }}
                    type='submit'
                    form={`form-${currentTab}`}
                >
                    {leaveInvestigationMessage}
                </PrimaryButton>
            </div>
            <div className={classes.informationBar}>
                <div className={classes.additionalInfo}>
                    <InfoItemWithIcon testId='age' name='גיל' value={age}
                        icon={CakeOutlined}
                    />
                    {
                        (age && +age <= maxComplexityAge) && <ComplexityIcon tooltipText='המאומת מתחת לגיל 15' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='birthdate' name='תאריך לידה' value={
                        birthDate ? format(new Date(birthDate), displayDateFormat) : 'אין תאריך'
                    }
                        icon={CalendarToday}
                    />
                    {
                        isMandatoryInfoMissing && <ComplexityIcon tooltipText='אימות מרשם נכשל' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='examinationDate' name='תאריך קבלת תשובה חיובית' value=
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
                    <InfoItemWithIcon testId='isDeceased' name='האם נפטר' value={indication(isDeceased)}
                        icon={Help}
                    />
                    {
                        isDeceased && <ComplexityIcon tooltipText='המאומת נפטר' />
                    }
                    <Divider />
                    <InfoItemWithIcon testId='isCurrentlyHospitalized' name='האם מאושפז' value={indication(isCurrentlyHospitalized)}
                        icon={Help}
                    />
                    {
                        isCurrentlyHospitalized && <ComplexityIcon tooltipText='המאומת מאושפז' />
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
                                <Grid item xs={7} className={classes.fieldLabel}>
                                    <CustomCheckbox
                                        testId='cannotCompleteInvestigation'
                                        checkboxElements={[
                                            {
                                                checked: investigationStatus.mainStatus === InvestigationMainStatus.CANT_COMPLETE,
                                                labelText: 'לא ניתן להשלים חקירה',
                                                onChange: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleCannotCompleteInvestigationCheck(checked))
                                            }
                                        ]}
                                    />
                                </Grid>
                                <Collapse in={investigationStatus.mainStatus === InvestigationMainStatus.CANT_COMPLETE}>
                                    <Grid item xs={5} className={classes.fieldLabel}>
                                        <Autocomplete
                                            className={classes.subStatusSelect}
                                            test-id='currentSubStatus'
                                            options={subStatuses}
                                            getOptionLabel={(option) => option}
                                            inputValue={subStatusInput}
                                            onChange={(event, newSubStatus) => {
                                                setInvestigationStatus({
                                                    mainStatus: investigationStatus.mainStatus,
                                                    subStatus: String(newSubStatus)
                                                })
                                            }
                                            }
                                            onInputChange={(event, newSubStatusInput) => {
                                                setSubStatusInput(newSubStatusInput)
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
