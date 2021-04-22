import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import React, { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Grid, FormControl, TextField, 
        InputLabel, Select, MenuItem, Collapse, Button } from '@material-ui/core';

import City from 'models/City';
import dateToAge from 'Utils/DateUtils/dateToAge';
import FlattenedDBAddress from 'models/DBAddress';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import EducationGrade from 'models/EducationGrade';
import { defaultEpidemiologyNumber } from 'Utils/consts';
import { setAddress } from 'redux/Address/AddressActionCreators';
import investigatedPatientRole from 'models/investigatedPatientRole';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import { PersonalInfoDbData } from 'models/Contexts/PersonalInfoContextData';
import AddressForm, { AddressFormFields } from 'commons/Forms/AddressForm/AddressForm';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import { setIsCurrentlyLoading } from 'redux/Investigation/investigationActionCreators';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import useStyles from './PersonalInfoTabStyles';
import usePersonalTabInfo from './usePersonalInfoTab';
import validationSchema from './PersonalInfoTabValidationSchema';
import { PersonalInfoTabState } from './PersonalInfoTabInterfaces';
import InstitutionComponent from './InstitutionComponent/InstitutionComponent';

const under16AllowedOccupations = ['מערכת החינוך', 'אחר'];

export const ADDITIONAL_PHONE_LABEL = 'טלפון נוסף';
export const RELEVANT_OCCUPATION_LABEL = 'האם עובד באחד מהבאים:';
export const OCCUPATION_LABEL = 'תעסוקה:';
const PHONE_LABEL = 'טלפון:';
const INSURANCE_LABEL = 'מבטח:';
const ADDRESS_LABEL = 'כתובת:';
const INSERT_INSTITUTION_NAME = 'הזן שם מוסד:';
const INSERT_OCCUPATION = 'הזן תעסוקה:';
const INSERT_INSURANCE_COMPANY = 'הזן מבטח:';
const INSERT_OFFICE_NAME = 'הזן שם משרד/ רשות:';
const INSERT_TRANSPORTATION_COMPANY_NAME = 'הזן שם חברה:';
const INSERT_INDUSTRY_NAME = 'הזן שם תעשייה:';
const OFFICE_NAME_LABEL = 'שם משרד/ רשות*';
const TRANSPORTATION_COMPANY_NAME_LABEL = 'שם החברה*';
const INDUSTRY_NAME_LABEL = 'שם התעשייה*';
const INSTITUTION_NAME_LABEL = 'שם מוסד*';
const NO_INSURANCE = 'אף אחד מהנ"ל';
const INSURANCE_COMPANY = 'מבטח *';
const OCCUPATION = 'תעסוקה *';
const INSTITUTION_CITY = 'עיר המצאות המוסד';
const STUDENT = 'תלמיד/ה';
const CLASS_NUMBER = 'מס כיתה';
const ADD_CONTACT = '+ איש קשר'

