import React from 'react';
import {Typography, Paper} from '@material-ui/core';
import {CheckCircleOutline, CakeOutlined, EventOutlined, Help} from '@material-ui/icons';

import PrimaryButton from 'commons/Buttons/PrimaryButton/PrimaryButton';

import useStyles from './InvestigatedPersonInfoStyles';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import InfoItemWithIcon from './InfoItemWithIcon/InfoItemWithIcon';
import useInvestigatedPersonInfo from './useInvestigatedPersonInfo';

const InvestigatedPersonInfo = () => {
    const leaveInvestigationMessage = 'צא מחקירה';

    const classes = useStyles();
    const { confirmExitUnfinishedInvestigation } = useInvestigatedPersonInfo();
    const Divider = () => <span className={classes.divider}> | </span>;

    const name = 'לוי כהן';
    const investigationId = '2345642132';

    const age = '20';
    const dateOfTest = '30/01/2020';
    const gender = 'נקבה';
    const idType = 'תעודת זהות';
    const idNumber = '123456789';
    const isDeceased = 'לא';

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
                    <CheckCircleOutline color='primary'/>
                    <Typography variant='h6' className={classes.investigationTitle}>
                        {name}, {investigationId}
                    </Typography>
                </div>
                <PrimaryButton
                    onClick={confirmExitUnfinishedInvestigation}>
                    {leaveInvestigationMessage}
                </PrimaryButton>
            </div>

            <div className={classes.informationBar}>
                <div className={classes.additionalInfo}>
                    <InfoItemWithIcon name='גיל' value={age} icon={CakeOutlined}/>
                    <Divider/>
                    <InfoItemWithIcon name='תאריך הבדיקה' value={dateOfTest} icon={EventOutlined}/>
                    <Divider/>
                    <InfoItemWithIcon name='מין' value={gender} icon={Help}/>
                    <Divider/>
                    <InfoItemWithIcon name='סוג תעודה מזהה' value={idType} icon={Help}/>
                    <Divider/>
                    <InfoItemWithIcon name='מספר תעודה מזהה' value={idNumber} icon={Help}/>
                    <Divider/>
                    <InfoItemWithIcon name='האם נפטר' value={isDeceased} icon={Help}/>
                </div>
                <div className={classes.managementControllers}>
                    <CustomCheckbox
                        checkboxElements={[{value: isChecked, text: 'אין מענה במספר זה', onChange: () => (handleCheck())}]}
                    />
                </div>
            </div>
        </Paper>
    );
};

export default InvestigatedPersonInfo;
