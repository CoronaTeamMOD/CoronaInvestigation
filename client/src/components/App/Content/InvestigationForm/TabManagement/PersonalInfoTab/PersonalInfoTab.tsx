import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import StoreStateType from 'redux/storeStateType';
import Collapse from '@material-ui/core/Collapse';
import FormLabel from '@material-ui/core/FormLabel';
import { RadioGroup, Radio } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import City from 'models/City';
import CircleSelect from 'commons/CircleSelect/CircleSelect';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import CircleTextField from 'commons/CircleTextField/CircleTextField';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';

const PHONE_LABEL = 'טלפון:';
const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף:';
const CONTACT_PHONE_LABEL = 'טלפון איש קשר:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const INSTITUTION_OPTIONS = ['אודם','ירושלים','צה"ל', 'מוסד', 'אחר','8600'];
const OCCUPATION_LABEL = 'תעסוקה:';

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [occupations, setOccupations] = React.useState<string[]>(['']);
    const [subOccupationName, setSubOccupationName] = React.useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = React.useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = React.useState<SubOccupationAndStreet[]>([]);

    const personalInfoStateContext = React.useContext(personalInfoContext);

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const handleChangeField = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({...personalInfoStateContext.personalInfoData, [fieldName]: fieldValue});
    }

    const handleChangeAddress = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({
            ...personalInfoStateContext.personalInfoData, 
            address: {
                ...personalInfoStateContext.personalInfoData.address, 
                [fieldName]: fieldValue
            }
        });
    }

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations } = usePersonalInfoTab({occupations, setOccupations, insuranceCompanies, setInsuranceCompanies,
        personalInfoStateContext, subOccupations, setSubOccupations});
    
    React.useEffect(()=> {
        fetchPersonalInfo();
    }, [])

    React.useEffect(() => {
        if(personalInfoStateContext.personalInfoData.relevantOccupation === 'כוחות הביטחון' || personalInfoStateContext.personalInfoData.relevantOccupation === 'מערכת הבריאות') {
            getSubOccupations(personalInfoStateContext.personalInfoData.relevantOccupation);
        } else if(personalInfoStateContext.personalInfoData.relevantOccupation === 'מערכת החינוך'){
            setSubOccupations([]);
        }
    }, [personalInfoStateContext.personalInfoData.relevantOccupation]);

    return (
        <div className={classes.tabInitialContainer}>
            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {PHONE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <CircleTextField 
                        id={PHONE_LABEL}
                        placeholder={PHONE_LABEL}
                        size='small'
                        value={personalInfoStateContext.personalInfoData.phoneNumber}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {ADDITIONAL_PHONE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <CircleTextField 
                        id={ADDITIONAL_PHONE_LABEL}
                        placeholder={PHONE_LABEL}
                        size='small'
                        value={personalInfoStateContext.personalInfoData.additionalPhoneNumber}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {CONTACT_PHONE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <CircleTextField 
                        id={CONTACT_PHONE_LABEL}
                        placeholder={PHONE_LABEL}
                        size='small'
                        value={personalInfoStateContext.personalInfoData.contactPhoneNumber}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {INSURANCE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <CircleSelect
                        options={insuranceCompanies}
                        className={classes.selectWidth}
                        value={personalInfoStateContext.personalInfoData.insuranceCompany}
                        onChange={(event) => {
                            handleChangeField(PersonalInfoDataContextFields.INSURANCE_COMPANY, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>          
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {ADDRESS_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Autocomplete
                        options={Array.from(cities, ([name, value]) => ({ name, value }))}
                        getOptionLabel={(option) => option.value.displayName}
                        inputValue={personalInfoStateContext.personalInfoData.address.city}
                        onInputChange={(event, newInputValue) => {
                            handleChangeAddress(PersonalInfoDataContextFields.CITY, newInputValue)}
                        }
                        onSelect={(event) => {
                            (event.nativeEvent.type === 'selectionchange') && console.log('triggered');
                        }}
                        renderInput={(params) =>                     
                        <CircleTextField
                            {...params}
                            id={PersonalInfoDataContextFields.CITY}
                            placeholder={'עיר'}
                            value={personalInfoStateContext.personalInfoData.address.city}
                        />}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Autocomplete
                        disabled
                        options={INSTITUTION_OPTIONS}
                        getOptionLabel={(option) => option}
                        inputValue={personalInfoStateContext.personalInfoData.address.street}
                        onInputChange={(event, newInputValue) => {
                            handleChangeAddress(PersonalInfoDataContextFields.STREET, newInputValue)}
                        }
                        renderInput={(params) =>                     
                        <CircleTextField
                            {...params}
                            id={PersonalInfoDataContextFields.STREET}
                            placeholder={'רחוב'}
                            value={personalInfoStateContext.personalInfoData.address.street}
                        />}
                    />
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={PersonalInfoDataContextFields.FLOOR}
                        placeholder={'קומה'}
                        value={personalInfoStateContext.personalInfoData.address.floor}
                        onChange={(event) => {
                            handleChangeAddress(PersonalInfoDataContextFields.FLOOR, event.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <CircleTextField 
                        id={PersonalInfoDataContextFields.HOUSE_NUMBER}
                        placeholder={'מספר בית'}
                        value={personalInfoStateContext.personalInfoData.address.houseNum}
                        onChange={(event) => {
                            handleChangeAddress(PersonalInfoDataContextFields.HOUSE_NUMBER, event.target.value);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} className={classes.containerGrid} alignItems='baseline'>          
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {RELEVANT_OCCUPATION_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <FormControl component='fieldset'>
                        <RadioGroup aria-label={OCCUPATION_LABEL} name={OCCUPATION_LABEL} value={personalInfoStateContext.personalInfoData.relevantOccupation} className={classes.relevantOccupationselect}>
                            <FormLabel component='legend' className={classes.fontSize15}><b>{OCCUPATION_LABEL}</b></FormLabel>
                            { 
                                occupations.map((occupation) => {
                                    return <FormControlLabel 
                                                value={occupation} 
                                                key={occupation}
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
                {
                    personalInfoStateContext.personalInfoData.relevantOccupation === 'מערכת החינוך' &&
                        <Grid item xs={2}>
                            <Autocomplete
                                options={INSTITUTION_OPTIONS}
                                getOptionLabel={(option) => option}
                                inputValue={personalInfoStateContext.personalInfoData.educationOccupationCity}
                                onInputChange={(event, newInputValue) => {
                                    handleChangeField(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, newInputValue)}
                                }
                                onSelect={(event) => {
                                    (event.nativeEvent.type === 'selectionchange') && 
                                    getEducationSubOccupations(personalInfoStateContext.personalInfoData.educationOccupationCity);
                                }}
                                renderInput={(params) =>                     
                                <CircleTextField
                                    {...params}
                                    id={PersonalInfoDataContextFields.CITY}
                                    placeholder={'עיר המצאות המוסד'}
                                    value={personalInfoStateContext.personalInfoData.educationOccupationCity}
                                />}
                            />
                        </Grid>
                }   
                <Grid item xs={3}>
                    <Collapse in={personalInfoStateContext.personalInfoData.relevantOccupation !== 'לא עובד'}>
                    {
                        (personalInfoStateContext.personalInfoData.relevantOccupation === 'כוחות הביטחון' ||
                        personalInfoStateContext.personalInfoData.relevantOccupation === 'מערכת הבריאות' ||
                        personalInfoStateContext.personalInfoData.relevantOccupation === 'מערכת החינוך') ?
                            <Autocomplete
                                options={subOccupations}
                                getOptionLabel={(option) => option.subOccupation + (option.street ? ('/' + option.street) : '')}
                                inputValue={subOccupationName}
                                onChange={(event, newValue) => {
                                    newValue && handleChangeField(PersonalInfoDataContextFields.INSTITUTION_NAME, newValue.id)}
                                }
                                onInputChange={(event, newInputValue) => {
                                    setSubOccupationName(newInputValue)}
                                }
                                renderInput={(params) =>                     
                                <CircleTextField
                                    {...params}
                                    disabled={subOccupations.length === 0}
                                    id={PersonalInfoDataContextFields.CITY}
                                    placeholder={INSERT_INSTITUTION_NAME}
                                />}
                            /> :
                            <CircleTextField
                                value={personalInfoStateContext.personalInfoData.institutionName}
                                placeholder={INSERT_INSTITUTION_NAME}
                                onChange={(event) => {
                                    handleChangeField(PersonalInfoDataContextFields.INSTITUTION_NAME, event.target.value);
                                }}
                            />
                    }
                    </Collapse>
                </Grid>
            </Grid>
        </div>
    );
};

export default PersonalInfoTab;

// <CircleSelect
// disabled={subOccupations.length === 0}
// value={personalInfoStateContext.personalInfoData.institutionName}
// options={subOccupations.map((subOccupation) => subOccupation.subOccupation + (subOccupation.street ? ('/' + subOccupation.street) : ''))}
// className={classes.institutionName + ' ' + classes.circleSelect}
// onChange={(event) => {
//     handleChangeField(PersonalInfoDataContextFields.INSTITUTION_NAME, event.target.value);
// }}
// />