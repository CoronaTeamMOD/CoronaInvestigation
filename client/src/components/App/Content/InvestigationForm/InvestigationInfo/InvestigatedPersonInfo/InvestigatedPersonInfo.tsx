import React from 'react';
import { format } from 'date-fns';
import { Typography, Paper } from '@material-ui/core';
import { CheckCircleOutline, CakeOutlined, EventOutlined, Help } from '@material-ui/icons';

import { getPersonFullName } from 'Utils/displayUtils';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';
import { InvestigatedPatientByInvestigatedPatientId } from 'models/InvestigationInfo';

import useStyles from './InvestigatedPersonInfoStyles';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';

const leaveInvestigationMessage = 'צא מחקירה';

const InvestigatedPersonInfo = (props: Props) => {

    const classes = useStyles();
    const { investigatedPatientByInvestigatedPatientId, epedemioligyNumber } = props;

    const { confirmExitUnfinishedInvestigation, getPersonAge } = useInvestigatedPersonInfo();

    const Divider = () => <span className={classes.divider}> | </span>;

    //const dateOfTest = '34/01/2020';

    const [isChecked, setIsChecked] = React.useState<boolean>(false);

    const handleCheck = () => {
        if (isChecked) {
            // TODO: שינוי סטטוס החקירה ללא ניתן ליצור קשר
        } else {
            // TODO: שינוי סטטוס החקירה לטיפול
        }

        setIsChecked(!isChecked);
    };

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
                    <InfoItemWithIcon name='גיל' value={
                        getPersonAge(new Date(investigatedPatientByInvestigatedPatientId.personByPersonId.birthDate))
                    }
                        icon={CakeOutlined}
                    />
                    <Divider />
                    <InfoItemWithIcon name='תאריך הבדיקה' value={
                            format(new Date(props.coronaTestDate), 'dd/MM/yyyy')
                        }
                        icon={EventOutlined}
                    />
                    <Divider />
                    <InfoItemWithIcon name='מין' value={
                        investigatedPatientByInvestigatedPatientId.personByPersonId.gender
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon name='סוג תעודה מזהה' value={
                        investigatedPatientByInvestigatedPatientId.personByPersonId.identificationType
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon name='מספר תעודה מזהה' value={
                        investigatedPatientByInvestigatedPatientId.personByPersonId.identificationNumber
                    }
                        icon={Help}
                    />
                    <Divider />
                    <InfoItemWithIcon name='האם נפטר' value={
                        investigatedPatientByInvestigatedPatientId.isDeceased ?
                            'כן' :
                            'לא'
                    }
                        icon={Help}
                    />
                </div>
                <div className={classes.managementControllers}>
                    <PrimaryButton
                        onClick={confirmExitUnfinishedInvestigation}>
                        {leaveInvestigationMessage}
                    </PrimaryButton>
                    <CustomCheckbox
                        checkboxElements={[{ value: isChecked, labelText: 'אין מענה במספר זה', onChange: () => (handleCheck()) }]}
                    />
                </div>
            </div>
        </Paper>
    );
};

interface Props {
    investigatedPatientByInvestigatedPatientId: InvestigatedPatientByInvestigatedPatientId;
    epedemioligyNumber: number;
    coronaTestDate: Date
}

export default InvestigatedPersonInfo
