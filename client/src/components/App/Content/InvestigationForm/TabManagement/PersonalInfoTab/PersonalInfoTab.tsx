import Swal from 'sweetalert2';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import StoreStateType from 'redux/storeStateType';
import Collapse from '@material-ui/core/Collapse';
import { yupResolver } from '@hookform/resolvers';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import { Controller, useForm } from 'react-hook-form';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { RadioGroup, Radio, TextField } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import City from 'models/City';
import axios from 'Utils/axios';
import Street from 'models/Street';
import logger from 'logger/logger';
import { Service, Severity } from 'models/Logger';
import Occupations from 'models/enums/Occupations';
import { setFormState } from 'redux/Form/formActionCreators';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';
import { initialPersonalInfo } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import { cityFilterOptions, streetFilterOptions } from 'Utils/Address/AddressOptionsFilters';
import { PersonalInfoDbData, PersonalInfoFormData } from 'models/Contexts/PersonalInfoContextData';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';
import personalInfoValidationSchema from './PersonalInfoValidationSchema';
import NumericTextField from 'commons/NumericTextField/NumericTextField';

export const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף';
export const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
export const OCCUPATION_LABEL = 'תעסוקה:';

const PHONE_LABEL = 'טלפון:';
const CONTACT_PHONE_LABEL = 'טלפון איש קשר:';
const INSURANCE_LABEL = 'גורם מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const INSERT_INSURANCE_COMPANY = 'הזן גורם מבטח:';
const INSERT_OFFICE_NAME = 'הזן שם משרד/ רשות:';
const INSERT_TRANSPORTATION_COMPANY_NAME = 'הזן שם חברה:';
const INSERT_INDUSTRY_NAME = 'הזן שם תעשייה:';
const CONTACT_INFO = 'תיאור איש קשר:';
const OFFICE_NAME_LABEL = 'שם משרד/ רשות*';
const TRANSPORTATION_COMPANY_NAME_LABEL = 'שם החברה*';
const INDUSTRY_NAME_LABEL = 'שם התעשייה*';
const INSTITUTION_NAME_LABEL = 'שם מוסד*';

