import React from 'react';
import Grid from '@material-ui/core/Grid';
import { FormControl } from '@material-ui/core';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Typography, RadioGroup, Radio, Collapse } from '@material-ui/core';

import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import RelevantOccupations from 'models/enums/RelevantOccupations'
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';

import useStyles from './PersonalInfoTabStyles';
import IdentificationTypes from 'models/enums/IdentificationTypes';

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const personalInfoStateContext = React.useContext(personalInfoContext);

    const handleChangeField = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({...personalInfoStateContext.personalInfoData, [fieldName]: fieldValue})
    }

    return (
        <div className={classes.tabInitialContainer}>
            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            טלפון:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id='phone'
                        label='טלפון:' 
                        size='small'
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <CustomCheckbox
                        checkboxElements={[{text: <span style={{ fontSize: '15px'}}>מספר הטלפון לא שייך לנבדק</span>,
                        onChange:(() =>{
                            handleChangeField(PersonalInfoDataContextFields.IS_INVESTIGATED_PERSON_NUMBER, !personalInfoStateContext.personalInfoData.isInvestigatedPersonsNumber);
                        })}]}
                    />
                </Grid>
                {
                    <Grid item xs={4}>
                        <Collapse 
                            in={!personalInfoStateContext.personalInfoData.isInvestigatedPersonsNumber}>
                            <div className={classes.PersonalInfoFieldContainer}>
                                <FormControlLabel 
                                    className={classes.unsetFormControlMargin}
                                    control={
                                        <div>
                                            <CircleSelect
                                                value={personalInfoStateContext.personalInfoData.selectReasonNumberIsNotRelated}
                                                options={['אין טלפון', 'קטין', 'אחר...']}
                                                className={classes.selectWidth}
                                                onChange={(event) => {
                                                    handleChangeField(PersonalInfoDataContextFields.SELECT_REASON_NUMBER_IS_NOT_RELATED, event.target.value);
                                                }}
                                            />
                                        </div>
                                    }
                                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>סיבה:</span>}
                                    labelPlacement='start'
                                />
                                <CircleTextField 
                                    id='reasonNumberIsNotRelated'
                                    label='כתוב סיבה...'
                                    size='small' 
                                    className={classes.writeReason}
                                    onChange={(event) => {
                                        handleChangeField(PersonalInfoDataContextFields.WRITE_REASON_WHY_NUMBER_IS_NOT_RELATED, event.target.value);
                                    }}
                                />
                            </div>
                        </Collapse> 
                    </Grid>
                }
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            טלפון נוסף:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id='phone2' 
                        label='טלפון:'
                        size='small'
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            מין:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                    <Toggle 
                        value={personalInfoStateContext.personalInfoData.gender === Gender.FEMALE}
                        firstOption={'זכר'}
                        secondOption={'נקבה'}
                        onChange={(event) => {
                                        handleChangeField(
                                            PersonalInfoDataContextFields.GENDER, 
                                            personalInfoStateContext.personalInfoData.gender === Gender.MALE ? Gender.FEMALE :
                                                Gender.MALE);
                                    }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            סוג תעודה מזהה:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                    <Toggle 
                        value={personalInfoStateContext.personalInfoData.identificationType === IdentificationTypes.PASSPORT}
                        firstOption={'ת.ז'}
                        secondOption={'דרכון'} 
                        onChange={(event) => {
                            handleChangeField(
                                PersonalInfoDataContextFields.IDENTIFICATION_TYPE, 
                                personalInfoStateContext.personalInfoData.identificationType === IdentificationTypes.ID ? IdentificationTypes.PASSPORT :
                                    IdentificationTypes.ID);
                        }}/>
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                        className={classes.unsetFormControlMargin}
                        control={<CircleTextField
                            id='personalId'
                            className={classes.personalId}
                            size='small'
                            onChange={(event) => {
                                handleChangeField(PersonalInfoDataContextFields.IDENTIFICATION_NUMBER, event.target.value);
                            }}
                        />}
                        label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>מספר תעודה מזהה:</span>}
                        labelPlacement='start'
                    />
                </Grid>
            </Grid>
            
            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            גיל:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id='age'
                        label='גיל:' 
                        value={personalInfoStateContext.personalInfoData.age}
                        size='small'
                        className={classes.ageText}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.AGE, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                        שמות הורי הקטין:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <FormControlLabel
                        className={classes.unsetFormControlMargin}
                        control={<CircleTextField
                            id='motherName'
                            className={classes.personalId}
                            size='small'
                            label='שם:'
                            onChange={(event) => {
                                handleChangeField(PersonalInfoDataContextFields.MOTHER_NAME, event.target.value);
                            }}
                        />}
                        label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>שם האם:</span>}
                        labelPlacement='start'
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormControlLabel
                        className={classes.unsetFormControlMargin}
                        control={<CircleTextField
                            id='fatherName'
                            className={classes.personalId}
                            size='small'
                            label='שם:'
                            onChange={(event) => {
                                handleChangeField(PersonalInfoDataContextFields.FATHER_NAME, event.target.value);
                            }}
                        />}
                        label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>שם האב:</span>}
                        labelPlacement='start'
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            גורם מבטח:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleSelect
                        value={personalInfoStateContext.personalInfoData.insuranceCompany}
                        options={['הראל', 'כלל', 'הפניקס']}
                        className={classes.selectWidth}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.INSURANCE_COMPANY, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            קופת חולים:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleSelect
                        value={personalInfoStateContext.personalInfoData.HMO}
                        options={['אחר', 'כללית', 'מכבי']}
                        className={classes.selectWidth}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.HMO, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            כתובת:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <CircleTextField 
                        id='adress'
                        label='הכנס כתובת:'
                        size='small'
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.ADDRESS, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='baseline'>          
                <Grid item xs={2} className={classes.personalInfoLastFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            האם עובד באחד מהבאים:
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <FormControl component='fieldset'>
                        <RadioGroup aria-label='gender' name='gender1' className={classes.relevantOccupationSelect}>
                            <FormLabel component='legend' className={classes.fontSize15}><b>תעסוקה</b></FormLabel>
                            { 
                                Object.values(RelevantOccupations).map((occupation) => {
                                    return <FormControlLabel 
                                                value={occupation} 
                                                control={<Radio 
                                                            color='primary'
                                                            onChange={(event) => {
                                                                handleChangeField(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, event.target.value);
                                                            }}/>} 
                                                label={<span style={{ fontSize: '15px' }}>{occupation}</span>} 
                                            />
                                })
                            }   
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <CircleSelect
                        value={personalInfoStateContext.personalInfoData.institutionName}
                        label={'הזן שם מוסד'}
                        options={['צה"ל', 'מוסד', 'אחר']}
                        className={classes.institutionName}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.INSTITUTION_NAME, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default PersonalInfoTab;