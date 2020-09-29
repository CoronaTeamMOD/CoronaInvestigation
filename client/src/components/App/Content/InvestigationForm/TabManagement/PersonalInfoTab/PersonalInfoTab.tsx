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
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import Swal from 'sweetalert2';

import axios from 'Utils/axios';
import City from 'models/City';
import { Street } from 'models/Street';
import Occupations from 'models/enums/Occupations';
import { personalInfoDbData, personalInfoFormData } from 'models/Contexts/personalInfoContextData';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { initialPersonalInfo } from 'commons/Contexts/PersonalInfoStateContext';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';
import { setFormState } from 'redux/Form/formActionCreators';


const PHONE_LABEL = 'טלפון:';
const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף:';
const CONTACT_PHONE_LABEL = 'טלפון איש קשר:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const INSERT_OFFICE_NAME = 'הזן שם משרד/ רשות:';
const INSERT_TRANSPORTATION_COMPANY_NAME = 'הזן שם חברה:';
const INSERT_INDUSTRY_NAME = 'הזן שם תעשייה:';
const OCCUPATION_LABEL = 'תעסוקה:';
const CONTACT_INFO = 'תיאור איש קשר:';

const PersonalInfoTab: React.FC<Props> = ( { id, onSubmit } : Props ): JSX.Element => {
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
                is: 'מערכת החינוך',
                then: yup.string().nullable().required('שדה זה הינו שדה חובה'),
                else: yup.string()
            }
        ),
        [PersonalInfoDataContextFields.INSTITUTION_NAME]:  yup.string().when('relevantOccupation', (relevantOccupation:any, schema:any) => {
            return ['מערכת הבריאות', 'מערכת החינוך','כוחות הביטחון'].find(element => element === relevantOccupation)? 
            schema.nullable().required('שדה זה הינו שדה חובה') : 
            schema
        }),
        [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]:  yup.string().when('relevantOccupation', (relevantOccupation:any, schema:any) => {
            return ['מערכת הבריאות', 'מערכת החינוך','כוחות הביטחון'].find(element => element === relevantOccupation)? 
            schema :
            schema.nullable().required('שדה זה הינו שדה חובה')  
        }),
    })
    
    const classes = useStyles({});

    const [occupations, setOccupations] = React.useState<string[]>(['']);
    const [subOccupationName, setSubOccupationName] = React.useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = React.useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = React.useState<SubOccupationAndStreet[]>([]);
    const [cityName, setCityName] = React.useState<string>('');
    const [streetName, setStreetName] = React.useState<string>('');
    const [streets, setStreets] = React.useState<Street[]>([]);
    const [cityId, setCityId] = React.useState<string>('');
    const [occupation, setOccupation] = React.useState<string>('');
    const [personalInfoState,setPersonalInfoData] = React.useState<personalInfoFormData>(initialPersonalInfo);

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOccupation = event.target.value
        setOccupation(newOccupation)
        setSubOccupationName('')
        setValue(PersonalInfoDataContextFields.INSTITUTION_NAME,'')
        setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO,'')
        setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation)
        if(newOccupation === Occupations.EDUCATION_SYSTEM && personalInfoState.educationOccupationCity){
            getEducationSubOccupations(personalInfoState.educationOccupationCity)
        }
    }

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations, getStreetsByCity } = usePersonalInfoTab({
        setOccupations, setInsuranceCompanies,
        setPersonalInfoData, setSubOccupations, setSubOccupationName, setCityName, setStreetName, setStreets
    });

    const { control, setValue, getValues, handleSubmit, reset, errors, setError, clearErrors } = useForm({
        mode: 'all',
        defaultValues: personalInfoState,
        resolver: yupResolver(schema),
    });

    const convertToDBData = (data : any) : personalInfoDbData => {
        return {
            phoneNumber: data.phoneNumber !== '' ? data.phoneNumber : null,
            additionalPhoneNumber: data.additionalPhoneNumber !== '' ? data.additionalPhoneNumber : null,
            contactPhoneNumber: data.contactPhoneNumber !== '' ? data.contactPhoneNumber : null, 
            contactInfo: data.contactInfo !== '' ? data.contactInfo : null,
            insuranceCompany: data.insuranceCompany !== '' ? data.insuranceCompany : null,
            address: {
                city: data.city !== '' ? data.city : null,
                street: data.street !== '' ? data.street : null,
                floor: data.floor !== '' ? data.floor : null,
                houseNum: data.houseNum !== '' ? data.houseNum : null
            },
            relevantOccupation: data.relevantOccupation !== undefined ? data.relevantOccupation : null,
            educationOccupationCity: data.educationOccupationCity ? data.educationOccupationCity : null,
            institutionName: data.institutionName ? data.institutionName : null,
            otherOccupationExtraInfo: data.otherOccupationExtraInfo ? data.otherOccupationExtraInfo : null,
        }
    }

    React.useEffect(() => {
        fetchPersonalInfo();
    }, [])

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
        if (occupation === Occupations.DEFENSE_FORCES ||
            occupation === Occupations.HEALTH_SYSTEM) {
            getSubOccupations(occupation);
        } else {
            setSubOccupations([]);
        }
    }, [occupation]);

    React.useEffect(() => {
        cityId && getStreetsByCity(cityId);
    }, [cityId]);

    React.useEffect(() => {
        if (streets.length > 0 && streetName === '') {
            setValue('street',streets[0].id);
            setStreetName(streets[0].displayName);
        }
    }, [streets])

    const savePersonalData = (e: any, personalInfoData: any | personalInfoFormData) => {
        // handleSubmit(e)
        e.preventDefault();
        // const isFormValid = Object.keys(errors).length > 0 ? false : true
        axios.post('/personalDetails/updatePersonalDetails', 
        {
            id : investigatedPatientId, 
            personalInfoData, 
        }).catch(() => {
            Swal.fire({
                title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
                icon: 'error'
            });
        })
        // setFormState(0,isFormValid);
        onSubmit();
    }


    const subOccupationsPlaceHolderByOccupation = () => {
        if (occupation ===  Occupations.GOVERNMENT_OFFICE) return INSERT_OFFICE_NAME;
        if (occupation === Occupations.TRANSPORTATION) return INSERT_TRANSPORTATION_COMPANY_NAME;
        if (occupation === Occupations.INDUSTRY) return INSERT_INDUSTRY_NAME;
        return INSERT_INSTITUTION_NAME;
    }

    return (
        <div className={classes.tabInitialContainer}>
             <form id={`form-${id}`} onSubmit={(e) => savePersonalData(e, convertToDBData(getValues()))}>
            <Grid container spacing={3} className={classes.containerGrid} alignItems='center'>
                <Grid item xs={2} className={classes.personalInfoFieldContainer}>
                    <Typography className={classes.fontSize15}>
                        <b>
                            {PHONE_LABEL}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2} className={classes.personalInfoItem}>
                <Controller 
                        control={control} 
                        name={PersonalInfoDataContextFields.PHONE_NUMBER} 
                        test-id='personalDetailsPhone'
                        render={(props) => (
                            <TextField
                                id={PHONE_LABEL}
                                value={props.value}
                                onChange={(newValue) => (
                                    props.onChange(newValue.target.value)
                                )}
                                placeholder={PHONE_LABEL}
                                error={errors[PersonalInfoDataContextFields.PHONE_NUMBER]}
                                label={errors[PersonalInfoDataContextFields.PHONE_NUMBER]? errors[PersonalInfoDataContextFields.PHONE_NUMBER]?.message: 'טלפון' }
                                onBlur={props.onBlur}
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
                <Grid item xs={2} className={classes.personalInfoItem}>
                <Controller 
                        control={control} 
                        name={PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER} 
                        test-id='personalDetailsAdditionalPhone'
                        render={(props) => (
                            <TextField
                                id={ADDITIONAL_PHONE_LABEL}
                                value={props.value}
                                onChange={(newValue) => (
                                    props.onChange(newValue.target.value)
                                )}
                                placeholder={PHONE_LABEL}
                                error={errors[PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]}
                                label={errors[PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]? errors[PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER]?.message: 'טלפון' }
                                onBlur={props.onBlur}
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
                <Grid item xs={2} className={classes.personalInfoItem}>
                <Controller 
                        control={control} 
                        name={PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER} 
                        test-id='personalDetailsContactPhone'
                        render={(props) => (
                            <TextField
                                id={CONTACT_PHONE_LABEL}
                                value={props.value}
                                onChange={(newValue) => (
                                    props.onChange(newValue.target.value)
                                )}
                                placeholder={PHONE_LABEL}
                                error={errors[PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]}
                                label={errors[PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]? errors[PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER]?.message: 'טלפון' }
                                onBlur={props.onBlur}
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
                                className={classes.contactDescription}
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
                <Grid item xs={2} className={classes.personalInfoItem}>
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
                                        onBlur={props.onBlur}
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
                <Grid item xs={2} className={classes.personalInfoItem}>
                <Controller
                            name={PersonalInfoDataContextFields.CITY}
                            control={control}
                            render={(props) => (
                                <Autocomplete
                                    className={classes.spacedOutAddress}
                                    options={Array.from(cities, ([cityId, value]) => ({ cityId, value }))}
                                    getOptionLabel={(option) => {
                                        return option?.value?.displayName ? option.value.displayName : cityName 
                                    }}
                                    getOptionSelected={(option) => option.value.id === props.value}
                                    inputValue={cityName}
                                    value={props.value? props.value : ''}
                                    onInputChange={(event, newInputValue) => {
                                        setValue(PersonalInfoDataContextFields.STREET,'')
                                        setStreetName('')
                                        setCityName(newInputValue);
                                    }}
                                    onChange={(event, newValue) => {
                                        setCityId(newValue ? newValue.cityId : '');
                                        props.onChange(newValue ? newValue.cityId : '')
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            test-id='insertInstitutionName'
                                            //disabled={subOccupations.length === 0}
                                            label={errors[PersonalInfoDataContextFields.CITY]? errors[PersonalInfoDataContextFields.CITY]?.message: 'כתובת' }
                                            error={errors[PersonalInfoDataContextFields.CITY]}
                                            onBlur={props.onBlur}
                                            id={PersonalInfoDataContextFields.CITY}
                                            placeholder={INSERT_INSTITUTION_NAME}
                                        />}
                                />
                            )}
                        />
                </Grid>
                {
                    cityName &&
                    <Grid item xs={2} className={classes.personalInfoItem}>
                         <Controller
                                name={PersonalInfoDataContextFields.STREET}
                                control={control}
                                render={(props) => (
                                    <Autocomplete
                                        size='small'
                                        options={streets}
                                        getOptionLabel={(option) => {
                                            return option?.displayName ? option.displayName : streetName
                                        }}
                                        getOptionSelected={(option) => option.id === props.value}
                                        inputValue={streetName}
                                        value={props.value? props.value : ''}
                                        onInputChange={(event, newInputValue) => {
                                            setStreetName(newInputValue);
                                            if (newInputValue === '') {
                                                setValue(PersonalInfoDataContextFields.STREET,'')
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
                                                onBlur={props.onBlur}
                                                id={PersonalInfoDataContextFields.STREET}
                                                placeholder={'רחוב'}
                                            />
                                        }}
                                />
                                )}
                            />
                    </Grid>
                }
                <Grid item xs={1} className={classes.homeAddressItem}>
                    <Controller
                        name={PersonalInfoDataContextFields.FLOOR}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                test-id='personalDetailsFloor'
                                name={PersonalInfoDataContextFields.FLOOR}
                                value={props.value}
                                onBlur={props.onBlur}
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
                <Grid item xs={1} className={classes.homeAddressItem}>
                    <Controller
                        name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                        control={control}
                        render={(props) => (
                            <AlphanumericTextField
                                test-id='personalDetailsHouseNumber'
                                name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                                value={props.value}
                                onBlur={props.onBlur}
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
                <Grid item xs={2} className={classes.responsiveOccupation}>
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
                                                    onChange={handleChangeOccupation}
                                                    />}
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
                    occupation === Occupations.EDUCATION_SYSTEM &&
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
                                            setSubOccupationName('');
                                            props.onChange(newValue ? newValue.value.displayName : '')
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                error={errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]}
                                                label={errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]? 
                                                    errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]?.message:'עיר המצאות המוסד' }
                                                onBlur={props.onBlur}
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
                    <Collapse in={occupation !== Occupations.UNEMPLOYED}>
                        {
                            (subOccupations.length > 0 || occupation === Occupations.EDUCATION_SYSTEM) ?
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
                                                    onBlur={props.onBlur}
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
                                        onBlur={props.onBlur}
                                        onChange={(newValue: string) => (
                                            props.onChange(newValue)
                                        )}
                                        setError={setError}
                                        clearErrors={clearErrors}
                                        errors={errors}
                                        placeholder={subOccupationsPlaceHolderByOccupation()}                                    />
                                )}
                            />
                        }
                    </Collapse>
                </Grid>
            </Grid>
            </form>
        </div>
    );
};

interface Props {
    id: number,
    onSubmit: any
}

export default PersonalInfoTab;