
import React, { useState } from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers';
import { Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';

import SignUpFields from 'models/enums/SignUpFields'
import SignUpUser from 'models/SignUpUser';
import City from 'models/City';
import County from 'models/County';
import SourceOrganization from 'models/SourceOrganization'
import Language from 'models/Language'
import AlphabetTextField from 'commons/AlphabetTextField/AlphabetTextField';
import NumericTextField from 'commons/NumericTextField/NumericTextField'
import FormInput from 'commons/FormInput/FormInput'
import StoreStateType from 'redux/storeStateType';
import { get } from 'Utils/auxiliaryFunctions/auxiliaryFunctions'

import SignUpSchema from './SignUpSchema'
import useSignUpForm from './useSignUpForm'
import useStyles from './SignUpFormStyles'


const MABAR_USER_NAME = 'שם משתמש מב"ר'
const FIRST_NAME_LABEL = 'שם פרטי'
const LAST_NAME_LABEL = 'שם משפחה'
const CITY_LABEL = 'עיר'
const PHONE_NUMBER_LABEL = 'מספר טלפון'
const ID_LABEL = 'תז'
const MAIL_LABEL = 'מייל'
const COUNTY_LABEL = 'נפה'
const SOURCE_ORGANIZATION_LABEL = 'מסגרת'
const LANGUAGE_LABEL = 'שפה'

const SignUpForm: React.FC<Props> = ({ defaultValues, handleSaveUser }: Props) => {
    const classes = useStyles();
    
    const [counties, setCounties] = useState<County[]>([]);
    const [languages, setLanguages] = useState<Language[]>([]);
    const [sourcesOrganization, setSourcesOrganization] = useState<SourceOrganization[]>([])
    
    const { getDefaultValues, createUser } = useSignUpForm({ setCounties, setSourcesOrganization, setLanguages,
                                                             handleSaveUser });

    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);
    
    const methods = useForm<SignUpUser>({
        mode: 'all',
        defaultValues: defaultValues ? defaultValues : getDefaultValues(),
        resolver: yupResolver(SignUpSchema)
    })

    const GenericAlphabetTextField = (props: any, label: string, placeholder: string, className?: any) => (
        <AlphabetTextField
            disabled={Boolean(defaultValues)}
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
    
    const GenericNumericTextField = (props: any, label: string, placeholder: string) => (
        <NumericTextField
            disabled={Boolean(defaultValues)}
            testId={props.name}
            name={props.name}
            value={props.value}
            onChange={(newValue: string) => props.onChange(newValue)}
            onBlur={props.onBlur}
            placeholder={placeholder}
            label={label}
            className={classes.textField}
        />
    )
    
    const onSubmit = (data: SignUpUser) => {
        createUser(data);
    }
    
    return (
        <FormProvider {...methods}>
            <form id='signUp' onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container justify='flex-start' className={classes.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='שם משתמש מב"ר'>
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
                </Grid>

                { defaultValues ? 
                    <Grid container justify='flex-start' className={classes.formRow}>
                        <Grid item xs={8}>
                            <FormInput fieldName='שם מלא'>
                                <Controller 
                                    name={SignUpFields.FULL_NAME}
                                    control={methods.control}
                                    render={(props) => (
                                        GenericAlphabetTextField(props, 'שם מלא', '', classes.textField)
                                    )}
                                />
                            </FormInput>
                        </Grid>
                    </Grid>
                : 
                    <Grid container justify='flex-start' className={classes.formRow}>
                        <Grid item xs={8}>
                            <FormInput fieldName='שם מלא'>
                                <Controller
                                    name={`${SignUpFields.FULL_NAME}.${SignUpFields.FIRST_NAME}`}
                                    control={methods.control}
                                    render={(props) => (
                                        GenericAlphabetTextField(props, FIRST_NAME_LABEL, 'הכנס שם פרטי...')
                                    )}
                                />
                            </FormInput>
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name={`${SignUpFields.FULL_NAME}.${SignUpFields.LAST_NAME}`}
                                control={methods.control}
                                render={(props) => (
                                    GenericAlphabetTextField(props, LAST_NAME_LABEL, 'הכנס שם משפחה...')
                                )}
                            />
                        </Grid>
                    </Grid>
                }

                <Grid container justify='flex-start' className={classes.formRow}> 
                    <Grid item xs={8}>
                        <FormInput fieldName='עיר מגורים'>
                            <Controller
                                name={SignUpFields.CITY}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        disabled={Boolean(defaultValues)}
                                        options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                        getOptionLabel={(option) => option ? option.value?.displayName : option}
                                        value={props.value}
                                        onChange={(event, selectedCity) => {
                                            props.onChange(selectedCity ? selectedCity.id : null)
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
                </Grid>   
                
                <Grid container justify='flex-start' className={classes.formRow}>  
                    <Grid item xs={8}>
                        <FormInput fieldName='טלפון'>   
                            <Controller 
                                name={SignUpFields.PHONE_NUMBER}
                                control={methods.control}
                                render={(props) => (
                                    GenericNumericTextField(props, PHONE_NUMBER_LABEL, 'הכנס מספר טלפון...')
                                )}
                            />
                        </FormInput> 
                    </Grid>                   
                </Grid>  

                <Grid container justify='flex-start' className={classes.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='ת"ז'>
                            <Controller 
                                name={SignUpFields.ID}
                                control={methods.control}
                                render={(props) => (
                                    GenericNumericTextField(props, ID_LABEL, 'הכנס מספר תעודת זהות...')
                                )}
                            />
                        </FormInput>
                    </Grid>
                </Grid>

                <Grid container justify='flex-start' className={classes.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='מייל'>
                            <Controller 
                                name={SignUpFields.MAIL}
                                control={methods.control}
                                render={(props) => (
                                    <TextField 
                                        disabled={Boolean(defaultValues)}
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
                </Grid>

                <Grid container justify='flex-start' className={classes.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='נפה'>
                            <Controller
                                name={SignUpFields.COUNTY}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        disabled={Boolean(defaultValues)}
                                        options={counties}
                                        getOptionLabel={(option) => option ? option.displayName : option}
                                        value={props.value}
                                        onChange={(event, selectedCounty) => {
                                            props.onChange(selectedCounty ? selectedCounty.id : null)
                                        }}
                                        onBlur={props.onBlur}
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                test-id={props.name}
                                                placeholder='בחר נפה...'
                                                error={get(methods.errors, props.name)}
                                                label={get(methods.errors, props.name)?.message || COUNTY_LABEL}
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>
                </Grid>
            
                <Grid container justify='flex-start' className={classes.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='מסגרות'>
                            <Controller
                                name={SignUpFields.SOURCE_ORGANIZATION}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        disabled={Boolean(defaultValues)}
                                        options={sourcesOrganization}
                                        getOptionLabel={(option) => option ? option.displayName : option}
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
                </Grid>   

                <Grid container justify='flex-start' className={classes.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='שפות'>
                            <Controller
                                name={SignUpFields.LANGUAGES}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        disabled={Boolean(defaultValues)}
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
                </Grid>
                                        
            </form>
        </FormProvider>
    )

}

interface Props {
    defaultValues?: SignUpUser;
    handleSaveUser?: () => void;
}

export default SignUpForm;

