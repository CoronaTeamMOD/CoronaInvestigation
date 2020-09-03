import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography, RadioGroup, Radio, ThemeProvider } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';

import Gender from 'models/enums/Gender';
import Toggle from 'commons/Toggle/Toggle';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import CustomCheckbox from 'commons/Checkbox/CustomCheckbox';
import RelevantOccupations from 'models/enums/RelevantOccupations'
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { PersonalInfoContextConsumer, personalInfoContext, PersonalInfoDataAndSet } from 'commons/Contexts/PersonalInfoStateContext';


import useStyles from './PersonalInfoTabStyles';
import IdentificationTypes from 'models/enums/IdentificationTypes';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';

const PersonalInfoTab: React.FC<Props> = (): JSX.Element => {
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
                                    id="phone" 
                                    placeholder="טלפון:" 
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
                            <Grid item xs={2}>
                                <FormControlLabel 
                                    className={classes.unsetFormControlMargin}
                                    control={
                                        <div className={classes.personalId}>
                                            <CircleSelect
                                                native
                                                value={""}
                                                placeholder={'שלום'}
                                                options={['1', '2', '3']}
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
                            </Grid>
                            <Grid item xs={4} className={classes.PersonalInfoFieldContainer}>
                                <CircleTextField 
                                    id="standard-required" 
                                    placeholder="כתוב סיבה..." 
                                    size='small' 
                                    className={classes.writeReason}
                                    onChange={(event) => {
                                        handleChangeField(ctxt, PersonalInfoDataContextFields.WRITE_REASON_WHY_NUMBER_IS_NOT_RELATED, event.target.value);
                                    }}
                                />
                            </Grid>
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
                                    id="phone2" 
                                    placeholder="טלפון:" 
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
                                    firstOption={"זכר"}
                                    secondOption={"נקבה"}
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
                                    value={false}
                                    firstOption={'ת.ז'}
                                    secondOption={'דרכון'} />
                            </Grid>
                            <Grid item xs={3}>
                                <FormControlLabel
                                    className={classes.unsetFormControlMargin}
                                    control={<CircleTextField
                                        id="personalId" 
                                        className={classes.personalId}
                                        size='small'
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
                                    id="age" 
                                    placeholder="גיל:" 
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
                                        id="motherName" 
                                        className={classes.personalId}
                                        size='small'
                                        placeholder='שם:'
                                    />}
                                    label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>שם האם:</span>}
                                    labelPlacement='start'
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <FormControlLabel
                                    className={classes.unsetFormControlMargin}
                                    control={<CircleTextField
                                        id="fatherName" 
                                        className={classes.personalId}
                                        size='small'
                                        placeholder='שם:'
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
                                    value={"Ten"}
                                    options={['1', '2', '3']}
                                    className={classes.selectWidth}
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
                                    value={0}
                                    options={['1', '2', '3']}
                                    className={classes.selectWidth}
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
                                    id="adress" 
                                    placeholder="מחכה לסנדי:" 
                                    size='small'
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
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="gender" name="gender1" >
                                        <FormLabel component="legend" className={classes.fontSize15}><b>תעסוקה</b></FormLabel>
                                        { 
                                            Object.values(RelevantOccupations).map((occupation) => {
                                                return <FormControlLabel 
                                                            value={occupation} 
                                                            control={<Radio color='primary'/>} 
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
                                    value={""}
                                    placeholder={'הזן שם מוסד'}
                                    options={['1', '2', '3']}
                                    className={classes.institutionName}
                                />
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        </PersonalInfoContextConsumer>
    );
};

interface Props {

}

export default PersonalInfoTab;