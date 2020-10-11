
import React from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux';
import StoreStateType from 'redux/storeStateType';
import { yupResolver } from '@hookform/resolvers';
import { Grid, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab';

import City from 'models/City';
import AlphanumericTextField from 'commons/AlphanumericTextField/AlphanumericTextField'
import AlphabetTextField from 'commons/AlphabetTextField/AlphabetTextField';
import FormInput from 'commons/FormInput/FormInput'
import useFormStyles from 'styles/formStyles'

import SignUpFields from './SignUpFields'
import SignUpSchema from './SignUpSchema'
import useSignUpForm from './useSignUpForm'
// import useStyles from './SignUpFormStyles'


const MABAR_USER_NAME = 'שם משתמש מב"ר'
const FIRST_NAME_LABEL = 'שם פרטי'
const LAST_NAME_LABEL = 'שם משפחה'
const CITY_LABEL = 'עיר'
const PHONE_NUMBER_LABEL = 'מספר טלפון'
const ID_LABEL = 'תז'
const MAIL_LABEL = 'מייל'

const SignUpForm: React.FC = () => {
    useSignUpForm();
    const formClasses = useFormStyles();
    // const classes = useStyles();

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(SignUpSchema)
    })

    console.log(methods.getValues())
    const cities = useSelector<StoreStateType, Map<string, City>>(state => state.cities);

    const onSubmit = (data: any) => {
        console.log("hey")
        console.log(data)
    }

    return (
        <FormProvider {...methods}>
            <form id='signUp' onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container justify='flex-start' className={formClasses.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='שם משתמש מב"ר'>
                            <Controller 
                                name={SignUpFields.MABAR_USER_NAME}
                                control={methods.control}
                                render={(props) => (
                                    <AlphanumericTextField
                                        name={props.name}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue as string)}
                                        label={MABAR_USER_NAME}
                                        onBlur={props.onBlur}
                                        errors={methods.errors}
                                        setError={methods.setError}
                                        clearErrors={methods.clearErrors}
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>
                </Grid>

                <Grid container justify='flex-start' className={formClasses.formRow}>
                    <Grid item xs={5}>
                        <FormInput fieldName='שם מלא'>
                            <Controller 
                                name={SignUpFields.FIRST_NAME}
                                control={methods.control}
                                render={(props) => (
                                    <AlphabetTextField
                                        name={props.name}
                                        value={props.value}
                                        onChange={(newValue: string) => props.onChange(newValue as string)}
                                        label={FIRST_NAME_LABEL}
                                        onBlur={props.onBlur}
                                        errors={methods.errors}
                                        setError={methods.setError}
                                        clearErrors={methods.clearErrors}
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>
                    <Grid item xs={5}>
                        <Controller 
                            name={SignUpFields.LAST_NAME}
                            control={methods.control}
                            render={(props) => (
                                <AlphabetTextField
                                    name={props.name}
                                    value={props.value}
                                    onChange={(newValue: string) => props.onChange(newValue as string)}
                                    label={LAST_NAME_LABEL}
                                    onBlur={props.onBlur}
                                    errors={methods.errors}
                                    setError={methods.setError}
                                    clearErrors={methods.clearErrors}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Grid container justify='flex-start' className={formClasses.formRow}> 
                    <Grid item xs={8}>
                        <FormInput fieldName='עיר מגורים'>
                            <Controller
                                name={SignUpFields.CITY}
                                control={methods.control}
                                render={(props) => (
                                    <Autocomplete
                                        options={Array.from(cities, ([id, value]) => ({ id, value }))}
                                        getOptionLabel={(option) => option ? option.value.displayName : option}
                                        // inputValue={isolationCityName}
                                        onChange={(event, selectedCity) => {
                                            props.onChange(selectedCity ? selectedCity.id : null)
                                        }}
                                        onBlur={props.onBlur}
                                        
                                        // onInputChange={(event, selectedCityName) => setIsolationCityName(selectedCityName) }
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                placeholder='בחר עיר...'
                                                error={methods.errors[SignUpFields.CITY]}
                                                label={methods.errors[SignUpFields.CITY] ? 
                                                        methods.errors[SignUpFields.CITY].message :
                                                        CITY_LABEL}
                                            />
                                        }
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>                
                </Grid>   
                
                <Grid container justify='flex-start' className={formClasses.formRow}>  
                    <Grid item xs={8}>
                        <FormInput fieldName='טלפון'>   
                            <Controller 
                                name={SignUpFields.PHONE_NUMBER}
                                control={methods.control}
                                render={(props) => (
                                    <TextField 
                                        value={props.value}
                                        onChange={event => props.onChange(event.target.value as string)}
                                        onBlur={props.onBlur}
                                        error={methods.errors[props.name]}
                                        label={methods.errors[props.name]? methods.errors[props.name].message: PHONE_NUMBER_LABEL}
                                    />
                                )}
                            />
                        </FormInput> 
                    </Grid>                   
                </Grid>  

                <Grid container justify='flex-start' className={formClasses.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='ת"ז'>
                            <Controller 
                                name={SignUpFields.ID}
                                control={methods.control}
                                render={(props) => (
                                    <TextField 
                                        value={props.value}
                                        onChange={event => props.onChange(event.target.value as string)}
                                        onBlur={props.onBlur}
                                        error={methods.errors[props.name]}
                                        label={methods.errors[props.name] ? methods.errors[props.name].message : ID_LABEL}
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>
                </Grid>

                <Grid container justify='flex-start' className={formClasses.formRow}>
                    <Grid item xs={8}>
                        <FormInput fieldName='מייל'>
                            <Controller 
                                name={SignUpFields.MAIL}
                                control={methods.control}
                                render={(props) => (
                                    <TextField 
                                        value={props.value}
                                        onChange={event => props.onChange(event.target.value as string)}
                                        onBlur={props.onBlur}
                                        error={methods.errors[props.name]}
                                        label={methods.errors[props.name] ? methods.errors[props.name].message: MAIL_LABEL}
                                    />
                                )}
                            />
                        </FormInput>
                    </Grid>
                </Grid>

                <Grid container justify='flex-start' className={formClasses.formRow}>
                    <FormInput fieldName='שיוך ארגוני'>

                    </FormInput>
                </Grid>
            </form>
        </FormProvider>
    )

}

export default SignUpForm;

