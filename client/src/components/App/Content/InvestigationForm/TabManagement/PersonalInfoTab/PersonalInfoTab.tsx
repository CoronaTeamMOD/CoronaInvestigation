import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { yupResolver } from '@hookform/resolvers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, FormProvider } from 'react-hook-form';
import { Grid, RadioGroup, FormControlLabel, Radio, TextField, FormLabel, FormControl, Collapse, Select, MenuItem, InputLabel } from '@material-ui/core';

import City from 'models/City';
import Street from 'models/Street';
import DBAddress from 'models/DBAddress';
import Occupations from 'models/enums/Occupations';
import { setAddress } from 'redux/Address/AddressActionCreators';
import SubOccupationAndStreet from 'models/SubOccupationAndStreet';
import investigatedPatientRole from 'models/investigatedPatientRole';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import { initialPersonalInfo } from 'commons/Contexts/PersonalInfoStateContext';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import { setIsCurrentlyLoading } from 'redux/Investigation/investigationActionCreators';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';
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
const NO_INSURANCE = 'אף אחד מהנ"ל';
const grades = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];
const defaultInvestigationId = -1;
const defaultRole = { id: -1, displayName: '' };

const PersonalInfoTab: React.FC<Props> = ({ id }: Props): JSX.Element => {
    const classes = useStyles({});

    const [subOccupationName, setSubOccupationName] = useState<string>('');
    const [insuranceCompanies, setInsuranceCompanies] = useState<string[]>(['']);
    const [subOccupations, setSubOccupations] = useState<SubOccupationAndStreet[]>([]);
    const [cityName, setCityName] = useState<string>('');
    const [streetName, setStreetName] = useState<string>('');
    const [streets, setStreets] = useState<Street[]>([]);
    const [cityId, setCityId] = useState<string>('');
    const [occupation, setOccupation] = useState<string>('');
    const [personalInfoState, setPersonalInfoData] = useState<PersonalInfoFormData>(initialPersonalInfo);
    const [insuranceCompany, setInsuranceCompany] = useState<string>('');
    const [roleInput, setRoleInput] = useState<string>('');
    const [roleObj, setRoleObj] = useState<investigatedPatientRole>(defaultRole);

    const [investigatedPatientRoles, setInvestigatedPatientRoles] = useState<investigatedPatientRole[]>([]);

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const occupations = useSelector<StoreStateType , string[]>(state => state.occupations);
    const investigationId = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const { fetchPersonalInfo, getSubOccupations, getEducationSubOccupations, getStreetsByCity, savePersonalData } = usePersonalInfoTab({
        setInsuranceCompanies, setPersonalInfoData, setSubOccupations, setSubOccupationName, setCityName, setStreetName,
        setStreets, setInsuranceCompany, setInvestigatedPatientRoles,
    });

    const methods = useForm({
        mode: 'all',
        defaultValues: initialPersonalInfo,
        resolver: yupResolver(personalInfoValidationSchema),
    });

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOccupation = event.target.value;
        setOccupation(newOccupation);
        setSubOccupationName('');
        methods.setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation);
        methods.setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, '');
        methods.setValue(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, '');
        methods.setValue(PersonalInfoDataContextFields.ROLE, '');
        if (newOccupation === Occupations.EDUCATION_SYSTEM && personalInfoState.educationOccupationCity) {
            getEducationSubOccupations(personalInfoState.educationOccupationCity);
        }
    }

    useEffect(() => {
        if (!Boolean(subOccupationName)) {
            methods.setValue(PersonalInfoDataContextFields.INSTITUTION_NAME, '');
        }
    }, [subOccupationName]);

    const data = methods.getValues();

    const institutionComponent = (
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
                            error={methods.errors[PersonalInfoDataContextFields.INSTITUTION_NAME] && subOccupations.length !== 0}
                            label={(methods.errors[PersonalInfoDataContextFields.INSTITUTION_NAME]?.message && subOccupations.length !== 0)
                                ?
                                methods.errors[PersonalInfoDataContextFields.INSTITUTION_NAME]?.message
                                :
                                'שם מוסד*'
                            }
                            onBlur={props.onBlur}
                            test-id='insertInstitutionName'
                            disabled={subOccupations.length === 0}
                            id={PersonalInfoDataContextFields.INSTITUTION_NAME}
                            placeholder={INSERT_INSTITUTION_NAME}
                        />}
                />
            )}
        />
    )

    const convertToDBData = (): PersonalInfoDbData => {
        const data = methods.getValues();
        return {
            phoneNumber: data.phoneNumber || null,
            additionalPhoneNumber: data.additionalPhoneNumber || null,
            contactPhoneNumber: data.contactPhoneNumber || null,
            contactInfo: data.contactInfo || null,
            insuranceCompany: data.insuranceCompany || null,
            address: {
                city: data.city || null,
                street: data.street || null,
                floor: data.floor || null,
                houseNum: data.houseNum || null
            },
            relevantOccupation: data.relevantOccupation || null,
            educationOccupationCity: data.educationOccupationCity || null,
            institutionName: data.institutionName || null,
            otherOccupationExtraInfo: data.otherOccupationExtraInfo || null,
            role: data.role || null,
            educationGrade: data.educationGrade || null,
            educationClassNumber: data.educationClassNumber ? +data.educationClassNumber : null,
        }
    }

    useEffect(() => {
        const address: DBAddress = {
            city: data.city !== '' ? data.city : null,
            street: data.street !== '' ? data.street : null,
            floor: data.floor !== '' ? data.floor : null,
            houseNum: data.houseNum !== '' ? data.houseNum : null
        }

        setAddress(address);
    }, [data.city, data.street, data.floor, data.houseNum]);

    useEffect(() => {
        if (data.role) {
            setRoleObj(
                investigatedPatientRoles.find((investigatedPatientRole: investigatedPatientRole) =>
                    investigatedPatientRole.id === data.role) ?? defaultRole
            );
        }

    }, [investigatedPatientRoles, data.role]);


    useEffect(() => {
        if (investigationId !== defaultInvestigationId) {
            fetchPersonalInfo(methods.reset, methods.trigger);
            setIsCurrentlyLoading(false);
        }
    }, [investigationId]);

    useEffect(() => {
        setRoleInput(roleObj.displayName);
    }, [roleObj]);
    useEffect(() => {
        if (personalInfoState.city) {
            setCityId(personalInfoState.city);
        }
        setOccupation(personalInfoState.relevantOccupation)
        if (personalInfoState.educationOccupationCity) {
            getEducationSubOccupations(personalInfoState.educationOccupationCity);
        }
    }, [personalInfoState]);

    useEffect(() => {
        if (occupation === Occupations.DEFENSE_FORCES ||
            occupation === Occupations.HEALTH_SYSTEM) {
            getSubOccupations(occupation);
        } else {
            setSubOccupations([]);
        }
    }, [occupation]);

    useEffect(() => {
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

    return (
        <div className={classes.tabInitialContainer}>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(event) => {
                    event.preventDefault();
                    savePersonalData(convertToDBData(), data, id);
                }}>
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
                                        onChange={(newValue: string) => (props.onChange(newValue))}
                                        onBlur={props.onBlur}
                                        placeholder={CONTACT_INFO}
                                        label='פרטי איש קשר'
                                        className={classes.contactDescription}
                                    />
                                )}
                            />
                        </>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={INSURANCE_LABEL} appendantLabelIcon={insuranceCompany === NO_INSURANCE ? <ComplexityIcon tooltipText='המאומת חסר מעמד' /> : undefined}>
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
                                                if (event?.type !== 'blur') {
                                                    setInsuranceCompany(selectedInsuranceCompany);
                                                    if (selectedInsuranceCompany === '') {
                                                        props.onChange('');
                                                        methods.setValue(PersonalInfoDataContextFields.INSURANCE_COMPANY, '');
                                                    }
                                                }
                                            }}
                                            className={props.value === NO_INSURANCE ? classes.markComplexity : ''}
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
                            <Grid item xs={3} className={classes.personalInfoItem}>
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
                                                if (event?.type !== 'blur') {
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
                                                if (event?.type !== 'blur') {
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
                        </>
                    </FormRowWithInput>

                    <FormRowWithInput gridProps={{ alignItems: 'baseline' }} fieldName={RELEVANT_OCCUPATION_LABEL}>
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
                                                <FormLabel component='legend'
                                                    className={classes.fontSize15}><b>{OCCUPATION_LABEL}</b></FormLabel>
                                                {
                                                    occupations.map((occupationOption) => {
                                                        return (
                                                            <div className={classes.occupation}>
                                                                <FormControlLabel
                                                                    value={occupationOption}
                                                                    key={occupationOption}
                                                                    control={<Radio
                                                                        color='primary'
                                                                        onChange={handleChangeOccupation}
                                                                    />}
                                                                    label={<span style={{ fontSize: '15px' }}>{occupationOption}</span>}
                                                                />
                                                                {
                                                                    (
                                                                        (occupationOption === Occupations.EDUCATION_SYSTEM && occupation === Occupations.EDUCATION_SYSTEM) ||
                                                                        (occupationOption === Occupations.HEALTH_SYSTEM && occupation === Occupations.HEALTH_SYSTEM)
                                                                    ) && <div className={classes.complexIconOnOccupation}>
                                                                        <ComplexityIcon tooltipText='עובד במשרד הבריאות/החינוך' />
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </RadioGroup>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            {
                                occupation === Occupations.EDUCATION_SYSTEM || occupation === Occupations.HEALTH_SYSTEM ?
                                    <>
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
                                                                    placeholder='עיר המצאות המוסד'
                                                                />}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        <Grid item xs={2}>
                                            {institutionComponent}
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Controller
                                                control={methods.control}
                                                name={PersonalInfoDataContextFields.ROLE}
                                                render={(props) => (
                                                    <Autocomplete
                                                        options={investigatedPatientRoles}
                                                        getOptionLabel={(option) => option.displayName}
                                                        inputValue={roleInput}
                                                        className={classes.markComplexity}
                                                        value={roleObj}
                                                        onChange={(event, selectedRole) => {
                                                            props.onChange(selectedRole?.id as number);
                                                        }}
                                                        onInputChange={(event, newRoleInput) => {
                                                            if (event?.type !== 'blur') {
                                                                setRoleInput(newRoleInput);
                                                            }
                                                        }}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                {...params}
                                                                placeholder='תפקיד'
                                                            />
                                                        }
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        {
                                            roleInput === 'תלמיד/ה' && occupation === Occupations.EDUCATION_SYSTEM &&
                                            <>
                                                <Grid item xs={1}>
                                                    <FormControl variant='outlined'>
                                                        <InputLabel>שכבה</InputLabel>
                                                        <Controller
                                                            name={PersonalInfoDataContextFields.EDUCATION_GRADE}
                                                            control={methods.control}
                                                            render={(props) => (
                                                                <Select
                                                                    label='שכבה'
                                                                    className={[classes.gradeInput, props.value && classes.markComplexity].join(' ')}
                                                                    value={props.value}
                                                                    onChange={(event) => props.onChange(event.target.value)}
                                                                >
                                                                    {
                                                                        grades.map((grade: string) => (
                                                                            <MenuItem
                                                                                key={grade}
                                                                                value={grade}>
                                                                                {grade}
                                                                            </MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            )}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Controller
                                                        name={PersonalInfoDataContextFields.EDUCATION_CLASS_NUMBER}
                                                        control={methods.control}
                                                        render={(props) => (
                                                            <NumericTextField
                                                                name={PersonalInfoDataContextFields.EDUCATION_CLASS_NUMBER}
                                                                className={[classes.gradeInput, props.value && classes.markComplexity].join(' ')}
                                                                value={props.value}
                                                                onChange={(newValue) => props.onChange(newValue)}
                                                                onBlur={props.onBlur}
                                                                label='מס כיתה'
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </>
                                    : occupation === Occupations.DEFENSE_FORCES ?
                                        <Grid item xs={3}>{institutionComponent}</Grid>
                                        :
                                        <Grid item xs={2}>
                                            <Collapse in={occupation !== Occupations.UNEMPLOYED}>
                                                {
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
                                                    />
                                                }
                                            </Collapse>
                                        </Grid>
                            }
                        </>
                    </FormRowWithInput>
                </form>
            </FormProvider>
        </div>
    );
};

interface Props {
    id: number;
};

export default PersonalInfoTab;
