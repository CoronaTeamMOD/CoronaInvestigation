
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import { yupResolver } from '@hookform/resolvers';
import { Grid, TextField } from '@material-ui/core';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import City from 'models/City';
import Desk from 'models/Desk';
import County from 'models/County';
import SignUpUser from 'models/SignUpUser';
import FormMode from 'models/enums/FormMode';
import StoreStateType from 'redux/storeStateType';
import FormInput from 'commons/FormInput/FormInput';
import SignUpFields from 'models/enums/SignUpFields';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions';
import NumericTextField from 'commons/NumericTextField/NumericTextField';
import AlphabetTextField from 'commons/AlphabetTextField/AlphabetTextField';

import SignUpSchema from './SignUpSchema';
import useStyles from './SignUpFormStyles';
import useSignUpForm from './useSignUpForm';


const MABAR_USER_NAME = 'שם משתמש מב"ר';
const FIRST_NAME_LABEL = 'שם פרטי';
const LAST_NAME_LABEL = 'שם משפחה';
const CITY_LABEL = 'עיר';
const PHONE_NUMBER_LABEL = 'מספר טלפון';
const ID_LABEL = 'תז';
const MAIL_LABEL = 'מייל';
const COUNTY_LABEL = 'נפה';
const DESK_LABEL = 'דסק';
const SOURCE_ORGANIZATION_LABEL = 'מסגרת';
const LANGUAGE_LABEL = 'שפה';

const GenericAlphabetTextField : React.FC<GenericAlphabetTextFieldProps> = 
    ({ props, disabled, label, placeholder, className }: GenericAlphabetTextFieldProps) => (
        <AlphabetTextField
            disabled={disabled}
            testId={props.name}
            name={props.name}
            value={props.value}
            onChange={(newValue: string) => props.onChange(newValue as string)}
            onBlur={props.onBlur}
            placeholder={placeholder}
            label={label}
            className={className}
        />
    )

const GenericNumericTextField : React.FC<GenericNumericTextFieldProps> =
    ({ props, disabled, label, placeholder, className}: GenericNumericTextFieldProps) => (
            <NumericTextField
                disabled={disabled}
                testId={props.name}
                name={props.name}
                value={props.value || ''}
                onChange={(newValue: string) => props.onChange(newValue)}
                onBlur={props.onBlur}
                placeholder={placeholder}
                label={label}
                className={className}
            />
    )

