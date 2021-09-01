import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useFormContext } from 'react-hook-form';
import { Avatar, FormControl, Select, Grid, MenuItem, Typography } from '@material-ui/core';

import Toggle from 'commons/Toggle/Toggle';
import StoreStateType from 'redux/storeStateType';
import FieldName from 'commons/FieldName/FieldName';
import InteractedContact from 'models/InteractedContact';
import useContactFields from 'Utils/Contacts/useContactFields';
import InteractedContactFields from 'models/enums/InteractedContact';
import InlineErrorText from 'commons/InlineErrorText/InlineErrorText';

import useStyles from './ContactQuestioningStyles';
import ContactQuestioningFieldsNames from './ContactQuestioningFieldsNames';
import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import { setInteractedContact } from 'redux/InteractedContacts/interactedContactsActionCreators';

const ContactQuestioningCheck: React.FC<Props> = (props: Props): JSX.Element => {

    const { interactedContact, isViewMode } = props;
    const { errors, watch, ...methods } = useFormContext<GroupedInteractedContact>();

    const classes = useStyles();

    const dispatch = useDispatch();

    const occupations = useSelector<StoreStateType, string[]>(state => state.occupations);

    const { isFieldDisabled } = useContactFields(methods.getValues("contactStatus"));

    useEffect(() => {
        methods.trigger();
    }, []);

    return (
        <Grid item xs={4}>
            <Grid container direction='column' spacing={2}>
                <Grid container item direction='row' alignItems='center'>
                    <Avatar className={classes.avatar}>3</Avatar>
                    <Typography><b>תשאול לצורך הפנייה לבדיקה</b></Typography>
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.DOES_FEEL_GOOD} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.DOES_FEEL_GOOD}`}
                            defaultValue={interactedContact.doesFeelGood}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || isViewMode}
                                        test-id='doesFeelGood'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                props.onChange(booleanValue);
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_FEEL_GOOD, booleanValue))
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        error={errors && errors[InteractedContactFields.DOES_FEEL_GOOD]}
                    />
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.DOES_HAVE_BACKGROUND_DISEASES} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES}`}
                            defaultValue={interactedContact.doesHaveBackgroundDiseases}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || isViewMode}
                                        test-id='doesHaveBackgroundDiseases'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                props.onChange(booleanValue);
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES, booleanValue));
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        error={errors && errors[InteractedContactFields.DOES_HAVE_BACKGROUND_DISEASES]}
                    />
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.DOES_LIVE_WITH_CONFIRMED} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.DOES_LIVE_WITH_CONFIRMED}`}
                            defaultValue={interactedContact.doesLiveWithConfirmed}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || isViewMode}
                                        test-id='doesLiveWithConfirmed'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                props.onChange(booleanValue);
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_LIVE_WITH_CONFIRMED, booleanValue));
                                            }
                                        }}
                                    />)
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        error={errors && errors[InteractedContactFields.DOES_LIVE_WITH_CONFIRMED]}
                    />
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.REPEATING_OCCURANCE_WITH_CONFIRMED} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED}`}
                            defaultValue={interactedContact.repeatingOccuranceWithConfirmed}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || isViewMode}
                                        test-id='repeatingOccuranceWithConfirmed'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                props.onChange(booleanValue);
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED, booleanValue));
                                            }
                                        }}
                                    />)
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        error={errors && errors[InteractedContactFields.REPEATING_OCCURANCE_WITH_CONFIRMED]}
                    />
                </Grid>

                <Grid item>
                    <Grid container>
                        <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.DOES_WORK_WITH_CROWD} className={classes.fieldName} />
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.DOES_WORK_WITH_CROWD}`}
                            defaultValue={interactedContact.doesWorkWithCrowd}
                            render={(props) => {
                                return (
                                    <Toggle
                                        {...props}
                                        disabled={isFieldDisabled || isViewMode}
                                        test-id='doesWorkWithCrowd'
                                        onChange={(event, booleanValue) => {
                                            if (booleanValue !== null) {
                                                props.onChange(booleanValue);
                                                dispatch(setInteractedContact(interactedContact.id, InteractedContactFields.DOES_WORK_WITH_CROWD, booleanValue));
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </Grid>
                    <InlineErrorText
                        error={errors && errors[InteractedContactFields.DOES_WORK_WITH_CROWD]}
                    />
                </Grid>

                <Grid item container>
                    <FieldName xs={5} fieldName={ContactQuestioningFieldsNames.OCCUPATION} className={classes.fieldName} />
                    <Grid item xs={5}>
                        <Controller
                            control={methods.control}
                            name={`${InteractedContactFields.OCCUPATION}`}
                            defaultValue={interactedContact.occupation}
                            render={(props) => {
                                return (
                                    <FormControl variant='outlined' fullWidth>
                                        <Select
                                            {...props}
                                            placeholder={ContactQuestioningFieldsNames.OCCUPATION}
                                            disabled={isFieldDisabled || isViewMode}
                                            onChange={(event) => {
                                                props.onChange(event.target.value);
                                                dispatch(setInteractedContact(interactedContact.id,InteractedContactFields.OCCUPATION,event.target.value as number));
                                            }}>
                                            {
                                                occupations?.length > 0 && occupations.map((occupation) => (
                                                    <MenuItem className={classes.menuItem}
                                                        key={occupation}
                                                        value={occupation}>
                                                        {occupation}
                                                    </MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                )
                            }}
                        />
                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    )
};

export default ContactQuestioningCheck;

interface Props {
    interactedContact: InteractedContact;
    isViewMode?: boolean;
};