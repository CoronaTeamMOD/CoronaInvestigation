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
import IdentificationTypes from 'models/enums/IdentificationTypes';
import relevantOccupations from 'models/enums/relevantOccupations';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';

import useStyles from './PersonalInfoTabStyles';
import axios from 'Utils/axios';

const PHONE_LABEL = 'טלפון:';
const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף:';
const GENDER_LABEL = 'מין:';
const IDENTIFICATION_LABEL = 'סוג תעודה מזהה:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסך:';
const INSTITUTION_OPTIONS = ['צה"ל', 'מוסד', 'אחר'];
const INSURANCE_OPTIONS = ['הראל', 'כלל', 'הפניקס'];
const IDENTIFICATION_NUMBER_LABEL = 'מספר תעודה מזהה';
const OCCUPATION_LABEL = 'תעסוקה:';

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const personalInfoStateContext = React.useContext(personalInfoContext);

    const handleChangeField = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({...personalInfoStateContext.personalInfoData, [fieldName]: fieldValue})
    }

    React.useEffect(() => {
        axios.get('/personalDetails').then((result) => console.log(result.data))
    }, [])

    return (
        <div className={classes.tabInitialContainer}>
            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {PHONE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={PHONE_LABEL}
                        placeholder={PHONE_LABEL}
                        value={123}
                        size='small'
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {ADDITIONAL_PHONE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={ADDITIONAL_PHONE_LABEL}
                        placeholder={PHONE_LABEL}
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
                            {GENDER_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                    <Toggle 
                        value={personalInfoStateContext.personalInfoData.gender === Gender.FEMALE}
                        firstOption={Gender.MALE}
                        secondOption={Gender.FEMALE}
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
                            {IDENTIFICATION_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1} className={classes.PersonalInfoFieldContainer}>
                    <Toggle 
                        value={personalInfoStateContext.personalInfoData.identificationType === IdentificationTypes.PASSPORT}
                        firstOption={IdentificationTypes.ID}
                        secondOption={IdentificationTypes.PASSPORT} 
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
                            id={IDENTIFICATION_NUMBER_LABEL}
                            className={classes.textFieldWithLabel}
                            size='small'
                            onChange={(event) => {
                                handleChangeField(PersonalInfoDataContextFields.IDENTIFICATION_NUMBER, event.target.value);
                            }}
                        />}
                        label={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>{IDENTIFICATION_NUMBER_LABEL}</span>}
                        labelPlacement='start'
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.PersonalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {INSURANCE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleSelect
                        value={personalInfoStateContext.personalInfoData.insuranceCompany}
                        options={INSURANCE_OPTIONS}
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
                            {ADDRESS_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <CircleTextField 
                        id={ADDRESS_LABEL}
                        placeholder={ADDRESS_LABEL}
                        className={classes.address}
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
                            {RELEVANT_OCCUPATION_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <FormControl component='fieldset'>
                        <RadioGroup aria-label={OCCUPATION_LABEL} name={OCCUPATION_LABEL} className={classes.relevantOccupationselect}>
                            <FormLabel component='legend' className={classes.fontSize15}><b>{OCCUPATION_LABEL}</b></FormLabel>
                            { 
                                Object.values(relevantOccupations).map((occupation) => {
                                    return <FormControlLabel 
                                                key={occupation}
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
                    <CircleTextField
                        value={personalInfoStateContext.personalInfoData.institutionName}
                        placeholder={INSERT_INSTITUTION_NAME}
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
