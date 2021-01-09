import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { Grid, FormControl, TextField } from '@material-ui/core';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import FormRowWithInput from 'commons/FormRowWithInput/FormRowWithInput';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
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

    const insuranceCompany = methods.watch(PersonalInfoDataContextFields.INSURANCE_COMPANY);

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
                </form>
            </FormProvider>     
        </div>
    );
};

interface Props {
    id: number;
}

export default PersonalInfoTab;