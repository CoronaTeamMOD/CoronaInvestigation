import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography, RadioGroup, Radio, ThemeProvider, Collapse } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';

import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CustomCheckbox from 'commons/CheckBox/CustomCheckbox';
import RelevantOccupations from 'models/enums/RelevantOccupations'
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { PersonalInfoContextConsumer, personalInfoContext, PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';


import useStyles from './PersonalInfoTabStyles';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const handleChangeField = (context: PersonalInfoDataAndSet ,fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        context.setPersonalInfoData({...context.personalInfoData, [fieldName]: fieldValue})
    }
  
    return (
        <PersonalInfoContextConsumer>
            {
                ctxt => (
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
                                    placeholder='טלפון:' 
                                    size='small'
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.PHONE_NUMBER, event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <CustomCheckbox
                                    checkboxElements={[{text: <span style={{ fontSize: '15px'}}>מספר הטלפון לא שייך לנבדק</span>,
                                    onChange:(event =>{
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.IS_INVESTIGATED_PERSON_NUMBER, !ctxt.personalInfoData.isInvestigatedPersonsNumber);
                                    })}]}
                                />
                            </Grid>
                            {
                                    <Collapse 
                                        in={!ctxt.personalInfoData.isInvestigatedPersonsNumber}>
                                        <div className={classes.PersonalInfoFieldContainer}>
                                            <FormControlLabel 
                                                className={classes.unsetFormControlMargin}
                                                control={
                                                    <div className={classes.personalId}>
                                                        <CircleSelect
                                                            native
                                                            value={ctxt.personalInfoData.selectReasonNumberIsNotRelated}
                                                            options={['אין טלפון', 'קטין', 'אחר...']}
                                                            className={classes.selectWidth}
                                                            onChange={(event) => {
                                                                handleChangeField(ctxt, PersonalInfoDataContextFields.SELECT_REASON_NUMBER_IS_NOT_RELATED, event.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                }
                                                label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>סיבה:</span>}
                                                labelPlacement='start'
                                            />
                                            <CircleTextField 
                                                id='reasonNumberIsNotRelated'
                                                placeholder='כתוב סיבה...'
                                                size='small' 
                                                className={classes.writeReason}
                                                onChange={(event) => {
                                                    handleChangeField(ctxt, PersonalInfoDataContextFields.WRITE_REASON_WHY_NUMBER_IS_NOT_RELATED, event.target.value);
                                                }}
                                            />
                                        </div>
                                    </Collapse> 
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
                                    placeholder='טלפון:'
                                    size='small'
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER, event.target.value);
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
                                    value={ctxt.personalInfoData.gender === Gender.FEMALE}
                                    firstOption={'זכר'}
                                    secondOption={'נקבה'}
                                    onChange={(event) => {
                                                    handleChangeField(
                                                        ctxt, 
                                                        PersonalInfoDataContextFields.GENDER, 
                                                        ctxt.personalInfoData.gender === Gender.MALE ? Gender.FEMALE :
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
                                    value={ctxt.personalInfoData.identificationType === IdentificationTypes.PASSPORT}
                                    firstOption={'ת.ז'}
                                    secondOption={'דרכון'} 
                                    onChange={(event) => {
                                        handleChangeField(
                                            ctxt, 
                                            PersonalInfoDataContextFields.IDENTIFICATION_TYPE, 
                                            ctxt.personalInfoData.identificationType === IdentificationTypes.ID ? IdentificationTypes.PASSPORT :
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
                                            handleChangeField(ctxt, PersonalInfoDataContextFields.IDENTIFICATION_NUMBER, event.target.value);
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
                                    placeholder='גיל:' 
                                    value={ctxt.personalInfoData.age}
                                    size='small'
                                    className={classes.ageText}
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.AGE, event.target.value);
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
                                        placeholder='שם:'
                                        onChange={(event) => {
                                            handleChangeField(ctxt, PersonalInfoDataContextFields.MOTHER_NAME, event.target.value);
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
                                        placeholder='שם:'
                                        onChange={(event) => {
                                            handleChangeField(ctxt, PersonalInfoDataContextFields.FATHER_NAME, event.target.value);
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
                                    native
                                    value={ctxt.personalInfoData.insuranceCompany}
                                    options={['הראל', 'כלל', 'הפניקס']}
                                    className={classes.selectWidth}
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.INSURANCE_COMPANY, event.target.value);
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
                                    native
                                    value={ctxt.personalInfoData.HMO}
                                    options={['אחר', 'כללית', 'מכבי']}
                                    className={classes.selectWidth}
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.HMO, event.target.value);
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
                                    placeholder='הכנס כתובת:'
                                    size='small'
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.ADDRESS, event.target.value);
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
                                                                            handleChangeField(ctxt, PersonalInfoDataContextFields.RELEVANT_OCCUPATION, event.target.value);
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
                                    native
                                    value={ctxt.personalInfoData.institutionName}
                                    placeholder={'הזן שם מוסד'}
                                    options={['צה"ל', 'מוסד', 'אחר']}
                                    className={classes.institutionName}
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.INSTITUTION_NAME, event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        </PersonalInfoContextConsumer>
    );
};

export default PersonalInfoTab;