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
import { useForm } from "react-hook-form";

import City from 'models/City';
import { Street } from 'models/Street';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import SubOccupationsSelectOccupations from 'models/enums/SubOccupationsSelectOccupations';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';

const PHONE_LABEL = 'טלפון:';
const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף:';
const CONTACT_PHONE_LABEL = 'טלפון איש קשר:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const OCCUPATION_LABEL = 'תעסוקה:';
const CONTACT_INFO = 'תיאור איש קשר:';

const PersonalInfoTab: React.FC = (): JSX.Element => {
    const classes = useStyles({});

    const [occupations, setOccupations] = React.useState<string[]>(['']);
    const [subOccupationName, setSubOccupationName] = React.useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = React.useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = React.useState<SubOccupationAndStreet[]>([]);
    const [cityName, setCityName] = React.useState<string>('');
    const [streetName, setStreetName] = React.useState<string>('');
    const [streets, setStreets] = React.useState<Street[]>([]);

    const personalInfoStateContext = React.useContext(personalInfoContext);
    const { city, street } = personalInfoStateContext.personalInfoData.address;

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const handleChangeField = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({ ...personalInfoStateContext.personalInfoData, [fieldName]: fieldValue });
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

    const handleChangeAddressOnCityChange = (city: string) => {
        personalInfoStateContext.setPersonalInfoData({
            ...personalInfoStateContext.personalInfoData,
            address: {
                ...personalInfoStateContext.personalInfoData.address,
                city,
                street: ''
            }
        })
    };

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations, getStreetsByCity } = usePersonalInfoTab({
        setOccupations, setInsuranceCompanies,
        personalInfoStateContext, setSubOccupations, setSubOccupationName, setCityName, setStreetName, setStreets
    });

    React.useEffect(() => {
        fetchPersonalInfo();
    }, [])

    React.useEffect(() => {
        if (personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.DEFENSE_FORCES ||
            personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.HEALTH_SYSTEM) {
            getSubOccupations(personalInfoStateContext.personalInfoData.relevantOccupation);
        } else if (personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM) {
            setSubOccupations([]);
        }
    }, [personalInfoStateContext.personalInfoData.relevantOccupation]);

    React.useEffect(() => {
        city && getStreetsByCity(city);
    }, [city]);

    React.useEffect(() => {
        if (streets.length > 0 && street === '') {
            handleChangeAddress(PersonalInfoDataContextFields.STREET, streets[0].id);
            setStreetName(streets[0].displayName);
        }
    }, [streets])

    const { setError, clearErrors, errors } = useForm();

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
                <Grid item xs={2} className={classes.personalInfoItem}>
                    <PhoneNumberTextField
                        id={PHONE_LABEL}
                        required
                        placeholder={PHONE_LABEL}
                        value={personalInfoStateContext.personalInfoData.phoneNumber.number}
                        isValid={personalInfoStateContext.personalInfoData.phoneNumber.isValid}
                        setIsValid={(isValid) => {
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER,
                                {
                                    ...personalInfoStateContext.personalInfoData.phoneNumber,
                                    isValid: isValid
                                }
                            )
                        }}
                        onChange={(event) =>
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER,
                                {
                                    ...personalInfoStateContext.personalInfoData.phoneNumber,
                                    number: event.target.value,
                                }
                            )
                        }
                        testId='personalDetailsPhone'
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
                    <PhoneNumberTextField
                        id={ADDITIONAL_PHONE_LABEL}
                        placeholder={PHONE_LABEL}
                        value={personalInfoStateContext.personalInfoData.additionalPhoneNumber.number}
                        isValid={personalInfoStateContext.personalInfoData.additionalPhoneNumber.isValid}
                        setIsValid={(isValid) => {
                            handleChangeField(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER,
                                {
                                    ...personalInfoStateContext.personalInfoData.additionalPhoneNumber,
                                    isValid: isValid
                                }
                            )
                        }}
                        onChange={(event) =>
                            handleChangeField(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER,
                                {
                                    ...personalInfoStateContext.personalInfoData.additionalPhoneNumber,
                                    number: event.target.value,
                                }
                            )
                        }
                        testId='personalDetailsAdditionalPhone'
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
                    <PhoneNumberTextField
                        id={CONTACT_PHONE_LABEL}
                        placeholder={PHONE_LABEL}
                        value={personalInfoStateContext.personalInfoData.contactPhoneNumber.number}
                        isValid={personalInfoStateContext.personalInfoData.contactPhoneNumber.isValid}
                        setIsValid={(isValid) => {
                            handleChangeField(PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER,
                                {
                                    ...personalInfoStateContext.personalInfoData.contactPhoneNumber,
                                    isValid: isValid
                                }
                            )
                        }}
                        onChange={(event) =>
                            handleChangeField(PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER,
                                {
                                    ...personalInfoStateContext.personalInfoData.contactPhoneNumber,
                                    number: event.target.value
                                }
                            )
                        }
                        testId='personalDetailsAdditionalPhone'
                    />
                </Grid>
                <AlphanumericTextField
                    className={classes.contactDescription}
                    setError={setError}
                    clearErrors={clearErrors}
                    errors={errors}
                    name={PersonalInfoDataContextFields.CONTACT_INFO}
                    placeholder={CONTACT_INFO}
                    value={personalInfoStateContext.personalInfoData.contactInfo}
                    onChange={(newValue) => {
                        handleChangeField(PersonalInfoDataContextFields.CONTACT_INFO, newValue);
                    }}
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
                    <FormControl required fullWidth>
                        <InputLabel>גורם מבטח</InputLabel>
                        <Select
                            test-id={'personalDetailsInsurer'}
                            label='גורם מבטח'
                            value={personalInfoStateContext.personalInfoData.insuranceCompany}
                            onChange={(event) => {
                                handleChangeField(PersonalInfoDataContextFields.INSURANCE_COMPANY, event.target.value);
                            }}
                        >
                            {
                                insuranceCompanies.map((insuranceCompany) => (
                                    <MenuItem key={insuranceCompany} value={insuranceCompany}>{insuranceCompany}</MenuItem>
                                ))
                            }
                        </Select>
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
                    <Autocomplete
                        options={Array.from(cities, ([cityId, value]) => ({ cityId, value }))}
                        getOptionLabel={(option) => option.value.displayName}
                        inputValue={cityName}
                        onInputChange={(event, newInputValue) => {
                            setCityName(newInputValue);
                            if (newInputValue === '') {
                                handleChangeAddressOnCityChange('');
                                setStreetName('');
                            }
                        }}
                        onChange={(event, newValue) => {
                            handleChangeAddressOnCityChange(newValue ? newValue.cityId : '');
                        }}
                        renderInput={(params) =>
                            <TextField
                                required
                                {...params}
                                test-id='personalDetailsCity'
                                id={PersonalInfoDataContextFields.CITY}
                                placeholder={'עיר'}
                                value={personalInfoStateContext.personalInfoData.address.city}
                            />}
                    />
                </Grid>
                {
                    cityName &&
                    <Grid item xs={2} className={classes.personalInfoItem}>
                        <Autocomplete
                            size='small'
                            options={streets}
                            getOptionLabel={(option) => option.displayName}
                            inputValue={streetName}
                            onInputChange={(event, newInputValue) => {
                                setStreetName(newInputValue);
                                if (newInputValue === '') {
                                    handleChangeAddress(PersonalInfoDataContextFields.STREET, '');
                                }
                            }}
                            onChange={(event, newValue) => {
                                handleChangeAddress(PersonalInfoDataContextFields.STREET, newValue?.id)
                            }}
                            renderInput={(params) => {
                                return <TextField
                                    required
                                    test-id='personalDetailsStreet'
                                    {...params}
                                    id={PersonalInfoDataContextFields.STREET}
                                    placeholder={'רחוב'}
                                    value={personalInfoStateContext.personalInfoData.address.street}
                                />
                            }}
                        />
                    </Grid>
                }
                <Grid item xs={1} className={classes.homeAddressItem}>
                    <AlphanumericTextField
                        required
                        setError={setError}
                        clearErrors={clearErrors}
                        errors={errors}
                        name={PersonalInfoDataContextFields.FLOOR}
                        test-id='personalDetailsFloor'
                        placeholder={'קומה'}
                        value={personalInfoStateContext.personalInfoData.address.floor}
                        onChange={(newValue) => {
                            handleChangeAddress(PersonalInfoDataContextFields.FLOOR, newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={1} className={classes.homeAddressItem}>
                    <AlphanumericTextField
                        required
                        setError={setError}
                        clearErrors={clearErrors}
                        errors={errors}
                        name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                        test-id='personalDetailsHouseNumber'
                        placeholder={'מספר בית'}
                        value={personalInfoStateContext.personalInfoData.address.houseNum}
                        onChange={(newValue) => {
                            handleChangeAddress(PersonalInfoDataContextFields.HOUSE_NUMBER, newValue);
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
                <Grid item xs={2} className={classes.responsiveOccupation}>
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
                                                setSubOccupationName('');
                                                personalInfoStateContext.setPersonalInfoData(
                                                    {
                                                        ...personalInfoStateContext.personalInfoData,
                                                        [PersonalInfoDataContextFields.INSTITUTION_NAME]: '',
                                                        [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]: '',
                                                        [PersonalInfoDataContextFields.RELEVANT_OCCUPATION]: event.target.value
                                                    });
                                            }} />}
                                        label={<span style={{ fontSize: '15px' }}>{occupation}</span>}
                                    />
                                })
                            }
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {
                    personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM &&
                    <Grid item xs={2}>
                        <Autocomplete
                            options={Array.from(cities, ([name, value]) => ({ name, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={personalInfoStateContext.personalInfoData.educationOccupationCity}
                            onInputChange={(event, newInputValue) => {
                                event && handleChangeField(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, newInputValue)
                            }
                            }
                            onChange={(event, newValue) => {
                                newValue && getEducationSubOccupations(newValue.value.displayName);
                            }}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    test-id='institutionCity'
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
                            (personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.DEFENSE_FORCES ||
                                personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.HEALTH_SYSTEM ||
                                personalInfoStateContext.personalInfoData.relevantOccupation === SubOccupationsSelectOccupations.EDUCATION_SYSTEM) ?
                                <Autocomplete
                                    options={subOccupations}
                                    getOptionLabel={(option) => option.subOccupation + (option.street ? ('/' + option.street) : '')}
                                    inputValue={subOccupationName}
                                    onChange={(event, newValue) => {
                                        newValue && handleChangeField(PersonalInfoDataContextFields.INSTITUTION_NAME, newValue.id)
                                    }
                                    }
                                    onInputChange={(event, newInputValue) => {
                                        setSubOccupationName(newInputValue)
                                    }
                                    }
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            test-id='insertInstitutionName'
                                            disabled={subOccupations.length === 0}
                                            id={PersonalInfoDataContextFields.CITY}
                                            placeholder={INSERT_INSTITUTION_NAME}
                                        />}
                                /> :
                                <AlphanumericTextField
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    errors={errors}
                                    name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                    test-id='institutionName'
                                    value={personalInfoStateContext.personalInfoData.otherOccupationExtraInfo}
                                    placeholder={INSERT_INSTITUTION_NAME}
                                    onChange={(newValue) => {
                                        handleChangeField(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, newValue);
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