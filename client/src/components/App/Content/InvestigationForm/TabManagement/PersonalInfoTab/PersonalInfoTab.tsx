import { useForm } from 'react-hook-form';
import React, { useContext } from 'react';
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

import City from 'models/City';
import { Street } from 'models/Street';
import Occupations from 'models/enums/Occupations';
import { SubOccupationAndStreet } from 'models/SubOccupationAndStreet';
import { personalInfoContext } from 'commons/Contexts/PersonalInfoStateContext';
import PhoneNumberTextField from 'commons/PhoneNumberTextField/PhoneNumberTextField';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { personalInfoContextData } from 'models/Contexts/personalInfoContextData';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';

const PHONE_LABEL = 'טלפון:';
export const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף';
const CONTACT_PHONE_LABEL = 'טלפון איש קשר:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
export const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const INSERT_OFFICE_NAME = 'הזן שם משרד/ רשות:';
const INSERT_TRANSPORTATION_COMPANY_NAME = 'הזן שם חברה:';
const INSERT_INDUSTRY_NAME = 'הזן שם תעשייה:';
export const OCCUPATION_LABEL = 'תעסוקה:';
const CONTACT_INFO = 'תיאור איש קשר:';

const PersonalInfoTab: React.FC<Props> = ( { id, onSubmit } : Props ): JSX.Element => {
    const classes = useStyles({});

    const [subOccupationName, setSubOccupationName] = React.useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = React.useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = React.useState<SubOccupationAndStreet[]>([]);
    const [cityName, setCityName] = React.useState<string>('');
    const [streetName, setStreetName] = React.useState<string>('');
    const [streets, setStreets] = React.useState<Street[]>([]);

    const personalInfoStateContext = useContext(personalInfoContext);
    const occupationsStateContext = useContext(occupationsContext);
    const { relevantOccupation, phoneNumber, address, contactInfo, insuranceCompany,
        otherOccupationExtraInfo, educationOccupationCity, additionalPhoneNumber, contactPhoneNumber } = personalInfoStateContext.personalInfoData;
    const { city, street, floor, houseNum } = address;
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const handleChangeField = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({ ...personalInfoStateContext.personalInfoData, [fieldName]: fieldValue });
    }

    const handleChangeAddress = (fieldName: PersonalInfoDataContextFields, fieldValue: any) => {
        personalInfoStateContext.setPersonalInfoData({
            ...personalInfoStateContext.personalInfoData,
            address: {
                ...address,
                [fieldName]: fieldValue
            }
        });
    }

    const handleChangeAddressOnCityChange = (city: string) => {
        personalInfoStateContext.setPersonalInfoData({
            ...personalInfoStateContext.personalInfoData,
            address: {
                ...address,
                city,
                street: ''
            }
        })
    };

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSubOccupationName('');
        personalInfoStateContext.setPersonalInfoData(
        {
            ...personalInfoStateContext.personalInfoData,
            [PersonalInfoDataContextFields.INSTITUTION_NAME]: '',
            [PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]: '',
            [PersonalInfoDataContextFields.RELEVANT_OCCUPATION]: event.target.value
        });
    }

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations, getStreetsByCity } = usePersonalInfoTab({
        occupationsStateContext, setInsuranceCompanies, personalInfoStateContext, setSubOccupations, setSubOccupationName, setCityName, setStreetName, setStreets
    });

    React.useEffect(() => {
        fetchPersonalInfo();
    }, [])

    React.useEffect(() => {
        if (relevantOccupation === Occupations.DEFENSE_FORCES ||
            relevantOccupation === Occupations.HEALTH_SYSTEM) {
            getSubOccupations(relevantOccupation);
        } else {
            setSubOccupations([]);
        }
    }, [relevantOccupation]);

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

    const savePersonalData = (e: any, personalInfoData: any | personalInfoContextData) => {
        e.preventDefault();
        console.log("PersonalTab");
        onSubmit();
        return false;
        // axios.post('/personalDetails/updatePersonalDetails', 
        // {
        //     id : investigatedPatientId, 
        //     personalInfoData, 
        // }).catch(() => {
        //     Swal.fire({
        //         title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
        //         icon: 'error'
        //     });
    }


    const subOccupationsPlaceHolderByOccupation = () => {
        if (relevantOccupation ===  Occupations.GOVERNMENT_OFFICE) return INSERT_OFFICE_NAME;
        if (relevantOccupation === Occupations.TRANSPORTATION) return INSERT_TRANSPORTATION_COMPANY_NAME;
        if (relevantOccupation === Occupations.INDUSTRY) return INSERT_INDUSTRY_NAME;
        return INSERT_INSTITUTION_NAME;
    }

    return (
        <div className={classes.tabInitialContainer}>
             <form id={`form-${id}`} onSubmit={(e) => savePersonalData(e, { name: "itay" })}>
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
                        placeholder={PHONE_LABEL}
                        value={phoneNumber.number}
                        isValid={phoneNumber.isValid}
                        setIsValid={(isValid) =>
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER,
                                {...phoneNumber, isValid}
                            )
                        }
                        onChange={(event) =>
                            handleChangeField(PersonalInfoDataContextFields.PHONE_NUMBER,
                                {...phoneNumber, number: event.target.value}
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
                            {ADDITIONAL_PHONE_LABEL + ':'}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={2} className={classes.personalInfoItem}>
                    <PhoneNumberTextField
                        id={ADDITIONAL_PHONE_LABEL + ':'}
                        placeholder={PHONE_LABEL}
                        value={additionalPhoneNumber.number}
                        isValid={additionalPhoneNumber.isValid}
                        setIsValid={(isValid) =>
                            handleChangeField(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER,
                                {...additionalPhoneNumber, isValid}
                            )
                        }
                        onChange={(event) =>
                            handleChangeField(PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER,
                                {...additionalPhoneNumber, number: event.target.value}
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
                        value={contactPhoneNumber.number}
                        isValid={contactPhoneNumber.isValid}
                        setIsValid={(isValid) =>
                            handleChangeField(PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER,
                                {...contactPhoneNumber, isValid}
                            )
                        }
                        onChange={(event) =>
                            handleChangeField(PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER,
                                {...contactPhoneNumber,number: event.target.value}
                            )
                        }
                        testId='personalDetailsContactPhone'
                    />
                </Grid>
                <AlphanumericTextField
                    className={classes.contactDescription}
                    setError={setError}
                    clearErrors={clearErrors}
                    errors={errors}
                    name={PersonalInfoDataContextFields.CONTACT_INFO}
                    placeholder={CONTACT_INFO}
                    value={contactInfo}
                    onChange={(newValue) =>
                        handleChangeField(PersonalInfoDataContextFields.CONTACT_INFO, newValue)
                    }
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
                    <FormControl fullWidth>
                        <InputLabel>גורם מבטח</InputLabel>
                        <Select
                            test-id={'personalDetailsInsurer'}
                            label='גורם מבטח'
                            value={insuranceCompany}
                            onChange={(event) =>
                                handleChangeField(PersonalInfoDataContextFields.INSURANCE_COMPANY, event.target.value)
                            }
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
                        className={classes.spacedOutAddress}
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
                                {...params}
                                test-id='personalDetailsCity'
                                id={PersonalInfoDataContextFields.CITY}
                                placeholder={'עיר'}
                                value={city}
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
                                    test-id='personalDetailsStreet'
                                    {...params}
                                    id={PersonalInfoDataContextFields.STREET}
                                    placeholder={'רחוב'}
                                    value={street}
                                />
                            }}
                        />
                    </Grid>
                }
                <Grid item xs={1} className={classes.homeAddressItem}>
                    <AlphanumericTextField
                        setError={setError}
                        clearErrors={clearErrors}
                        errors={errors}
                        name={PersonalInfoDataContextFields.FLOOR}
                        testId='personalDetailsFloor'
                        placeholder={'קומה'}
                        value={floor}
                        onChange={(newValue) => {
                            handleChangeAddress(PersonalInfoDataContextFields.FLOOR, newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={1} className={classes.homeAddressItem}>
                    <AlphanumericTextField
                        setError={setError}
                        clearErrors={clearErrors}
                        errors={errors}
                        name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                        testId='personalDetailsHouseNumber'
                        placeholder={'מספר בית'}
                        value={houseNum}
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
                        <RadioGroup aria-label={OCCUPATION_LABEL} name={OCCUPATION_LABEL} value={relevantOccupation} className={classes.relevantOccupationselect}>
                            <FormLabel component='legend' className={classes.fontSize15}><b>{OCCUPATION_LABEL}</b></FormLabel>
                            {
                                occupationsStateContext.occupations.map((occupation) => {
                                    return <FormControlLabel
                                        value={occupation}
                                        key={occupation}
                                        control={<Radio
                                            color='primary'
                                            onChange={handleChangeOccupation} />}
                                        label={<span style={{ fontSize: '15px' }}>{occupation}</span>}
                                    />
                                })
                            }
                        </RadioGroup>
                    </FormControl>
                </Grid>
                {
                    relevantOccupation === Occupations.EDUCATION_SYSTEM &&
                    <Grid item xs={2}>
                        <Autocomplete
                            options={Array.from(cities, ([name, value]) => ({ name, value }))}
                            getOptionLabel={(option) => option.value.displayName}
                            inputValue={educationOccupationCity}
                            onInputChange={(event, newInputValue) =>
                                event && handleChangeField(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, newInputValue)
                            }
                            onChange={(event, newValue) =>
                                newValue && getEducationSubOccupations(newValue.value.displayName)
                            }
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    test-id='institutionCity'
                                    id={PersonalInfoDataContextFields.CITY}
                                    placeholder={'עיר המצאות המוסד'}
                                    value={educationOccupationCity}
                                />}
                        />
                    </Grid>
                }
                <Grid item xs={3}>
                    <Collapse in={relevantOccupation !== Occupations.UNEMPLOYED}>
                        {
                            (subOccupations.length > 0 || relevantOccupation === Occupations.EDUCATION_SYSTEM) ?
                                <Autocomplete
                                    options={subOccupations}
                                    getOptionLabel={(option) => option.subOccupation + (option.street ? ('/' + option.street) : '')}
                                    inputValue={subOccupationName}
                                    onChange={(event, newValue) =>
                                        newValue && handleChangeField(PersonalInfoDataContextFields.INSTITUTION_NAME, newValue.id)
                                    }
                                    onInputChange={(event, newInputValue) => setSubOccupationName(newInputValue)}
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
                                    testId='institutionName'
                                    value={otherOccupationExtraInfo}
                                    placeholder={subOccupationsPlaceHolderByOccupation()}
                                    onChange={(newValue) =>
                                        handleChangeField(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, newValue)
                                    }

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