const PersonalInfoTab: React.FC<Props> = ({ id }) => {

    const classes = useStyles();
    
    const methods = useForm<PersonalInfoTabState>({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const occupations = useSelector<StoreStateType , string[]>(state => state.occupations);
    const educationGrades = useSelector<StoreStateType, EducationGrade[]>(state => state.educationGrades);
    const birthDate = useSelector<StoreStateType, Date>(state => state.investigation.investigatedPatient.birthDate);
    const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const [toAddContactField, setToAddContactField] = React.useState<boolean>(false);

    const isOver16 = dateToAge(birthDate) > 16;
    
    const { subOccupations, 
            getSubOccupations, 
            getEducationSubOccupations, 
            investigatedPatientRoles,
            fetchPersonalInfo,
            insuranceCompanies,
            clearSubOccupations,
            savePersonalData } = usePersonalTabInfo();

    const contactInfo = methods.watch(`${PersonalInfoDataContextFields.CONTACT_INFO}`);
    const contactPhoneNumber = methods.watch(`${PersonalInfoDataContextFields.CONTACT_PHONE_NUMBER}`);
    const occupation = methods.watch(PersonalInfoDataContextFields.RELEVANT_OCCUPATION);
    const insuranceCompany = methods.watch(PersonalInfoDataContextFields.INSURANCE_COMPANY);
    const selectedRoleId = methods.watch(PersonalInfoDataContextFields.ROLE);
    const educationOccupationCity = methods.watch(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY);
    const city = methods.watch(`${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.CITY}`);
    const street = methods.watch(`${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.STREET}`);
    const houseNumber = methods.watch(`${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.HOUSE_NUMBER}`);
    const apartment = methods.watch(`${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.APARTMENT}`);

    const selectedRole = useMemo<investigatedPatientRole | undefined>(() => (
        investigatedPatientRoles.find(role => role.id === selectedRoleId)
    ), [selectedRoleId]);

    const subOccupationsPlaceHolderByOccupation = useMemo<string>(() => {
        if (occupation === Occupations.GOVERNMENT_OFFICE) return INSERT_OFFICE_NAME;
        if (occupation === Occupations.TRANSPORTATION) return INSERT_TRANSPORTATION_COMPANY_NAME;
        if (occupation === Occupations.INDUSTRY) return INSERT_INDUSTRY_NAME;
        return INSERT_INSTITUTION_NAME;
    }, [occupation]);

    const subOccupationsLabelByOccupation = useMemo<string>(() => {
        if (occupation === Occupations.GOVERNMENT_OFFICE) return OFFICE_NAME_LABEL;
        if (occupation === Occupations.TRANSPORTATION) return TRANSPORTATION_COMPANY_NAME_LABEL;
        if (occupation === Occupations.INDUSTRY) return INDUSTRY_NAME_LABEL;
        return INSTITUTION_NAME_LABEL;
    }, [occupation]);

    const parseDataValue = (key: keyof PersonalInfoTabState, value: any) => {
        type DataKey = typeof key;
        type DataParser = (value: any) => any;
        const specialConvertors: Map<DataKey, DataParser> = new Map<DataKey, DataParser>([
            [PersonalInfoDataContextFields.EDUCATION_CLASS_NUMBER, (value) => parseInt(value)],
            [PersonalInfoDataContextFields.ADDRESS, (value) => {
                Object.keys(value).forEach(key => (value[key] = value[key] || null));
                return value;
            }]
        ]);
        return (specialConvertors.has(key)) ? 
                    (specialConvertors.get(key) as DataParser)(value)
                :
                    value;
    };

    const convertToDBData = (): PersonalInfoDbData => {
        const data = methods.getValues();
        const dataKeys = Object.keys(data);
        const parsedData = Object.values(data)
                                .map(value => value || null)
                                .reduce((obj, value, index) => {
                                    const key = dataKeys[index] as keyof PersonalInfoTabState;
                                    return Object.assign(obj, {
                                        [key]: parseDataValue(key, value)
                                    })
                                }, {})

        return parsedData;
    };

    useEffect(() => {
        if ( Boolean(contactInfo) || Boolean(contactPhoneNumber) ) {   
            setToAddContactField(true);
        }
    }, [contactInfo, contactPhoneNumber]);

    useEffect(() => {
        if (epidemiologyNumber !== defaultEpidemiologyNumber) {
            fetchPersonalInfo(methods.reset, methods.trigger);
            setIsCurrentlyLoading(false);
        }
    }, [epidemiologyNumber]);

    useEffect(() => {
        if (occupation === Occupations.DEFENSE_FORCES ||
            occupation === Occupations.HEALTH_SYSTEM) {
            getSubOccupations(occupation);
        }
        clearSubOccupations();
    }, [occupation]);

    useEffect(() => {
        if (occupation === Occupations.EDUCATION_SYSTEM && educationOccupationCity) {
            getEducationSubOccupations(educationOccupationCity)
        }
    }, [occupation, educationOccupationCity]);

    useEffect(() => {
        const address: FlattenedDBAddress = {
            city: (city as any) || null,
            street: (street as any) || null,
            apartment: (apartment as any) || null,
            houseNum: (houseNumber as any) || null,
        }
        setAddress(address);
    }, [city, street, apartment, houseNumber]);

    const addressFormFields: AddressFormFields = {
        cityField: {
            name: `${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.CITY}`
        },
        streetField: {
            name: `${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.STREET}`,
        },
        houseNumberField: {
            name: `${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.HOUSE_NUMBER}`,
        },
        apartmentField: {
            name: `${PersonalInfoDataContextFields.ADDRESS}.${PersonalInfoDataContextFields.APARTMENT}`,
        }
    };

    return (
        <div className={classes.tabInitialContainer}>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(event) => {
                    event.preventDefault();
                    savePersonalData(convertToDBData(), methods.getValues(), id);
                }}>
                    <FormRowWithInput fieldName={PHONE_LABEL} labelLength={1}>
                        <Grid item container xs={3}>
                            <Grid item xs={8}>
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
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    className={classes.addPersonButton}
                                    disabled={toAddContactField}
                                    onClick={ ()=>{setToAddContactField(true)}}>
                                    {ADD_CONTACT}
                                </Button>
                            </Grid>
                        </Grid>
                    </FormRowWithInput>
                    <Collapse in={toAddContactField}>
                        <Grid item container xs={12} spacing={3} className={classes.addContactWrapper}>
                            <Grid item xs={1} className={classes.contactDetailsStub}/>
                            <Grid item xs={2}>
                                <Controller
                                    name={PersonalInfoDataContextFields.CONTACT_INFO}
                                    control={methods.control}
                                    render={(props) => (
                                        <AlphanumericTextField
                                            fullWidth={true}
                                            name={PersonalInfoDataContextFields.CONTACT_INFO}
                                            value={props.value}
                                            onChange={(newValue: string) => (props.onChange(newValue))}
                                            onBlur={props.onBlur}
                                            placeholder={'פרטי איש קשר'}
                                            label='פרטי איש קשר'
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={2}>
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
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </Collapse>
                    <FormRowWithInput fieldName={INSURANCE_LABEL} appendantLabelIcon={insuranceCompany === NO_INSURANCE ? <ComplexityIcon tooltipText='המאומת חסר מעמד' /> : undefined} labelLength={1}>
                        <Grid item xs={2}>
                            <FormControl fullWidth>
                                <Controller
                                    name={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                    control={methods.control}
                                    render={(props) => (
                                        <Autocomplete
                                            options={insuranceCompanies}
                                            onChange={(event, selectedInsuranceCompany) => {
                                                props.onChange(selectedInsuranceCompany ? selectedInsuranceCompany : '')
                                            }}
                                            value={props.value || ''}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    test-id='personalDetailsInsurer'
                                                    label={methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message || INSURANCE_COMPANY}
                                                    error={Boolean(methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY])}
                                                    id={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                                    placeholder={INSERT_INSURANCE_COMPANY}
                                                    variant='outlined'
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        classes: {
                                                            notchedOutline: props.value === NO_INSURANCE ? classes.notchedOutline : ''
                                                        }
                                                    }}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={ADDRESS_LABEL} labelLength={1}>
                        <AddressForm
                            {...addressFormFields}
                        />
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={OCCUPATION_LABEL} labelLength={1} appendantLabelIcon={occupation === Occupations.EDUCATION_SYSTEM || occupation === Occupations.HEALTH_SYSTEM ? <ComplexityIcon tooltipText='עובד במשרד הבריאות/החינוך' /> : undefined}>
                        <>
                        <Grid item xs={2}>
                            <FormControl fullWidth>
                            <Controller
                                name={PersonalInfoDataContextFields.RELEVANT_OCCUPATION}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        options={isOver16 ? occupations : occupations.filter(occupation => under16AllowedOccupations.indexOf(occupation) !== -1)}
                                        onChange={(event, occupationOption) => {
                                            props.onChange(occupationOption ? occupationOption : '')
                                        }}
                                        value={props.value || ''}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                label={methods.errors[PersonalInfoDataContextFields.RELEVANT_OCCUPATION]?.message || OCCUPATION}
                                                error={Boolean(methods.errors[PersonalInfoDataContextFields.RELEVANT_OCCUPATION])}
                                                id={PersonalInfoDataContextFields.RELEVANT_OCCUPATION}
                                                placeholder={INSERT_OCCUPATION}
                                                variant='outlined'
                                                InputProps={{
                                                    ...params.InputProps,
                                                    classes: {
                                                        notchedOutline: occupation === Occupations.EDUCATION_SYSTEM || occupation === Occupations.HEALTH_SYSTEM ? classes.notchedOutline : ''
                                                    }
                                                }}
                                            />
                                        }
                                    />
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
                                                                methods.setValue(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, '');
                                                                props.onChange(newValue ? newValue.value.displayName : '')
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    {...params}
                                                                    error={Boolean(methods.errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY])}
                                                                    label={methods.errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY]?.message
                                                                        || `${INSTITUTION_CITY} *`}
                                                                    onBlur={props.onBlur}
                                                                    test-id='institutionCity'
                                                                    id={PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY}
                                                                    placeholder={INSTITUTION_CITY}
                                                                />}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        }
                                        <Grid item xs={2}>
                                            <InstitutionComponent 
                                                options={subOccupations} 
                                                placeholder={INSERT_INSTITUTION_NAME} 
                                                fieldName={PersonalInfoDataContextFields.INSTITUTION_NAME} 
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Controller
                                                control={methods.control}
                                                name={PersonalInfoDataContextFields.ROLE}
                                                render={(props) => (
                                                    <Autocomplete
                                                        options={investigatedPatientRoles}
                                                        getOptionLabel={(option) => option.displayName}
                                                        getOptionSelected={(option) => option.id === props.value}
                                                        value={props.value ? {id: props.value, displayName: (selectedRole?.displayName as string)} : null}
                                                        onChange={(event, selectedRole) => props.onChange(selectedRole?.id)}
                                                        renderInput={(params) =>
                                                            <TextField
                                                                {...params}
                                                                placeholder='תפקיד'
                                                                variant='outlined'
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    classes: {
                                                                        notchedOutline: classes.notchedOutline
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        {
                                            (selectedRole?.displayName === STUDENT && occupation === Occupations.EDUCATION_SYSTEM) &&
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
                                                                        Array.isArray(educationGrades) && educationGrades.map((grade: EducationGrade) => (
                                                                            <MenuItem
                                                                                key={grade.id}
                                                                                value={grade.id}>
                                                                                {grade.displayName}
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
                                                                onChange={props.onChange}
                                                                onBlur={props.onBlur}
                                                                label={CLASS_NUMBER}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        }
                                    </>
                                    : occupation === Occupations.DEFENSE_FORCES ?
                                        <Grid item xs={3}>
                                            <InstitutionComponent 
                                                options={subOccupations} 
                                                placeholder={INSERT_INSTITUTION_NAME} 
                                                fieldName={PersonalInfoDataContextFields.INSTITUTION_NAME} 
                                            />
                                        </Grid>
                                        :
                                        <Grid item xs={2}>
                                            <Collapse in={occupation !== Occupations.UNEMPLOYED}>
                                                    <Controller
                                                        name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                                        control={methods.control}
                                                        render={(props) => (
                                                            <AlphanumericTextField
                                                                className={classes.otherTextField}
                                                                InputProps={{className: classes.otherTextField}}
                                                                testId='institutionName'
                                                                name={PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO}
                                                                value={props.value}
                                                                onChange={props.onChange}
                                                                onBlur={props.onBlur}
                                                                placeholder={subOccupationsPlaceHolderByOccupation}
                                                                label={subOccupationsLabelByOccupation}
                                                            />
                                                        )}
                                                    />
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