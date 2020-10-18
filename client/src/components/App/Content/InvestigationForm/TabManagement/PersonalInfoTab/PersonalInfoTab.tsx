import React, { useContext } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { yupResolver } from '@hookform/resolvers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, RadioGroup, FormControlLabel, Radio, TextField, FormLabel, Typography, FormControl, Collapse } from '@material-ui/core';
import Swal from 'sweetalert2';


import City from 'models/City';
import axios from 'Utils/axios';
import Street from 'models/Street';
import logger from 'logger/logger';
import DBAddress from 'models/DBAddress';
import { Service, Severity } from 'models/Logger';
import Occupations from 'models/enums/Occupations';
import { setFormState } from 'redux/Form/formActionCreators';
import { setAddress } from 'redux/Address/AddressActionCreators';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import { occupationsContext } from 'commons/Contexts/OccupationsContext';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import { initialPersonalInfo } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { setIsCurrentlyLoading } from 'redux/Investigation/investigationActionCreators';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { cityFilterOptions, streetFilterOptions } from 'Utils/Address/AddressOptionsFilters';
import { PersonalInfoDbData, PersonalInfoFormData } from 'models/Contexts/PersonalInfoContextData';

import useStyles from './PersonalInfoTabStyles';
import usePersonalInfoTab from './usePersonalInfoTab';
import personalInfoValidationSchema from './PersonalInfoValidationSchema';

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

    const methods = useForm({
        mode: 'all',
        defaultValues: initialPersonalInfo,
        resolver: yupResolver(personalInfoValidationSchema),
    });

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOccupation = event.target.value
        setOccupation(newOccupation);
        setSubOccupationName('');
        methods.setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation);
        methods.setValue(PersonalInfoDataContextFields.INSTITUTION_NAME, '');
        methods.setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, '');
        if (newOccupation === Occupations.EDUCATION_SYSTEM && personalInfoState.educationOccupationCity) {
            getEducationSubOccupations(personalInfoState.educationOccupationCity);
        }
    }

    const data = methods.getValues();

    const convertToDBData = (): PersonalInfoDbData => {
        return {
            phoneNumber: data.phoneNumber !== '' ? data.phoneNumber : null,
            additionalPhoneNumber: data.additionalPhoneNumber !== '' ? data.additionalPhoneNumber : null,
            contactPhoneNumber: data.contactPhoneNumber !== '' ? data.contactPhoneNumber : null,
            contactInfo: data.contactInfo !== '' ? data.contactInfo : null,
            insuranceCompany: data.insuranceCompany !== '' ? data.insuranceCompany : null,
            address: {
                city: data.city ? data.city : null,
                street: data.street ? data.street : null,
                floor: data.floor ? data.floor : null,
                houseNum: data.houseNum ? data.houseNum : null
            },
            relevantOccupation: data.relevantOccupation !== undefined ? data.relevantOccupation : null,
            educationOccupationCity: data.educationOccupationCity ? data.educationOccupationCity : null,
            institutionName: data.institutionName ? data.institutionName : null,
            otherOccupationExtraInfo: data.otherOccupationExtraInfo ? data.otherOccupationExtraInfo : null,
        }
    }

    React.useEffect(() => {
        const address: DBAddress = {
            city: data.city !== '' ? data.city : null,
            street: data.street !== '' ? data.street : null,
            floor: data.floor !== '' ? data.floor : null,
            houseNum: data.houseNum !== '' ? data.houseNum : null
        }

        setAddress(address);
    }, [data.city, data.street, data.floor, data.houseNum]);

    React.useEffect(() => {
        if(investigationId !== -1) {
            fetchPersonalInfo(methods.reset, methods.trigger);
            setIsCurrentlyLoading(false);
        }
    }, [investigationId]);

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
        personalInfoValidationSchema.isValid(data).then(valid => {
            setFormState(investigationId, id, valid);
        })
    }

    return (
        <div className={classes.tabInitialContainer}>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(event) => savePersonalData(event, convertToDBData())}>
                    <FormRowWithInput fieldName={PHONE_LABEL}>
                    <Grid item xs={2} className={classes.personalInfoItem}>
                            <Controller
                                control={methods.control}
                                name={PersonalInfoDataContextFields.PHONE_NUMBER}
                                render={(props) => (
                                    <NumericTextField
                                        testId='personalDetailsPhone'
                                        name={props.name}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue)}
                                        onBlur={props.onBlur}
                                        placeholder={PHONE_LABEL}
                                        label='טלפון*'
                                        className={classes.phoneInput}
                                    />
                                )}
                            />
                        </Grid>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={ADDITIONAL_PHONE_LABEL}>
                        <Grid item xs={2} className={classes.personalInfoItem}>
                            <Controller
                                control={methods.control}
                                name={PersonalInfoDataContextFields.ADDITIONAL_PHONE_NUMBER}
                                render={(props) => (
                                    <NumericTextField
                                        testId='personalDetailsAdditionalPhone'
                                        name={props.name}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue)}
                                        onBlur={props.onBlur}
                                        placeholder={PHONE_LABEL}
                                        label='טלפון'
                                        className={classes.phoneInput}
                                    />
                                )}
                            />
                        </Grid>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={CONTACT_PHONE_LABEL}>
                        <>
                        <Grid item xs={2} className={classes.personalInfoItem}>
                            <Controller
                                control={methods.control}
                                name={PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER}
                                render={(props) => (
                                    <NumericTextField
                                        testId='personalDetailsContactPhone'
                                        name={props.name}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue)}
                                        onBlur={props.onBlur}
                                        placeholder={PHONE_LABEL}
                                        label='טלפון'
                                        className={classes.phoneInput}
                                    />
                                )}
                            />
                        </Grid>
                        <Controller
                            name={PersonalInfoDataContextFields.CONTACT_INFO}
                            control={methods.control}
                            render={(props) => (
                                <AlphanumericTextField
                                    name={PersonalInfoDataContextFields.CONTACT_INFO}
                                    value={props.value}
                                    onChange={(newValue: string) => ( props.onChange(newValue))}
                                    onBlur={props.onBlur}
                                    placeholder={CONTACT_INFO}
                                    label='פרטי איש קשר'
                                    className={classes.contactDescription}
                                />
                            )}
                        />
                        </>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={INSURANCE_LABEL}>
                        <Grid item xs={2} className={classes.personalInfoItem}>
                            <FormControl fullWidth>
                                <Controller
                                    name={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                    control={methods.control}
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
                                                    methods.setValue(PersonalInfoDataContextFields.INSURANCE_COMPANY, '');
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    test-id='personalDetailsInsurer'
                                                    value={props.value ? props.value : ''}
                                                    label={methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message || 'גורם מבטח*'}
                                                    error={methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]}
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
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={ADDRESS_LABEL}>
                        <>
                        <Grid item xs={2} className={classes.personalInfoItem}>
                            <Controller
                                name={PersonalInfoDataContextFields.CITY}
                                control={methods.control}
                                render={(props: any) => (
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
                                                methods.setValue(PersonalInfoDataContextFields.STREET, '')
                                                setStreetName('')
                                                setCityName(newInputValue);
                                                if (!newInputValue) {
                                                    methods.setValue(PersonalInfoDataContextFields.CITY, '')
                                                }
                                            }
                                        }}
                                        onChange={(event, newValue) => {
                                            setCityId(newValue ? newValue.id : '');
                                            props.onChange(newValue ? newValue.id : '');
                                        }}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id='insertCityName'
                                                value={props.value ? props.value : ''}
                                                label={methods.errors[PersonalInfoDataContextFields.CITY]?.message || 'עיר*'}
                                                error={methods.errors[PersonalInfoDataContextFields.CITY]}
                                                onBlur={props.onBlur}
                                                id={PersonalInfoDataContextFields.CITY}
                                                placeholder={INSERT_INSTITUTION_NAME}
                                            />
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={2} className={classes.personalInfoItem}>
                            <Controller
                                name={PersonalInfoDataContextFields.STREET}
                                control={methods.control}
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
                                                    methods.setValue(PersonalInfoDataContextFields.STREET, '')
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
                                                error={methods.errors[PersonalInfoDataContextFields.STREET]}
                                                label={methods.errors[PersonalInfoDataContextFields.STREET]?.message || 'רחוב'}
                                                onBlur={props.onBlur}
                                                id={PersonalInfoDataContextFields.STREET}
                                                placeholder={'רחוב'}
                                            />
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={1} className={classes.homeAddressItem}>
                            <Controller
                                name={PersonalInfoDataContextFields.FLOOR}
                                control={methods.control}
                                render={(props: any) => (
                                    <AlphanumericTextField
                                        testId='personalDetailsFloor'
                                        name={PersonalInfoDataContextFields.FLOOR}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue)}
                                        onBlur={props.onBlur}
                                        placeholder='קומה'
                                        label='קומה'
                                        className={classes.floorInput}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={1} className={classes.homeAddressItem}>
                            <Controller
                                name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                                control={methods.control}
                                render={(props: any) => (
                                    <AlphanumericTextField
                                        testId='personalDetailsHouseNumber'
                                        name={PersonalInfoDataContextFields.HOUSE_NUMBER}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue)}
                                        onBlur={props.onBlur}
                                        placeholder='מספר בית'
                                        label='מספר בית'
                                        className={classes.houseNumInput}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                        <FormRowWithInput gridProps={{alignItems:'baseline'}} fieldName={RELEVANT_OCCUPATION_LABEL}>
                            <>
                        <Grid item xs={2} className={classes.responsiveOccupation}>
                            <FormControl component='fieldset'>
                                <Controller
                                    name={PersonalInfoDataContextFields.RELEVANT_OCCUPATION}
                                    control={methods.control}
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
                                    control={methods.control}
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
                                                    error={methods.errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]}
                                                    label={methods.errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]?.message
                                                           || 'עיר המצאות המוסד*'}
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
                                            control={methods.control}
                                            render={(props: any) => (
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
                                                            error={methods.errors[PersonalInfoDataContextFields.INSTITUTION_NAME]}
                                                            label={methods.errors[PersonalInfoDataContextFields.INSTITUTION_NAME]?.message
                                                                    || 'שם מוסד*'}
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
                                            control={methods.control}
                                            render={(props) => (
                                                <AlphanumericTextField
                                                    testId='institutionName'
                                                    name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                                    value={props.value}
                                                    onChange={(newValue: string) => props.onChange(newValue)}
                                                    onBlur={props.onBlur}
                                                    placeholder={subOccupationsPlaceHolderByOccupation()}
                                                    label={subOccupationsLabelByOccupation()}
                                                />
                                            )}
                                        />}
                            </Collapse>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </div>
    );
};

interface Props {
    id: number;
    onSubmit: any;
};

export default PersonalInfoTab;
