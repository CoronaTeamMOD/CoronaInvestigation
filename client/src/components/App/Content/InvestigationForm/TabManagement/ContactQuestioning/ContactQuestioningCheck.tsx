import React from 'react';
import { useSelector } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import {
    Avatar,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
} from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import InteractedContactFields from 'models/enums/InteractedContact';

import useStyles from './ContactQuestioningStyles';
import useContactFields from 'Utils/vendor/useContactFields';
import {
    OCCUPATION_LABEL,
    RELEVANT_OCCUPATION_LABEL,
} from '../PersonalInfoTab/PersonalInfoTab';


const ContactQuestioningCheck: React.FC<Props> = (props: Props): JSX.Element => {
    const {control , getValues} = useFormContext();

    const classes = useStyles();

    const occupations = useSelector<StoreStateType , string[]>(state => state.occupations);
    const { index , interactedContact } = props;

    const formValues = getValues().form ? getValues().form[index] : interactedContact
    const { isFieldDisabled } = useContactFields(formValues.contactStatus);

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={4}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>3</Avatar>
                    <Typography><b>תשאול לצורך הפנייה לבדיקה</b></Typography>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='האם חש בטוב?'/>
                        <Controller
                            control={control}
                            name={`form[${index}.${InteractedContactFields.DOES_FEEL_GOOD}]`}
                            defaultValue={interactedContact.doesFeelGood}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled}
                                        test-id='doesFeelGood'
                                        onChange={(event, booleanValue) => {
                                            if(booleanValue !== null) {
                                                props.onChange(booleanValue);
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='האם סובל ממחלות רקע?'/>
                        <Controller
                            control={control}
                            name={`form[${index}.${InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES}]`}
                            defaultValue={interactedContact.doesHaveBackgroundDiseases}
                            render={(props) => {
                                return(
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled}
                                        test-id='doesHaveBackgroundDiseases'
                                        onChange={(event, booleanValue) => {
                                            if(booleanValue !== null) {
                                                props.onChange(booleanValue);
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='האם חי באותו הבית עם המאומת?'/>
                        <Controller
                            control={control}
                            name={`form[${index}.${InteractedContactFields.DOES_LIVE_WITH_CONFIRMED}]`}
                            defaultValue={interactedContact.doesLiveWithConfirmed}
                            render={(props) => {
                                return(
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled}
                                        test-id='doesLiveWithConfirmed'
                                        onChange={(event, booleanValue) => {
                                            if(booleanValue !== null) {
                                                props.onChange(booleanValue);
                                            }
                                        }}
                                    />)
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='מפגש חוזר עם המאומת?'/>
                        <Controller
                            control={control}
                            name={`form[${index}.${InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED}]`}
                            defaultValue={interactedContact.repeatingOccuranceWithConfirmed}
                            render={(props) => {
                                return(
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled}
                                        test-id='repeatingOccuranceWithConfirmed'
                                        onChange={(event, booleanValue) => {
                                            if(booleanValue !== null) {
                                                props.onChange(booleanValue);
                                            }
                                        }}
                                    />)
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={5} fieldName='עבודה עם קהל במסגרת העבודה?'/>
                        <Controller
                            control={control}
                            name={`form[${index}.${InteractedContactFields.DOES_WORK_WITH_CROWD}]`}
                            defaultValue={interactedContact.doesWorkWithCrowd}
                            render={(props) => {
                                return(
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled}
                                        test-id='doesWorkWithCrowd'
                                        onChange={(event, booleanValue) => { 
                                            if(booleanValue !== null) {
                                                props.onChange(booleanValue);
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container justify='space-between'>
                        <FieldName xs={7} fieldName={RELEVANT_OCCUPATION_LABEL}/>
                        <Grid item xs={5}>
                        <Controller
                            control={control}
                            name={`form[${index}.${InteractedContactFields.OCCUPATION}]`}
                            defaultValue={interactedContact.occupation}
                            render={(props) => {
                                return(
                                    <FormControl>
                                        <RadioGroup
                                            {...props}
                                            aria-label={OCCUPATION_LABEL}
                                            >
                                            {
                                                occupations.map((occupation) => {
                                                    return (
                                                        <FormControlLabel
                                                            value={occupation}
                                                            key={occupation}
                                                            control={
                                                                <Radio
                                                                    disabled={isFieldDisabled}
                                                                    color='primary'
                                                                    onChange={(event) => {
                                                                        props.onChange(event.target.value);
                                                                    }}
                                                                />
                                                            }
                                                            label={occupation}
                                                        />
                                                    )
                                                })
                                            }
                                        </RadioGroup>
                                    </FormControl>
                                )
                            }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
};

export default ContactQuestioningCheck;

interface Props {
    index: number,
    interactedContact: InteractedContact;
};
