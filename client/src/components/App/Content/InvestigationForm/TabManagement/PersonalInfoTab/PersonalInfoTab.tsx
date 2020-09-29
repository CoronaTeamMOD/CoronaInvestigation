import React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import StoreStateType from 'redux/storeStateType';
import Collapse from '@material-ui/core/Collapse';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { RadioGroup, Radio, TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

import City from 'models/City';
import { Street } from 'models/Street';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import { initialPersonalInfo } from 'commons/Contexts/PersonalInfoStateContext';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import SubOccupationsSelectOccupations from 'models/enums/SubOccupationsSelectOccupations';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';
import { personalInfoDbData, personalInfoFormData } from 'models/Contexts/personalInfoContextData';

const PHONE_LABEL = 'טלפון:';
const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף:';
const CONTACT_PHONE_LABEL = 'טלפון איש קשר:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const OCCUPATION_LABEL = 'תעסוקה:';
const CONTACT_INFO = 'תיאור איש קשר:';

const schema = yup.object().shape({
    [PersonalInfoDataContextFields.PHONE_NUMBER]: yup.string().nullable().required('שדה זה הינו שדה חובה').matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/,'שגיאה: מספר שהוזן אינו תקין'),
    [PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]: yup.string().nullable().required('שדה זה הינו שדה חובה').matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/,'שגיאה: מספר שהוזן אינו תקין'),
    [PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]: yup.string().nullable().required('שדה זה הינו שדה חובה').matches(/^(0(?:[23489]|5[0-689]|7[2346789])(?![01])(\d{7}))$/,'שגיאה: מספר שהוזן אינו תקין'),
    [PersonalInfoDataContextFields.INSURANCE_COMPANY]: yup.string().nullable().required('שדה זה הינו שדה חובה'),
    [PersonalInfoDataContextFields.CITY]: yup.string().nullable().required('שדה זה הינו שדה חובה'),
    [PersonalInfoDataContextFields.STREET]:  yup.string().when(
        PersonalInfoDataContextFields.CITY, {
            is: null,
            else: yup.string().nullable().required('שדה זה הינו שדה חובה'),
            then: yup.string()
        }
    ),
    [PersonalInfoDataContextFields.FLOOR]: yup.string().nullable().required('שדה זה הינו שדה חובה').matches(/^[0-9]*$/,'שגיאה: מספר שהוזן אינו תקין'),
    [PersonalInfoDataContextFields.HOUSE_NUMBER]: yup.string().nullable().required('שדה זה הינו שדה חובה').matches(/^[0-9]*$/,'שגיאה: מספר שהוזן אינו תקין'),
    [PersonalInfoDataContextFields.RELEVANT_OCCUPATION]: yup.string().nullable().required('שדה זה הינו שדה חובה'),
    [PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]:  yup.string().when(
        PersonalInfoDataContextFields.RELEVANT_OCCUPATION, {
            is: "מערכת החינוך",
            then: yup.string().nullable().required('שדה זה הינו שדה חובה'),
            else: yup.string()
        }
    ),
    [PersonalInfoDataContextFields.INSTITUTION_NAME]:  yup.string().when("relevantOccupation", (relevantOccupation:any, schema:any) => {
        return ["מערכת הבריאות", "מערכת החינוך","כוחות הביטחון"].find(element => element === relevantOccupation)? 
        schema.nullable().required('שדה זה הינו שדה חובה') : 
        schema
    }),
    [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]:  yup.string().when("relevantOccupation", (relevantOccupation:any, schema:any) => {
        return ["מערכת הבריאות", "מערכת החינוך","כוחות הביטחון"].find(element => element === relevantOccupation)? 
        schema :
        schema.nullable().required('שדה זה הינו שדה חובה')  
    }),
})

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [occupations, setOccupations] = React.useState<string[]>(['']);
    const [subOccupationName, setSubOccupationName] = React.useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = React.useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = React.useState<SubOccupationAndStreet[]>([]);
    const [cityName, setCityName] = React.useState<string>('');
    const [cityId, setCityId] = React.useState<string>('');
    const [streetName, setStreetName] = React.useState<string>('');
    const [streets, setStreets] = React.useState<Street[]>([]);
    const [occupation, setOccupation] = React.useState<string>('');
    const [personalInfoState,setPersonalInfoData] = React.useState<personalInfoFormData>(initialPersonalInfo);

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations, getStreetsByCity } = usePersonalInfoTab({
        setOccupations, setInsuranceCompanies,
        setPersonalInfoData, setSubOccupations, setSubOccupationName, setCityName, setStreetName, setStreets
    });
    const { control, setValue, getValues, handleSubmit, reset, errors, setError, clearErrors } = useForm({
        defaultValues: personalInfoState,
        resolver: yupResolver(schema)
    });

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const convertToDBData = (data : any) : personalInfoDbData => {
        return {
            phoneNumber: data.phoneNumber,
            additionalPhoneNumber: data.additionalPhoneNumber,
            contactPhoneNumber: data.contactPhoneNumber, 
            contactInfo: data.contactInfo !== '' ? data.relevantOccupation : null,
            insuranceCompany: data.insuranceCompany,
            address: {
                city: data.city,
                street: data.street,
                floor: data.floor,
                houseNum: data.houseNum
            },
            relevantOccupation: data.relevantOccupation !== undefined ? data.relevantOccupation : null,
            educationOccupationCity: data.educationOccupationCity ? data.educationOccupationCity : null,
            institutionName: data.institutionName ? data.institutionName : null,
            otherOccupationExtraInfo: data.otherOccupationExtraInfo ? data.otherOccupationExtraInfo : null,
        }
    }

    React.useEffect(()=>{
        fetchPersonalInfo()
    },[])

    React.useEffect(()=>{
        // console.log(personalInfoState)
        if(personalInfoState.city) {
            setCityId(personalInfoState.city)
        }
        setOccupation(personalInfoState.relevantOccupation)
        if(personalInfoState.educationOccupationCity){
            getEducationSubOccupations(personalInfoState.educationOccupationCity)
        }
        reset(personalInfoState)
    },[personalInfoState])
    
    React.useEffect(() => {
        if (occupation === SubOccupationsSelectOccupations.DEFENSE_FORCES ||
            occupation === SubOccupationsSelectOccupations.HEALTH_SYSTEM) {
            getSubOccupations(occupation);
        } else if (occupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM) {
            setSubOccupations([]);
        }
    }, [occupation]);

    React.useEffect(() => {
        cityId && getStreetsByCity(cityId);
    }, [cityId]);

    React.useEffect(() => {
        if (streets.length > 0 && streetName === '') {
            setValue("street",streets[0].id);
            setStreetName(streets[0].displayName);
        }
    }, [streets])


    return (
        <form onSubmit={handleSubmit((data) => console.log(convertToDBData(data)))}>
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
                    <Controller 
                        control={control} 
                        name={PersonalInfoDataContextFields.PHONE_NUMBER} 
                        test-id='personalDetailsPhone'
                        render={(props) => (
                            <TextField
                                value={props.value ? props.value : ""}
                                onChange={(newValue) => (
                                    props.onChange(newValue.target.value)
                                )}
                                placeholder={PHONE_LABEL}
                                error={errors[PersonalInfoDataContextFields.PHONE_NUMBER]}
                                label={errors[PersonalInfoDataContextFields.PHONE_NUMBER]? errors[PersonalInfoDataContextFields.PHONE_NUMBER]?.message: "טלפון" }
                                onBlur={() => {
                                    clearErrors(PersonalInfoDataContextFields.PHONE_NUMBER);
                                }}
                            />
                        )}
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
                    <Controller 
                        control={control} 
                        name={PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER} 
                        test-id='personalDetailsAdditionalPhone'
                        render={(props) => (
                            <TextField
                                value={props.value}
                                onChange={(newValue) => (
                                    props.onChange(newValue.target.value)
                                )}
                                placeholder={PHONE_LABEL}
                                error={errors[PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]}
                                label={errors[PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]? errors[PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]?.message: "טלפון" }
                                onBlur={() => {
                                    clearErrors(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER);
                                }}
                            />
                        )}
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
                    <Controller 
                        control={control} 
                        name={PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER} 
                        test-id='personalDetailsAdditionalPhone'
                        render={(props) => (
                            <TextField
                                value={props.value}
                                onChange={(newValue) => (
                                    props.onChange(newValue.target.value)
                                )}
                                placeholder={PHONE_LABEL}
                                error={errors[PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]}
                                label={errors[PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]? errors[PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]?.message: "טלפון" }
                                onBlur={() => {
                                    clearErrors(PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER);
                                }}
                            />
                        )}
                    />
                    </Grid>
                    <Controller
                        name={PersonalInfoDataContextFields.CONTACT_INFO}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                name={PersonalInfoDataContextFields.CONTACT_INFO}
                                value={props.value}
                                onChange={(newValue: string) => (
                                    props.onChange(newValue)
                                )}
                                setError={setError}
                                clearErrors={clearErrors}
                                errors={errors}
                                placeholder={CONTACT_INFO}
                                onBlur={props.onBlur}
                            />
                        )}
                    />
                </Grid>

                <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                    <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                        <Typography className={classes.fontSize15}>
                            <b>
                                {INSURANCE_LABEL}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <FormControl 
                        fullWidth>
                            <InputLabel error={errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]}>
                                {errors[PersonalInfoDataContextFields.INSURANCE_COMPANY] ? 
                                errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message : 
                                'גורם מבטח'}
                            </InputLabel>
                            <Controller
                                name={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                control={control}
                                render={(props) => (
                                    <Select
                                        test-id={'personalDetailsInsurer'}
                                        value={props.value}
                                        onChange={(event) => (
                                            props.onChange(event.target.value)
                                        )}
                                        label={errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]? errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message: 'גורם מבטח' }
                                        error={errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]}
                                        onBlur={() => {
                                            clearErrors(PersonalInfoDataContextFields.INSURANCE_COMPANY);
                                        }}
                                    >
                                        {
                                            insuranceCompanies.map((insuranceCompany) => (
                                                <MenuItem key={insuranceCompany} value={insuranceCompany}>{insuranceCompany}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                )}
                            />
                        </FormControl>
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
                        <Controller
                            name={PersonalInfoDataContextFields.CITY}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    options={Array.from(cities, ([cityId, value]) => ({ cityId, value }))}
                                    getOptionLabel={(option) => {
                                        return option?.value?.displayName ? option.value.displayName : cityName 
                                    }}
                                    getOptionSelected={(option) => option.value.id === props.value}
                                    inputValue={cityName}
                                    value={props.value? props.value : ""}
                                    onInputChange={(event, newInputValue) => {
                                        setValue(PersonalInfoDataContextFields.STREET,"")
                                        setStreetName("")
                                        setCityName(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        setCityId(newValue ? newValue.cityId : '');
                                        props.onChange(newValue ? newValue.cityId : '')
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            label={errors[PersonalInfoDataContextFields.CITY]? errors[PersonalInfoDataContextFields.CITY]?.message: 'כתובת' }
                                            error={errors[PersonalInfoDataContextFields.CITY]}
                                            onBlur={() => {
                                                clearErrors(PersonalInfoDataContextFields.CITY);
                                            }}
                                            test-id='personalDetailsCity'
                                            id={PersonalInfoDataContextFields.CITY}
                                            placeholder={'עיר'}
                                        />}
                                />
                            )}
                        />
                    </Grid>
                    {
                        cityName &&
                        <Grid item xs={2}>
                            <Controller
                                name={PersonalInfoDataContextFields.STREET}
                                control={control}
                                render={(props) => (
                                    <Autocomplete
                                        options={streets}
                                        getOptionLabel={(option) => {
                                            return option?.displayName ? option.displayName : streetName
                                        }}
                                        getOptionSelected={(option) => option.id === props.value}
                                        inputValue={streetName}
                                        value={props.value? props.value : ""}
                                        onInputChange={(event, newInputValue) => {
                                            setStreetName(newInputValue);
                                            if (newInputValue === '') {
                                                setValue(PersonalInfoDataContextFields.STREET,"")
                                            }
                                        }}
                                        onChange={(event, newValue) => {
                                            props.onChange(newValue?.id)
                                        }}
                                        renderInput={(params) => {
                                            return <TextField
                                                test-id='personalDetailsStreet'
                                                {...params}
                                                error={errors[PersonalInfoDataContextFields.STREET]}
                                                label={errors[PersonalInfoDataContextFields.STREET]? errors[PersonalInfoDataContextFields.STREET]?.message: 'רחוב' }
                                                onBlur={() => {
                                                    clearErrors(PersonalInfoDataContextFields.STREET);
                                                }}
                                                id={PersonalInfoDataContextFields.STREET}
                                                placeholder={'רחוב'}
                                            />
                                        }}
                                />
                                )}
                            />
                        </Grid>
                    }
                    <Grid item xs={1}>
                        <Controller
                            name={PersonalInfoDataContextFields.FLOOR}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    test-id='personalDetailsFloor'
                                    name={PersonalInfoDataContextFields.FLOOR}
                                    value={props.value}
                                    onChange={(newValue: string) => (
                                        props.onChange(newValue)
                                    )}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    errors={errors}
                                    placeholder={'קומה'}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={1}>
                        <Controller
                            name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                            control={control}
                            render={(props) => (
                                <AlphanumericTextField
                                    test-id='personalDetailsHouseNumber'
                                    name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                                    value={props.value}
                                    onChange={(newValue: string) => (
                                        props.onChange(newValue)
                                    )}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    errors={errors}
                                    placeholder={'מספר בית'}
                                />
                            )}
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
                        <Controller
                            name={PersonalInfoDataContextFields.RELEVANT_OCCUPATION}
                            control={control}
                            render={(props) => (
                                <RadioGroup 
                                    aria-label={OCCUPATION_LABEL} 
                                    name={OCCUPATION_LABEL} 
                                    value={props.value}
                                    className={classes.relevantOccupationselect}>
                                    <FormLabel component='legend' className={classes.fontSize15}><b>{OCCUPATION_LABEL}</b></FormLabel>
                                    {
                                        occupations.map((occupation) => {
                                            return <FormControlLabel
                                                value={occupation}
                                                key={occupation}
                                                control={<Radio
                                                    color='primary'
                                                    onChange={(event) => {
                                                        const newOccupation = event.target.value
                                                        setOccupation(newOccupation)
                                                        setSubOccupationName('')
                                                        setValue(PersonalInfoDataContextFields.INSTITUTION_NAME,'')
                                                        setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO,'')
                                                        setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation)
                                                        if(newOccupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM && personalInfoState.educationOccupationCity){
                                                            getEducationSubOccupations(personalInfoState.educationOccupationCity)
                                                        }
                                                    }} />}
                                                label={<span style={{ fontSize: '15px' }}>{occupation}</span>}
                                            />
                                        })
                                    }
                                </RadioGroup>
                            )}
                        />
                        </FormControl>
                    </Grid>
                    {
                        occupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM &&
                        <Grid item xs={2}>
                            <Controller
                                name={PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY}
                                control={control}
                                render={(props) => (
                                    <Autocomplete
                                        options={Array.from(cities, ([name, value]) => ({ name, value }))}
                                        getOptionLabel={(option) => option.value?.displayName ? option.value?.displayName : props.value}
                                        getOptionSelected={(option) =>{ 
                                            return option.value?.displayName === props.value
                                        }}
                                        value={props.value}
                                        onChange={(event, newValue) => {
                                            newValue && getEducationSubOccupations(newValue.value.displayName);
                                            setSubOccupationName("");
                                            props.onChange(newValue ? newValue.value.displayName : '')
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                error={errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]}
                                                label={errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]? 
                                                    errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]?.message:'עיר המצאות המוסד' }
                                                onBlur={() => {
                                                    clearErrors(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY);
                                                }}
                                                test-id='institutionCity'
                                                id={PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY}
                                                placeholder={'עיר המצאות המוסד'}
                                            />}
                                    />
                                )}
                            />
                        </Grid>
                    }
                    <Grid item xs={3}>
                        <Collapse in={getValues(PersonalInfoDataContextFields.RELEVANT_OCCUPATION) !== 'לא עובד'}>
                            {
                                (occupation === SubOccupationsSelectOccupations.DEFENSE_FORCES ||
                                    occupation === SubOccupationsSelectOccupations.HEALTH_SYSTEM ||
                                    occupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM) ?
                                    <Controller
                                    name={PersonalInfoDataContextFields.INSTITUTION_NAME}
                                    control={control}
                                    render={(props) => (
                                        <Autocomplete
                                            options={subOccupations}
                                            getOptionLabel={(option) => option.subOccupation + (option.street ? ('/' + option.street) : '')}
                                            inputValue={subOccupationName}
                                            onInputChange={(event, newValue) => {
                                                if(event){
                                                    setSubOccupationName(newValue)
                                                }
                                            }}
                                            value={props.value?.id}
                                            onChange={(event, newValue) => {
                                                props.onChange(newValue ? newValue.id : '')
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    error={errors[PersonalInfoDataContextFields.INSTITUTION_NAME]}
                                                    label={errors[PersonalInfoDataContextFields.INSTITUTION_NAME]? 
                                                        errors[PersonalInfoDataContextFields.INSTITUTION_NAME]?.message: 'שם מוסד' }
                                                    onBlur={() => {
                                                        clearErrors(PersonalInfoDataContextFields.INSTITUTION_NAME);
                                                    }}
                                                    test-id='insertInstitutionName'
                                                    disabled={subOccupations.length === 0}
                                                    id={PersonalInfoDataContextFields.INSTITUTION_NAME}
                                                    placeholder={INSERT_INSTITUTION_NAME}
                                                />}
                                        />
                                    )}
                                />
                                    :
                                    <Controller
                                        name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                        control={control}
                                        render={(props) => (
                                            <AlphanumericTextField
                                                test-id='institutionName'
                                                name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                                value={props.value}
                                                onChange={(newValue: string) => (
                                                    props.onChange(newValue)
                                                )}
                                                setError={setError}
                                                clearErrors={clearErrors}
                                                errors={errors}
                                                placeholder={INSERT_INSTITUTION_NAME}
                                            />
                                        )}
                                    />
                            }
                        </Collapse>
                    </Grid>
                </Grid>
            </div>
            <input type="submit" />
        </form>
    );
};

export default PersonalInfoTab;
