import { format } from 'date-fns';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { CakeOutlined, EventOutlined, Help } from '@material-ui/icons';
import { Collapse, Grid, Typography, Paper, TextField } from '@material-ui/core';

import axios from 'Utils/axios';
import logger from 'logger/logger';
import StoreStateType from 'redux/storeStateType';
import { Service, Severity } from 'models/Logger';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import { InvestigationStatus } from 'models/InvestigationStatus';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InvestigationMainStatus from 'models/enums/InvestigationMainStatus';
import InvestigatedPatientStaticInfo from 'models/InvestigatedPatientStaticInfo';
import { setInvestigationStatus } from 'redux/Investigation/investigationActionCreators';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';

const leaveInvestigationMessage = 'צא מחקירה';

const InvestigatedPersonInfo = (props: Props) => {

    const classes = useStyles();
    const { currentTab, investigatedPatientStaticInfo, epedemioligyNumber } = props;

    const Divider = () => <span className={classes.divider}> | </span>;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const investigationStatus = useSelector<StoreStateType, InvestigationStatus>(state => state.investigation.investigationStatus);

    const { confirmExitUnfinishedInvestigation, handleCantReachInvestigatedCheck,
        handleCannotCompleteInvestigationCheck
    } = useInvestigatedPersonInfo();

    const [subStatuses, setSubStatuses] = useState<string[]>([]);
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

    React.useEffect(() => {
        setSubStatusInput(investigationStatus.subStatus)
    }, [investigationStatus])

    React.useEffect(() => {
        axios.get('/investigationInfo/subStatuses').then((result: any) => {

            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting sub statuses',
                step: `recieved DB response ${JSON.stringify(result)}`,
            });

            const resultNodes = result?.data?.data?.allInvestigationSubStatuses?.nodes;

            if (resultNodes) {
                setSubStatuses(resultNodes.map((element: any) => element.displayName))
            }
        }).catch((err: any) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Getting sub statuses',
                step: `error DB response ${JSON.stringify(err)}`,
            });
        });
    }, [])

    return (
        <Paper className={classes.paper}>
            <div className={classes.headerTopPart}>
                <div className={classes.investigationHeaderInfo}>
                    <Typography variant='h6' className={classes.investigationTitle}>
                        {
                            investigatedPatientStaticInfo.patientInfo.fullName
                        },
                        {
                            epedemioligyNumber
                        }
                    </Typography>
                    <PhoneDial
                        phoneNumber={investigatedPatientStaticInfo.patientInfo.primaryPhone}
                    />
                </div>
                <PrimaryButton
                    onClick={(e) => { handleLeaveInvestigationClick(e) }}
                    type='submit'
                    form={`form-${currentTab}`}
                >
                    {leaveInvestigationMessage}
                </PrimaryButton>
            </div>
            <div className={classes.informationBar}>
                <div className={classes.additionalInfo}>
                    <InfoItemWithIcon testId='age' name='גיל' value={
                        investigatedPatientStaticInfo.patientInfo.age
                    }
                        icon={CakeOutlined}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='examinationDate' name='תאריך הבדיקה' value={
                        format(new Date(props.coronaTestDate), 'dd/MM/yyyy')
                    }
                        icon={EventOutlined}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='gender' name='מין' value={
                        investigatedPatientStaticInfo.gender
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='idType' name='סוג תעודה מזהה' value={
                        investigatedPatientStaticInfo.identityType
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='idNumber' name='מספר תעודה מזהה' value={
                        investigatedPatientStaticInfo.patientInfo.identityNumber
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='isDeceased' name='האם נפטר' value={
                        investigatedPatientStaticInfo.isDeceased ?
                            'כן' :
                            'לא'
                    }
                        icon={Help}
                    />
                </div>
                <div className={classes.managementControllers}>
                    <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                        <Grid item xs={12} className={classes.fieldLabel}>
                            <CustomCheckbox
                                checkboxElements={[
                                    {
                                        checked: investigationStatus.mainStatus === InvestigationMainStatus.CANT_REACH,
                                        labelText: 'אין מענה במספר זה',
                                        onChange: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleCantReachInvestigatedCheck(checked))
                                    }
                                ]}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.fieldLabel}>
                            <Grid container className={classes.containerGrid} justify='flex-start' alignItems='center'>
                                <Grid item xs={7} className={classes.fieldLabel}>
                                    <CustomCheckbox
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
}

export default InvestigatedPersonInfo
