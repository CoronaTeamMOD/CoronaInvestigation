import React from 'react';
import Grid from '@material-ui/core/Grid';
import Collapse from '@material-ui/core/Collapse';
import FormLabel from '@material-ui/core/FormLabel';
import { RadioGroup, Radio } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';

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

const PHONE_LABEL = 'טלפון:';
const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסך:';
const INSTITUTION_OPTIONS = ['צה"ל', 'מוסד', 'אחר'];
const INSURANCE_OPTIONS = ['הראל', 'כלל', 'מכבי'];
const OCCUPATION_LABEL = 'תעסוקה:';

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const personalInfoStateContext = React.useContext(personalInfoContext);

    const handleChangeField = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({...personalInfoStateContext.personalInfoData, [fieldName]: fieldValue});
    }

    const handleChangeAddress = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({...personalInfoStateContext.personalInfoData, address: {...personalInfoStateContext.personalInfoData.address, [fieldName]: fieldValue}});
    }

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
                <Grid item xs={1}>
                    <CircleTextField 
                        id={ADDRESS_LABEL}
                        placeholder={'עיר'}
                        onChange={(event) => {
                            handleChangeAddress(PersonalInfoDataContextFields.CITY, event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={ADDRESS_LABEL}
                        placeholder={'רחוב'}
                        onChange={(event) => {
                            handleChangeAddress(PersonalInfoDataContextFields.STREET, event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={ADDRESS_LABEL}
                        placeholder={'קומה'}
                        onChange={(event) => {
                            handleChangeAddress(PersonalInfoDataContextFields.FLOOR, event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={ADDRESS_LABEL}
                        placeholder={'מספר בית'}
                        onChange={(event) => {
                            handleChangeAddress(PersonalInfoDataContextFields.HOUSE_NUMBER, event.target.value);
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
                        label={INSERT_INSTITUTION_NAME}
                        options={INSTITUTION_OPTIONS}
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