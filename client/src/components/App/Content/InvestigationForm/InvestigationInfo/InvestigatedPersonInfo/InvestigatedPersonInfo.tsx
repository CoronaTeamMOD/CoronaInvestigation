import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Typography, Paper } from '@material-ui/core';
import { CheckCircleOutline, CakeOutlined, EventOutlined, Help } from '@material-ui/icons';

import StoreStateType from 'redux/storeStateType';
import { getPersonFullName } from 'Utils/displayUtils';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { InvestigatedPatientByInvestigatedPatientId } from 'models/InvestigatedPatientByInvestigatedPatientId';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';

const leaveInvestigationMessage = 'צא מחקירה';

const InvestigatedPersonInfo = (props: Props) => {

    const classes = useStyles();
    const { investigatedPatientByInvestigatedPatientId, epedemioligyNumber } = props;

    const Divider = () => <span className={classes.divider}> | </span>;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const cantReachInvestigated = useSelector<StoreStateType, boolean>(state => state.investigation.cantReachInvestigated);

    const { confirmExitUnfinishedInvestigation, handleCantReachInvestigatedCheck, getPersonAge } = useInvestigatedPersonInfo();

    return (
        <Paper className={classes.paper}>
            <div className={classes.headerTopPart}>
                <div className={classes.investigationHeaderInfo}>
                    <CheckCircleOutline color='primary' />
                    <Typography variant='h6' className={classes.investigationTitle}>
                        {
                            getPersonFullName(investigatedPatientByInvestigatedPatientId.personByPersonId)
                        },
                        {
                            epedemioligyNumber
                        }
                    </Typography>
                </div>
            </div>

            <div className={classes.informationBar}>
                <div className={classes.additionalInfo}>
                    <InfoItemWithIcon testId='age' name='גיל' value={
                        getPersonAge(new Date(investigatedPatientByInvestigatedPatientId.personByPersonId.birthDate))
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
                        investigatedPatientByInvestigatedPatientId.personByPersonId.gender
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='idType' name='סוג תעודה מזהה' value={
                        investigatedPatientByInvestigatedPatientId.personByPersonId.identificationType
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='idNumber' name='מספר תעודה מזהה' value={
                        investigatedPatientByInvestigatedPatientId.personByPersonId.identificationNumber
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon testId='isDeceased' name='האם נפטר' value={
                        investigatedPatientByInvestigatedPatientId.isDeceased ?
                            'כן' :
                            'לא'
                    }
                        icon={Help}
                    />
                </div>
                <div className={classes.managementControllers}>
                    <PrimaryButton
                        onClick={() => confirmExitUnfinishedInvestigation(epidemiologyNumber, cantReachInvestigated)}>
                        {leaveInvestigationMessage}
                    </PrimaryButton>
                    <CustomCheckbox
                        checkboxElements={[
                            {
                                value: cantReachInvestigated,
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
    investigatedPatientByInvestigatedPatientId: InvestigatedPatientByInvestigatedPatientId;
    epedemioligyNumber: number;
    coronaTestDate: Date;
}

export default InvestigatedPersonInfo