const SignUpForm: React.FC<Props> = ({ defaultValues, handleSaveUser, mode }: Props) => {

    const classes = useStyles();
    const { languages, sourcesOrganization, desks, fetchDesks, createUser, editUser } = useSignUpForm({ handleSaveUser });
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    const counties = useSelector<StoreStateType, County[]>(state => state.county.allCounties);
    
    const methods = useForm<SignUpUser>({
        mode: 'all',
        defaultValues: defaultValues,
        resolver: yupResolver(SignUpSchema)
    })

    const watchCounty = methods.watch(SignUpFields.COUNTY)

    useEffect(() => {
        if (watchCounty?.id) {
            fetchDesks(watchCounty.id)
        } else if (defaultValues?.investigationGroup?.id) {
            fetchDesks(defaultValues.investigationGroup.id)
        }
    }, [watchCounty])

    const shouldDisableFields = mode === FormMode.READ ? true : false;

    const shouldDisableEditFields = mode === FormMode.EDIT ? true : false;
    
    const onSubmit = () => {
        const data = methods.getValues();
        if (mode === FormMode.CREATE) {
            createUser(data);
        } else if (mode === FormMode.EDIT) {
            editUser(data)
        }
    }
    
    return (
        <FormProvider {...methods}>
            <form id='signUp' onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='שם משתמש מב"ר'>
                            <Controller 
                                name={SignUpFields.MABAR_USER_NAME}
                                control={methods.control}
                                render={(props) => (
                                    <TextField
                                        disabled
                                        test-id={props.name}
                                        value={props.value}
                                        onChange={(event) => props.onChange(event.target.value as string)}
                                        placeholder='itay.benmoshe'
                                        onBlur={props.onBlur}
                                        error={get(methods.errors, props.name)}
                                        label={get(methods.errors, props.name)?.message || MABAR_USER_NAME}
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </FormInput>
                </Grid>

                { mode === FormMode.CREATE ? 
                    <Grid container justify='flex-start' className={classes.formRow}>
                            <FormInput xs={8} fieldName='שם מלא'>
                                <Controller
                                    name={`${SignUpFields.FULL_NAME}.${SignUpFields.FIRST_NAME}`}
                                    control={methods.control}
                                    render={(props) => (
                                        <GenericAlphabetTextField 
                                            props={props}
                                            disabled={shouldDisableFields}
                                            placeholder='הכנס שם פרטי...'
                                            label={FIRST_NAME_LABEL}
                                        />
                                    )}
                                />
                            </FormInput>
                        <Grid item xs={4}>
                            <Controller
                                name={`${SignUpFields.FULL_NAME}.${SignUpFields.LAST_NAME}`}
                                control={methods.control}
                                render={(props) => (
                                    <GenericAlphabetTextField 
                                        props={props}
                                        disabled={shouldDisableFields}
                                        placeholder='הכנס שם משפחה...'
                                        label={LAST_NAME_LABEL}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                : 
                    <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='שם מלא'>
                            <Controller 
                                name={SignUpFields.FULL_NAME}
                                control={methods.control}
                                render={(props) => (
                                    <GenericAlphabetTextField 
                                        props={props}
                                        disabled={shouldDisableEditFields || shouldDisableFields}
                                        label='שם מלא'
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>
                }

                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='עיר מגורים'>
                            <Controller
                                name={SignUpFields.CITY}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        {...props}
                                        disabled={shouldDisableFields}
                                        options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                        getOptionLabel={(option) => option?.displayName ? option.displayName : option.value.displayName}
                                        getOptionSelected={(option, value) => option.id === value.id}
                                        onChange={(event, selectedCity) => {
                                            props.onChange(selectedCity ? selectedCity.value : null)
                                        }}
                                        onBlur={props.onBlur}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id={props.name}
                                                placeholder='בחר עיר...'
                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || CITY_LABEL}
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormInput>
                </Grid> 
                
                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='טלפון'>
                            <Controller 
                                name={SignUpFields.PHONE_NUMBER}
                                control={methods.control}
                                render={(props) => (
                                    <GenericNumericTextField 
                                        props={props}
                                        disabled={shouldDisableFields}
                                        placeholder='הכנס מספר טלפון...'
                                        label={PHONE_NUMBER_LABEL}
                                        className={classes.textField}
                                    /> 
                                )}
                            />
                        </FormInput>
                </Grid>  

                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='ת"ז'>
                            <Controller 
                                name={SignUpFields.ID}
                                control={methods.control}
                                render={(props) => (
                                    <GenericNumericTextField 
                                        props={props}
                                        disabled={shouldDisableEditFields || shouldDisableFields}
                                        placeholder='הכנס מספר תעודת זהות...'
                                        label={ID_LABEL}
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </FormInput>
                </Grid>

                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='מייל'>
                            <Controller 
                                name={SignUpFields.MAIL}
                                control={methods.control}
                                render={(props) => (
                                    <TextField 
                                        disabled={shouldDisableFields}
                                        test-id={props.name}
                                        value={props.value}
                                        onChange={event => props.onChange(event.target.value as string)}
                                        onBlur={props.onBlur}
                                        placeholder='הכנס מייל...'
                                        error={get(methods.errors, props.name)}
                                        label={get(methods.errors, props.name)?.message || MAIL_LABEL}
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </FormInput>
                </Grid>

                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='שיוך ארגוני'>
                            <Controller
                                name={SignUpFields.COUNTY}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        {...props}
                                        disabled={shouldDisableFields}
                                        options={counties}
                                        getOptionLabel={(option) => option?.displayName}
                                        value={props.value}
                                        onChange={(event, selectedCounty) => {
                                            props.onChange(selectedCounty ? selectedCounty : null)
                                            methods.setValue(SignUpFields.DESK, null)
                                        }}
                                        onBlur={props.onBlur}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id={props.name}
                                                placeholder='בחר נפה...'
                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || COUNTY_LABEL}
                                                className={classes.countyField}
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormInput>
                    <Grid item xs={4}>
                        <Controller
                            name={SignUpFields.DESK}
                            control={methods.control}
                            render={(props) => (
                                <Autocomplete
                                    {...props}
                                    options={desks}
                                    disabled={shouldDisableFields}
                                    value={props.value}
                                    getOptionLabel={(option) => option ? option.deskName : ''}
                                    onChange={(event, selectedDesk) => {
                                        props.onChange(selectedDesk ? selectedDesk : null)
                                    }}
                                    onBlur={props.onBlur}
                                    renderInput={(params) =>
                                        <TextField
                                            {...params}
                                            test-id={props.name}
                                            placeholder='בחר דסק...'
                                            error={get(methods.errors, props.name)}
                                            label={get(methods.errors, props.name)?.message || DESK_LABEL}
                                        />
                                    }
                                />
                            )}
                        />
                    </Grid>
                </Grid>
        
                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='מסגרות'>
                            <Controller
                                name={SignUpFields.SOURCE_ORGANIZATION}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        disabled={shouldDisableFields}
                                        options={sourcesOrganization}
                                        getOptionLabel={(option) => option.displayName ? option.displayName : option}
                                        getOptionSelected={(option, value) => option.displayName === value}
                                        value={props.value}
                                        onChange={(event, selectedSourceOrganization) =>
                                            props.onChange(selectedSourceOrganization ? 
                                            selectedSourceOrganization.displayName : null)
                                        }
                                        onBlur={props.onBlur}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id={props.name}
                                                placeholder='בחר מסגרת...'
                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || SOURCE_ORGANIZATION_LABEL}
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormInput>
                </Grid>   

                <Grid container justify='flex-start' className={classes.formRow}>
                        <FormInput xs={8} fieldName='שפות'>
                            <Controller
                                name={SignUpFields.LANGUAGES}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        disabled={shouldDisableFields}
                                        disableCloseOnSelect
                                        multiple
                                        options={languages}
                                        getOptionLabel={(option) => option ? option.displayName : option}
                                        value={props.value}
                                        onChange={(event, selectedLanguaegs) => {
                                            props.onChange(selectedLanguaegs);
                                        }}
                                        onBlur={props.onBlur}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id={props.name}
                                                placeholder='בחר שפות...'
                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || LANGUAGE_LABEL}
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormInput>
                </Grid>
            </form>
        </FormProvider>
    )

}

interface Props {
    defaultValues: SignUpUser;
    handleSaveUser?: () => void;
    mode: FormMode;
}

interface GenericAlphabetTextFieldProps {
    props: any;
    disabled: boolean;
    label: string;
    placeholder?: string;
    className?: string;
}

interface GenericNumericTextFieldProps {
    props: any;
    disabled: boolean;
    label: string;
    placeholder: string;
    className: string;
}

export default SignUpForm;