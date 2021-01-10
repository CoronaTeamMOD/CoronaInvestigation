import React from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Grid, FormControl, TextField, FormLabel, RadioGroup, 
        InputLabel, FormControlLabel, Radio, Select, MenuItem, Collapse } from '@material-ui/core';

import City from 'models/City';
import StoreStateType from 'redux/storeStateType';
import Occupations from 'models/enums/Occupations';
import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AddressForm, { AddressFormFields } from 'commons/Forms/AddressForm/AddressForm';
import PersonalInfoDataContextFields from 'models/enums/PersonalInfoDataContextFields';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField';
import ComplexityIcon from 'commons/InvestigationComplexity/ComplexityIcon/ComplexityIcon';

import validationSchema from './PersonalInfoTabValidationSchema';
import { PersonalInfoTabState } from './PersonalInfoTabInterfaces';

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

// TODO: Remove stubs
const insuranceCompanies = ['מכבי', 'צהל', 'כללית'].concat(NO_INSURANCE);

const PersonalInfoTab: React.FC<Props> = ({ id }) => {
    
    const methods = useForm<PersonalInfoTabState>({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const occupations = useSelector<StoreStateType , string[]>(state => state.occupations);

    const occupation = methods.watch(PersonalInfoDataContextFields.RELEVANT_OCCUPATION);
    const insuranceCompany = methods.watch(PersonalInfoDataContextFields.INSURANCE_COMPANY);

    const handleChangeOccupation = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOccupation = event.target.value;
        methods.setValue(PersonalInfoDataContextFields.RELEVANT_OCCUPATION, newOccupation);
        methods.setValue(PersonalInfoDataContextFields.OTHER_OCCUPATION_EXTRA_INFO, '');
        methods.setValue(PersonalInfoDataContextFields.EDUCATION_OCCUPATION_CITY, '');
        methods.setValue(PersonalInfoDataContextFields.ROLE, '');
        // if (newOccupation === Occupations.EDUCATION_SYSTEM && personalInfoState.educationOccupationCity) {
        //     getEducationSubOccupations(personalInfoState.educationOccupationCity);
        // }
    }

    const addressFormFields: AddressFormFields = {
        cityField: {
            name: PersonalInfoDataContextFields.CITY
        },
        streetField: {
            name: PersonalInfoDataContextFields.STREET
        },
        houseNumberField: {
            name: PersonalInfoDataContextFields.HOUSE_NUMBER
        },
        floorField: {
            name: PersonalInfoDataContextFields.FLOOR
        }
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form id={`form-${id}`} onSubmit={(event) => {
                    event.preventDefault();
                    // savePersonalData(convertToDBData(), data, id);
                }}>
                    <FormRowWithInput fieldName={PHONE_LABEL}>
                        <Grid item xs={2}>
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
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={ADDITIONAL_PHONE_LABEL + ":"}>
                        <Grid item xs={2}>
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
                                    />
                                )}
                            />
                        </Grid>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={CONTACT_PHONE_LABEL}>
                        <>
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
                                    />
                                )}
                            />
                        </>
                    </FormRowWithInput>
                    <FormRowWithInput fieldName={INSURANCE_LABEL} appendantLabelIcon={insuranceCompany === NO_INSURANCE ? <ComplexityIcon tooltipText='המאומת חסר מעמד' /> : undefined}>
                        <Grid item xs={2}>
                            <FormControl fullWidth>
                                <Controller
                                    name={PersonalInfoDataContextFields.INSURANCE_COMPANY}
                                    control={methods.control}
                                    render={(props) => (
                                        <Autocomplete
                                            options={insuranceCompanies}
                                            getOptionLabel={(option) => option}
                                            getOptionSelected={(option) => option === props.value}
                                            onChange={(event, selectedInsuranceCompany) => {
                                                props.onChange(selectedInsuranceCompany ? selectedInsuranceCompany : '')
                                            }}
                                            renderInput={(params) =>
                                                <TextField
                                                    {...params}
                                                    test-id='personalDetailsInsurer'
                                                    value={props.value ? props.value : ''}
                                                    label={methods.errors[PersonalInfoDataContextFields.INSURANCE_COMPANY]?.message || 'גורם מבטח*'}
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
                    {/* <FormRowWithInput gridProps={{ alignItems: 'baseline' }} fieldName={RELEVANT_OCCUPATION_LABEL}>
                        <>
                            <Grid item xs={2}>
                                <FormControl component='fieldset'>
                                    <Controller
                                        name={PersonalInfoDataContextFields.RELEVANT_OCCUPATION}
                                        control={methods.control}
                                        render={(props) => (
                                            <RadioGroup
                                                aria-label={OCCUPATION_LABEL}
                                                name={OCCUPATION_LABEL}
                                                value={props.value ? props.value : Occupations.OTHER}
                                                >
                                                <FormLabel component='legend'><b>{OCCUPATION_LABEL}</b></FormLabel>
                                                {
                                                    occupations.map((occupationOption) => {
                                                        return (
                                                            <div>
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
                                                                    ) && <div>
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
                    </FormRowWithInput> */}
                </form>
            </FormProvider>     
        </div>
    );
};

interface Props {
    id: number;
}

export default PersonalInfoTab;