const PersonalInfoTab: React.FC<Props> = ({ id, onSubmit }: Props): JSX.Element => {
    const classes = useStyles({});
    const occupationsStateContext = useContext(occupationsContext);

    const [subOccupationName, setSubOccupationName] = React.useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = React.useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = React.useState<SubOccupationAndStreet[]>([]);
    const [cityName, setCityName] = React.useState<string>('');
    const [streetName, setStreetName] = React.useState<string>('');
    const [streets, setStreets] = React.useState<Street[]>([]);
    const [cityId, setCityId] = React.useState<string>('');
    const [occupation, setOccupation] = React.useState<string>('');
    const [personalInfoState, setPersonalInfoData] = React.useState<PersonalInfoFormData>(initialPersonalInfo);
    const [insuranceCompany, setInsuranceCompany] = React.useState<string>('');
    
    const userId = useSelector<StoreStateType, string>(state => state.user.id);
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);
    const investigatedPatientId = useSelector<StoreStateType, number>(state => state.investigation.investigatedPatientId);

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations, getStreetsByCity } = usePersonalInfoTab({
        setInsuranceCompanies, setPersonalInfoData, setSubOccupations, setSubOccupationName, setCityName, setStreetName,
        setStreets, occupationsStateContext, setInsuranceCompany,
    });

    const { control, setValue, getValues, reset, errors, setError, clearErrors, trigger } = useForm({
        mode: 'all',
        defaultValues: initialPersonalInfo,
        resolver: yupResolver(personalInfoValidationSchema),
    });

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOccupation = event.target.value
        setOccupation(newOccupation);
        setSubOccupationName('');
        setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation);
        setValue(PersonalInfoDataContextFields.INSTITUTION_NAME, '');
        setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, '');
        if (newOccupation === Occupations.EDUCATION_SYSTEM && personalInfoState.educationOccupationCity) {
            getEducationSubOccupations(personalInfoState.educationOccupationCity);
        }
    }

    const convertToDBData = (): PersonalInfoDbData => {
        const data = getValues();
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
        fetchPersonalInfo(reset, trigger);
    }, [])

    React.useEffect(() => {
        if (personalInfoState.city) {
            setCityId(personalInfoState.city);
        }
        setOccupation(personalInfoState.relevantOccupation)
        if (personalInfoState.educationOccupationCity) {
            getEducationSubOccupations(personalInfoState.educationOccupationCity);
        }
    }, [personalInfoState]);

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
            setValue('street', streets[0].id);
            setStreetName(streets[0].displayName);
        }
    }, [streets])

    const subOccupationsPlaceHolderByOccupation = () => {
        if (occupation === Occupations.GOVERNMENT_OFFICE) return INSERT_OFFICE_NAME;
        if (occupation === Occupations.TRANSPORTATION) return INSERT_TRANSPORTATION_COMPANY_NAME;
        if (occupation === Occupations.INDUSTRY) return INSERT_INDUSTRY_NAME;
        return INSERT_INSTITUTION_NAME;
    }

    const subOccupationsLabelByOccupation = () => {
        if (occupation === Occupations.GOVERNMENT_OFFICE) return OFFICE_NAME_LABEL;
        if (occupation === Occupations.TRANSPORTATION) return TRANSPORTATION_COMPANY_NAME_LABEL;
        if (occupation === Occupations.INDUSTRY) return INDUSTRY_NAME_LABEL;
        return INSTITUTION_NAME_LABEL;
    }

    const savePersonalData = (event: any, personalInfoData: PersonalInfoDbData) => {
        event.preventDefault();
        logger.info({
            service: Service.CLIENT,
            severity: Severity.LOW,
            workflow: 'Saving personal details tab',
            step: 'launching the server request',
            investigation: investigationId,
            user: userId
        })
        axios.post('/personalDetails/updatePersonalDetails', 
        {
            id : investigatedPatientId, 
            personalInfoData, 
        })
        .then(() => {
            logger.info({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Saving personal details tab',
                step: 'saved personal details successfully',
                investigation: investigationId,
                user: userId
            });
            onSubmit();
        })
        .catch((error) => {
            logger.error({
                service: Service.CLIENT,
                severity: Severity.LOW,
                workflow: 'Saving personal details tab',
                step: `got error from server: ${error}`,
                investigation: investigationId,
                user: userId
            });
            Swal.fire({
                title: 'לא הצלחנו לשמור את השינויים, אנא נסה שוב בעוד מספר דקות',
                icon: 'error'
            });
        }) 
        personalInfoValidationSchema.isValid(getValues()).then(valid => {
            setFormState(investigationId, id, valid);
        })
    }

    return (
        <div className={classes.tabInitialContainer}>
            <form id={`form-${id}`} onSubmit={(event) => savePersonalData(event, convertToDBData())}>
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
                            render={(props) => (
                                <NumericTextField
                                    name={props.name}
                                    testId='personalDetailsPhone'
                                    className={classes.phoneInput}
                                    value={props.value}
                                    onChange={(newValue: string) => (
                                        props.onChange(newValue)
                                    )}
                                    placeholder={PHONE_LABEL}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    onBlur={props.onBlur}
                                    label='טלפון*'
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
                            render={(props) => (
                                <NumericTextField
                                    name={props.name}
                                    testId='personalDetailsAdditionalPhone'
                                    className={classes.phoneInput}
                                    value={props.value}
                                    onChange={(newValue: string) => (
                                        props.onChange(newValue)
                                    )}
                                    placeholder={PHONE_LABEL}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    label='טלפון'
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
                            render={(props) => (
                                <NumericTextField
                                    name={props.name}
                                    testId='personalDetailsContactPhone'
                                    className={classes.phoneInput}
                                    value={props.value}
                                    onChange={(newValue: string) => (
                                        props.onChange(newValue)
                                    )}
                                    placeholder={PHONE_LABEL}
                                    onBlur={props.onBlur}
                                    errors={errors}
                                    setError={setError}
                                    clearErrors={clearErrors}
                                    label='טלפון'
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
                                label={errors[PersonalInfoDataContextFields.CONTACT_INFO] ? errors[PersonalInfoDataContextFields.CONTACT_INFO]?.message : 'פרטי איש קשר'}
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
                        <FormControl fullWidth>
                            <Controller
                                name={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                control={control}
                                render={(props) => (
                                    <Autocomplete
                                        options={insuranceCompanies}
                                        getOptionLabel={(option) => option}
                                        inputValue={insuranceCompany}
                                        getOptionSelected={(option) => option === props.value}
                                        onChange={(event, selectedInsuranceCompany) => {
                                            setInsuranceCompany(selectedInsuranceCompany ? selectedInsuranceCompany : '')
                                            props.onChange(selectedInsuranceCompany ? selectedInsuranceCompany : '')
                                        }}
                                        onInputChange={(event, selectedInsuranceCompany) => {
                                            setInsuranceCompany(selectedInsuranceCompany);
                                            if (selectedInsuranceCompany === '') {
                                                props.onChange('');
                                                setValue(PersonalInfoDataContextFields.INSURANCE_COMPANY, '');
                                            }
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id='personalDetailsInsurer'
                                                value={props.value ? props.value : ''}
                                                label={errors[PersonalInfoDataContextFields.INSURANCE_COMPANY] ? errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message : 'גורם מבטח*'}
                                                error={errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]}
                                                onBlur={props.onBlur}
                                                id={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                                placeholder={INSERT_INSURANCE_COMPANY}
                                            />
                                        }
                                    />
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
                                    options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                    getOptionLabel={(option) => {
                                        return option?.value?.displayName ? option.value.displayName : cityName
                                    }}
                                    getOptionSelected={(option) => option.value.id === props.value}
                                    inputValue={cityName}
                                    filterOptions={cityFilterOptions}
                                    onInputChange={(event, newInputValue) => {
                                        if (event.type !== 'blur') {
                                            setValue(PersonalInfoDataContextFields.STREET, '')
                                            setStreetName('')
                                            setCityName(newInputValue);
                                            if (!newInputValue) {
                                                setValue(PersonalInfoDataContextFields.CITY, '')
                                            }
                                        }
                                    }}
                                    onChange={(event, newValue) => {
                                        setCityId(newValue ? newValue.id : '');
                                        props.onChange(newValue ? newValue.id : '')
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            test-id='insertCityName'
                                            value={props.value ? props.value : ''}
                                            label={errors[PersonalInfoDataContextFields.CITY] ? errors[PersonalInfoDataContextFields.CITY]?.message : 'עיר*'}
                                            error={errors[PersonalInfoDataContextFields.CITY]}
                                            onBlur={props.onBlur}
                                            id={PersonalInfoDataContextFields.CITY}
                                            placeholder={INSERT_INSTITUTION_NAME}
                                        />
                                    }
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
                                        filterOptions={streetFilterOptions}
                                        getOptionSelected={(option) => option.id === props.value}
                                        inputValue={streetName}
                                        onInputChange={(event, newInputValue) => {
                                            if (event.type !== 'blur') {
                                                setStreetName(newInputValue);
                                                if (newInputValue === '') {
                                                    setValue(PersonalInfoDataContextFields.STREET, '')
                                                }
                                            }
                                        }}
                                        onChange={(event, newValue) => {
                                            props.onChange(newValue?.id)
                                        }}
                                        renderInput={(params) => {
                                            return <TextField
                                                test-id='personalDetailsStreet'
                                                value={props.value ? props.value : ''}
                                                {...params}
                                                error={errors[PersonalInfoDataContextFields.STREET]}
                                                label={errors[PersonalInfoDataContextFields.STREET] ? errors[PersonalInfoDataContextFields.STREET]?.message : 'רחוב'}
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
                                    testId='personalDetailsFloor'
                                    className={classes.floorInput}
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
                                    label={errors[PersonalInfoDataContextFields.FLOOR] ? errors[PersonalInfoDataContextFields.FLOOR]?.message : 'קומה'}
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
                                    testId='personalDetailsHouseNumber'
                                    className={classes.houseNumInput}
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
                                    label={errors[PersonalInfoDataContextFields.HOUSE_NUMBER] ? errors[PersonalInfoDataContextFields.HOUSE_NUMBER]?.message : 'מספר בית'}
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
                                        value={props.value ? props.value : Occupations.OTHER}
                                        className={classes.relevantOccupationselect}>
                                        <FormLabel component='legend' className={classes.fontSize15}><b>{OCCUPATION_LABEL}</b></FormLabel>
                                        {
                                            occupationsStateContext.occupations.map((occupation) => {
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
                                        getOptionSelected={(option) => {
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
                                                label={errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY] ?
                                                    errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]?.message : 'עיר המצאות המוסד*'}
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
                                                    if (event && event.type !== 'blur') {
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
                                                        label={errors[PersonalInfoDataContextFields.INSTITUTION_NAME] ?
                                                            errors[PersonalInfoDataContextFields.INSTITUTION_NAME]?.message : 'שם מוסד*'}
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
                                                testId='institutionName'
                                                name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                                value={props.value}
                                                onBlur={props.onBlur}
                                                onChange={(newValue: string) => (
                                                    props.onChange(newValue)
                                                )}
                                                setError={setError}
                                                clearErrors={clearErrors}
                                                errors={errors}
                                                placeholder={subOccupationsPlaceHolderByOccupation()}
                                                label={errors[PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO] ?
                                                    errors[PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO]?.message : subOccupationsLabelByOccupation()}

                                            />
                                        )}
                                    />}
                        </Collapse>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

interface Props {
    id: number;
    onSubmit: any;
};

export default PersonalInfoTab;
