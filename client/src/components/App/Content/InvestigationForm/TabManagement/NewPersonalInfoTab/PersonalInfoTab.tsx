import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import React, { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Grid, FormControl, TextField, FormLabel, RadioGroup, 
        InputLabel, FormControlLabel, Radio, Select, MenuItem, Collapse } from '@material-ui/core';

import City from 'models/City';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import EducationGrade from 'models/EducationGrade';
import investigatedPatientRole from 'models/investigatedPatientRole';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AddressForm, { AddressFormFields } from 'commons/Forms/AddressForm/AddressForm';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import useStyles from './PersonalInfoTabStyles';
import usePersonalTabInfo from './usePersonalInfoTab';
import validationSchema from './PersonalInfoTabValidationSchema';
import { PersonalInfoTabState } from './PersonalInfoTabInterfaces';
import InstitutionComponent from './InstitutionComponent/InstitutionComponent';

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
const defaultInvestigationId = -1;
const defaultRole = { id: -1, displayName: '' };

const PersonalInfoTab: React.FC<Props> = ({ id }) => {

    const classes = useStyles();
    
    const methods = useForm<PersonalInfoTabState>({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const occupations = useSelector<StoreStateType , string[]>(state => state.occupations);
    const educationGrades = useSelector<StoreStateType, EducationGrade[]>(state => state.educationGrades);
    const epidemiologyNumber = useSelector<StoreStateType, number>((state) => state.investigation.epidemiologyNumber);

    const { subOccupations, 
            getSubOccupations, 
            getEducationSubOccupations, 
            investigatedPatientRoles,
            fetchPersonalInfo,
            insuranceCompanies,
            clearSubOccupations } = usePersonalTabInfo({});

    const occupation = methods.watch(PersonalInfoDataContextFields.RELEVANT_OCCUPATION);
    const insuranceCompany = methods.watch(PersonalInfoDataContextFields.INSURANCE_COMPANY);
    const selectedRoleId = methods.watch(PersonalInfoDataContextFields.ROLE);

    const selectedRole = useMemo<investigatedPatientRole | undefined>(() => (
        investigatedPatientRoles.find(role => role.id === selectedRoleId)
    ), [selectedRoleId]);

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOccupation = event.target.value;
        const educationOccupationCity = methods.getValues(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY);
        methods.setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation);
        methods.setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, '');
        methods.setValue(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, '');
        methods.setValue(PersonalInfoDataContextFields.ROLE, defaultRole.id);
        if (newOccupation === Occupations.EDUCATION_SYSTEM && educationOccupationCity) {
            getEducationSubOccupations(educationOccupationCity);
        }
    }

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

    useEffect(() => {
        fetchPersonalInfo(methods.reset, methods.trigger);
    }, [epidemiologyNumber]);

    useEffect(() => {
        if (occupation === Occupations.DEFENSE_FORCES ||
            occupation === Occupations.HEALTH_SYSTEM) {
            getSubOccupations(occupation);
        } else {
            clearSubOccupations();            
        }
    }, [occupation]);

    const addressFormFields: AddressFormFields = {
        cityField: {
            name: PersonalInfoDataContextFields.CITY,
            className: classes.personalInfoItem,
            // defaultValue: {id:'', value: { id: '', displayName: ''}}
        },
        streetField: {
            name: PersonalInfoDataContextFields.STREET,
            // defaultValue: {id:'', value: { id: '', displayName: ''}}
        },
        houseNumberField: {
            name: PersonalInfoDataContextFields.HOUSE_NUMBER,
        },
        floorField: {
            name: PersonalInfoDataContextFields.FLOOR,
        }
    }

    return (
        <div className={classes.tabInitialContainer}>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(event) => {
                    event.preventDefault();
                    console.log(methods.getValues());
                    // savePersonalData(convertToDBData(), data, id);
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
                    <FormRowWithInput fieldName={ADDITIONAL_PHONE_LABEL + ":"}>
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
                                            onChange={(event, selectedInsuranceCompany) => {
                                                props.onChange(selectedInsuranceCompany ? selectedInsuranceCompany : '')
                                            }}
                                            value={props.value || ''}
                                            className={props.value === NO_INSURANCE ? classes.markComplexity : ''}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    test-id='personalDetailsInsurer'
                                                    label={methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message || 'גורם מבטח *'}
                                                    error={(methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY] as unknown) as boolean}
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
                        <AddressForm
                            {...addressFormFields}
                        />
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
                                                className={classes.relevantOccupationselect}
                                                >
                                                <FormLabel component='legend' className={classes.fontSize15}>
                                                    <b>{OCCUPATION_LABEL}</b>
                                                </FormLabel>
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
                                                                methods.setValue(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, '');
                                                                props.onChange(newValue ? newValue.value.displayName : '')
                                                            }}
                                                            renderInput={(params) =>
                                                                <TextField
                                                                    {...params}
                                                                    error={(methods.errors[PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY] as unknown) as boolean}
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
                                                        getOptionSelected={(option, value) => option.id === value}
                                                        value={props.value}
                                                        onChange={(event, selectedRole) => {
                                                            props.onChange(selectedRole.id);
                                                        }}
                                                        className={classes.markComplexity}
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
                                            (selectedRole?.displayName === 'תלמיד/ה' && occupation === Occupations.EDUCATION_SYSTEM) &&
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
                                                                label='מס כיתה'
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
}

export default PersonalInfoTab;