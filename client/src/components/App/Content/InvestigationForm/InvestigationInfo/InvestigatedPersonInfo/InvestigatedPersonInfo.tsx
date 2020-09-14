import React from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { Typography, Paper, IconButton, Tooltip } from '@material-ui/core';
import { CakeOutlined, EventOutlined, Help, Phone } from '@material-ui/icons';
import Swal from 'sweetalert2';

import StoreStateType from 'redux/storeStateType';
import { getPersonFullName } from 'Utils/displayUtils';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { InvestigatedPatientByInvestigatedPatientId } from 'models/InvestigatedPatientByInvestigatedPatientId';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';
import User from 'models/User';
import axios from 'Utils/axios';

const leaveInvestigationMessage = 'צא מחקירה';

const InvestigatedPersonInfo = (props: Props) => {

    const classes = useStyles();
    const { investigatedPatientByInvestigatedPatientId, epedemioligyNumber, onExitInvestigation } = props;

    const Divider = () => <span className={classes.divider}> | </span>;

    const epidemiologyNumber = useSelector<StoreStateType, number>(state => state.investigation.epidemiologyNumber);
    const cantReachInvestigated = useSelector<StoreStateType, boolean>(state => state.investigation.cantReachInvestigated);
    const user = useSelector<StoreStateType, User>(state => state.user);

    const { confirmExitUnfinishedInvestigation, handleCantReachInvestigatedCheck, getPersonAge } = useInvestigatedPersonInfo({onExitInvestigation});

    const callUser = () => {
        axios.get(`/call/${investigatedPatientByInvestigatedPatientId.personByPersonId.phoneNumber}/${user.id.split('@')[0]}`)
        .then((result : any) => { })
        .catch(e => {
            Swal.fire({
                title: 'הייתה בעיה בביצוע שיחת הטלפון, אנא נסה שוב בעוד מספר דקות',
                icon: 'error'
            });
        });
    }

    return (
        <Paper className={classes.paper}>
            <div className={classes.headerTopPart}>
                <div className={classes.investigationHeaderInfo}>
                    <Typography variant='h6' className={classes.investigationTitle}>
                        {
                            getPersonFullName(investigatedPatientByInvestigatedPatientId.personByPersonId)
                        },
                        {
                            epedemioligyNumber
                        }
                    </Typography>
                    <Tooltip title='חייג'>
                        <IconButton onClick={callUser} color='primary'>
                            <Phone/>
                        </IconButton>
                    </Tooltip>
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
    onExitInvestigation: () => Promise<void>;
}

export default InvestigatedPersonInfo
