import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Typography, Paper } from '@material-ui/core';
import { CakeOutlined, EventOutlined, Help } from '@material-ui/icons';

import StoreStateType from 'redux/storeStateType';
import PhoneDial from 'commons/PhoneDial/PhoneDial';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import InvestigatedPatientStaticInfo from 'models/InvestigatedPatientStaticInfo';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';

const leaveInvestigationMessage = 'צא מחקירה';

const InvestigatedPersonInfo = (props: Props) => {

    const classes = useStyles();
    const { currentTab, investigatedPatientStaticInfo, epedemioligyNumber } = props;

    const Divider = () => <span className={classes.divider}> | </span>;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const cantReachInvestigated = useSelector<StoreStateType, boolean>(state => state.investigation.cantReachInvestigated);

    const { confirmExitUnfinishedInvestigation, handleCantReachInvestigatedCheck, getPersonAge } = useInvestigatedPersonInfo();
    
    const handleLeaveInvestigationClick = (e: React.ChangeEvent<{}>) => {
        if(isEventTrigeredByMouseClicking(e)) {
            confirmExitUnfinishedInvestigation(epidemiologyNumber, cantReachInvestigated);
        }
    };

    const isEventTrigeredByMouseClicking = (e: React.ChangeEvent<{}>) => {
        //@ts-ignore
        return !(e.clientX==0 && e.clientY==0);
    };

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
                    onClick={(e) => {handleLeaveInvestigationClick(e)}}
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
                    <CustomCheckbox
                        checkboxElements={[
                            {
                                checked: cantReachInvestigated,
                                labelText: 'אין מענה במספר זה',
                                onChange: ((event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleCantReachInvestigatedCheck(checked))
                            }
                        ]}
                    />
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
